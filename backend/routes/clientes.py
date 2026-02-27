from fastapi import APIRouter, HTTPException
from typing import List
from models.clientes import Cliente, ClienteCreate, ClienteUpdate
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone

def get_clientes_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/clientes", tags=["Clientes"])
    
    @router.post("", response_model=Cliente, status_code=201)
    async def criar_cliente(cliente: ClienteCreate):
        cliente_obj = Cliente(**cliente.model_dump())
        
        # Gerar código de cadastro automático
        count = await db.clientes.count_documents({})
        cliente_obj.codigo_cadastro = f"CLI-{str(count + 1).zfill(6)}"
        
        doc = cliente_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        
        await db.clientes.insert_one(doc)
        return cliente_obj
    
    @router.get("", response_model=List[Cliente])
    async def listar_clientes():
        clientes = await db.clientes.find({}, {"_id": 0}).to_list(1000)
        
        for c in clientes:
            if isinstance(c.get('created_at'), str):
                c['created_at'] = datetime.fromisoformat(c['created_at'])
            if isinstance(c.get('updated_at'), str):
                c['updated_at'] = datetime.fromisoformat(c['updated_at'])
        
        return clientes
    
    @router.get("/{cliente_id}", response_model=Cliente)
    async def obter_cliente(cliente_id: str):
        cliente = await db.clientes.find_one({"id": cliente_id}, {"_id": 0})
        
        if not cliente:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")
        
        if isinstance(cliente.get('created_at'), str):
            cliente['created_at'] = datetime.fromisoformat(cliente['created_at'])
        if isinstance(cliente.get('updated_at'), str):
            cliente['updated_at'] = datetime.fromisoformat(cliente['updated_at'])
        
        return cliente
    
    @router.put("/{cliente_id}", response_model=Cliente)
    async def atualizar_cliente(cliente_id: str, cliente_update: ClienteUpdate):
        existing = await db.clientes.find_one({"id": cliente_id})
        
        if not existing:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")
        
        update_data = {k: v for k, v in cliente_update.model_dump().items() if v is not None}
        update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
        
        await db.clientes.update_one({"id": cliente_id}, {"$set": update_data})
        
        updated = await db.clientes.find_one({"id": cliente_id}, {"_id": 0})
        
        if isinstance(updated.get('created_at'), str):
            updated['created_at'] = datetime.fromisoformat(updated['created_at'])
        if isinstance(updated.get('updated_at'), str):
            updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
        
        return updated
    
    @router.delete("/{cliente_id}", status_code=204)
    async def deletar_cliente(cliente_id: str):
        result = await db.clientes.delete_one({"id": cliente_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")
        
        return None
    
    return router