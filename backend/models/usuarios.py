from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import Optional
from datetime import datetime, timezone
import uuid

class UsuarioBase(BaseModel):
    nome: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    funcao: Optional[str] = None
    status: str = Field(default="ativo")  # ativo, inativo
    nivel_acesso: str = Field(default="usuario")  # admin, usuario, visualizador

class UsuarioCreate(UsuarioBase):
    senha: str = Field(..., min_length=6)

class UsuarioUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    funcao: Optional[str] = None
    status: Optional[str] = None
    nivel_acesso: Optional[str] = None
    senha: Optional[str] = None

class Usuario(UsuarioBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    senha_hash: str = Field(default="")  # Armazenar hash, não a senha
    ultimo_acesso: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))