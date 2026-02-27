from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, EmailStr
from datetime import timedelta
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from models.usuarios import Usuario, UsuarioCreate

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class UserResponse(BaseModel):
    id: str
    nome: str
    email: str
    nivel_acesso: str
    funcao: str | None = None

def get_auth_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/auth", tags=["Autenticação"])
    
    @router.post("/register", response_model=UserResponse, status_code=201)
    async def registrar_usuario(usuario: UsuarioCreate):
        """Registra um novo usuário"""
        # Verificar se email já existe
        existing = await db.usuarios.find_one({"email": usuario.email})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já cadastrado"
            )
        
        # Criar usuário
        usuario_obj = Usuario(**usuario.model_dump(exclude={"senha"}))
        usuario_obj.senha_hash = get_password_hash(usuario.senha)
        
        doc = usuario_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        if doc.get('ultimo_acesso'):
            doc['ultimo_acesso'] = doc['ultimo_acesso'].isoformat()
        
        await db.usuarios.insert_one(doc)
        
        return UserResponse(
            id=usuario_obj.id,
            nome=usuario_obj.nome,
            email=usuario_obj.email,
            nivel_acesso=usuario_obj.nivel_acesso,
            funcao=usuario_obj.funcao
        )
    
    @router.post("/login", response_model=Token)
    async def login(form_data: OAuth2PasswordRequestForm = Depends()):
        """Login do usuário"""
        # Buscar usuário por email
        user = await db.usuarios.find_one({"email": form_data.username}, {"_id": 0})
        
        if not user or not verify_password(form_data.password, user['senha_hash']):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Criar token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={
                "sub": user['id'],
                "email": user['email'],
                "nivel_acesso": user['nivel_acesso']
            },
            expires_delta=access_token_expires
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            user={
                "id": user['id'],
                "nome": user['nome'],
                "email": user['email'],
                "nivel_acesso": user['nivel_acesso'],
                "funcao": user.get('funcao')
            }
        )
    
    @router.get("/me", response_model=UserResponse)
    async def get_me(current_user: dict = Depends(get_current_user)):
        """Obtém informações do usuário atual"""
        user = await db.usuarios.find_one({"id": current_user['sub']}, {"_id": 0})
        
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
        return UserResponse(
            id=user['id'],
            nome=user['nome'],
            email=user['email'],
            nivel_acesso=user['nivel_acesso'],
            funcao=user.get('funcao')
        )
    
    @router.post("/create-admin")
    async def criar_admin_inicial():
        """Cria usuário admin inicial (apenas se não existir nenhum)"""
        # Verificar se já existe algum admin
        admin_exists = await db.usuarios.find_one({"nivel_acesso": "admin"})
        
        if admin_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Já existe um administrador cadastrado"
            )
        
        # Criar admin padrão
        admin_data = UsuarioCreate(
            nome="Administrador",
            email="admin@jbestruturas.com",
            senha="admin123",
            nivel_acesso="admin",
            funcao="Administrador do Sistema"
        )
        
        admin_obj = Usuario(**admin_data.model_dump(exclude={"senha"}))
        admin_obj.senha_hash = get_password_hash(admin_data.senha)
        
        doc = admin_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        if doc.get('ultimo_acesso'):
            doc['ultimo_acesso'] = doc['ultimo_acesso'].isoformat()
        
        await db.usuarios.insert_one(doc)
        
        return {
            "message": "Administrador criado com sucesso",
            "email": "admin@jbestruturas.com",
            "senha": "admin123",
            "aviso": "ALTERE A SENHA IMEDIATAMENTE!"
        }
    
    @router.get("/users", response_model=list[UserResponse])
    async def listar_usuarios():
        """Lista todos os usuários"""
        usuarios = await db.usuarios.find({}, {"_id": 0, "senha_hash": 0}).to_list(1000)
        return usuarios
    
    @router.delete("/users/{user_id}")
    async def deletar_usuario(user_id: str):
        """Deleta um usuário"""
        result = await db.usuarios.delete_one({"id": user_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        return {"message": "Usuário deletado com sucesso"}
    
    return router
