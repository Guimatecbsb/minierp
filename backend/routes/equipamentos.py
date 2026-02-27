from fastapi import APIRouter, HTTPException
from typing import List
from models.equipamentos import Equipamento, EquipamentoCreate, EquipamentoUpdate
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone

def get_equipamentos_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/equipamentos", tags=["Equipamentos"])
    
    @router.post("", response_model=Equipamento, status_code=201)
    async def criar_equipamento(equipamento: EquipamentoCreate):
        equipamento_obj = Equipamento(**equipamento.model_dump())
        
        doc = equipamento_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        
        await db.equipamentos.insert_one(doc)
        return equipamento_obj
    
    @router.get("", response_model=List[Equipamento])
    async def listar_equipamentos(tipo: str = None):
        query = {}
        if tipo:
            query['tipo'] = tipo
        
        equipamentos = await db.equipamentos.find(query, {"_id": 0}).to_list(1000)
        
        for e in equipamentos:
            if isinstance(e.get('created_at'), str):
                e['created_at'] = datetime.fromisoformat(e['created_at'])
            if isinstance(e.get('updated_at'), str):
                e['updated_at'] = datetime.fromisoformat(e['updated_at'])
        
        return equipamentos
    
    @router.get("/{equipamento_id}", response_model=Equipamento)
    async def obter_equipamento(equipamento_id: str):
        equipamento = await db.equipamentos.find_one({"id": equipamento_id}, {"_id": 0})
        
        if not equipamento:
            raise HTTPException(status_code=404, detail="Equipamento não encontrado")
        
        if isinstance(equipamento.get('created_at'), str):
            equipamento['created_at'] = datetime.fromisoformat(equipamento['created_at'])
        if isinstance(equipamento.get('updated_at'), str):
            equipamento['updated_at'] = datetime.fromisoformat(equipamento['updated_at'])
        
        return equipamento
    
    @router.put("/{equipamento_id}", response_model=Equipamento)
    async def atualizar_equipamento(equipamento_id: str, equipamento_update: EquipamentoUpdate):
        existing = await db.equipamentos.find_one({"id": equipamento_id})
        
        if not existing:
            raise HTTPException(status_code=404, detail="Equipamento não encontrado")
        
        update_data = {k: v for k, v in equipamento_update.model_dump().items() if v is not None}
        update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
        
        await db.equipamentos.update_one({"id": equipamento_id}, {"$set": update_data})
        
        updated = await db.equipamentos.find_one({"id": equipamento_id}, {"_id": 0})
        
        if isinstance(updated.get('created_at'), str):
            updated['created_at'] = datetime.fromisoformat(updated['created_at'])
        if isinstance(updated.get('updated_at'), str):
            updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
        
        return updated
    
    @router.delete("/{equipamento_id}", status_code=204)
    async def deletar_equipamento(equipamento_id: str):
        result = await db.equipamentos.delete_one({"id": equipamento_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Equipamento não encontrado")
        
        return None
    
    return router