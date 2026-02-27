from fastapi import APIRouter, HTTPException
from typing import List
from models.clientes import Cliente, ClienteCreate, ClienteUpdate
from models.fornecedores import Fornecedor, FornecedorCreate, FornecedorUpdate
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone

def get_compras_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/compras", tags=["Compras"])
    
    # ==================== FORNECEDORES ====================
    @router.post("/fornecedores", response_model=Fornecedor, status_code=201)
    async def criar_fornecedor(fornecedor: FornecedorCreate):
        fornecedor_obj = Fornecedor(**fornecedor.model_dump())
        
        # Gerar código de cadastro automático
        count = await db.fornecedores.count_documents({})
        fornecedor_obj.codigo_cadastro = f"FOR-{str(count + 1).zfill(6)}"
        
        doc = fornecedor_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        
        await db.fornecedores.insert_one(doc)
        return fornecedor_obj
    
    @router.get("/fornecedores", response_model=List[Fornecedor])
    async def listar_fornecedores():
        fornecedores = await db.fornecedores.find({}, {"_id": 0}).to_list(1000)
        
        for f in fornecedores:
            if isinstance(f.get('created_at'), str):
                f['created_at'] = datetime.fromisoformat(f['created_at'])
            if isinstance(f.get('updated_at'), str):
                f['updated_at'] = datetime.fromisoformat(f['updated_at'])
        
        return fornecedores
    
    @router.get("/fornecedores/{fornecedor_id}", response_model=Fornecedor)
    async def obter_fornecedor(fornecedor_id: str):
        fornecedor = await db.fornecedores.find_one({"id": fornecedor_id}, {"_id": 0})
        
        if not fornecedor:
            raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
        
        if isinstance(fornecedor.get('created_at'), str):
            fornecedor['created_at'] = datetime.fromisoformat(fornecedor['created_at'])
        if isinstance(fornecedor.get('updated_at'), str):
            fornecedor['updated_at'] = datetime.fromisoformat(fornecedor['updated_at'])
        
        return fornecedor
    
    @router.put("/fornecedores/{fornecedor_id}", response_model=Fornecedor)
    async def atualizar_fornecedor(fornecedor_id: str, fornecedor_update: FornecedorUpdate):
        existing = await db.fornecedores.find_one({"id": fornecedor_id})
        
        if not existing:
            raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
        
        update_data = {k: v for k, v in fornecedor_update.model_dump().items() if v is not None}
        update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
        
        await db.fornecedores.update_one({"id": fornecedor_id}, {"$set": update_data})
        
        updated = await db.fornecedores.find_one({"id": fornecedor_id}, {"_id": 0})
        
        if isinstance(updated.get('created_at'), str):
            updated['created_at'] = datetime.fromisoformat(updated['created_at'])
        if isinstance(updated.get('updated_at'), str):
            updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
        
        return updated
    
    @router.delete("/fornecedores/{fornecedor_id}", status_code=204)
    async def deletar_fornecedor(fornecedor_id: str):
        result = await db.fornecedores.delete_one({"id": fornecedor_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
        
        return None
    
    return router