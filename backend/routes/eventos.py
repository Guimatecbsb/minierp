from fastapi import APIRouter, HTTPException
from typing import List
from models.eventos import Evento, EventoCreate, EventoUpdate
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone, date

def get_eventos_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/eventos", tags=["Eventos"])
    
    @router.post("", response_model=Evento, status_code=201)
    async def criar_evento(evento: EventoCreate):
        evento_obj = Evento(**evento.model_dump())
        
        doc = evento_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        if 'data_evento' in doc and hasattr(doc['data_evento'], 'isoformat'):
            doc['data_evento'] = doc['data_evento'].isoformat()
        
        await db.eventos.insert_one(doc)
        return evento_obj
    
    @router.get("", response_model=List[Evento])
    async def listar_eventos(status: str = None, data_inicio: str = None, data_fim: str = None):
        query = {}
        
        if status:
            query['status'] = status
        
        if data_inicio and data_fim:
            query['data_evento'] = {
                '$gte': data_inicio,
                '$lte': data_fim
            }
        
        eventos = await db.eventos.find(query, {"_id": 0}).to_list(1000)
        
        for e in eventos:
            if isinstance(e.get('created_at'), str):
                e['created_at'] = datetime.fromisoformat(e['created_at'])
            if isinstance(e.get('updated_at'), str):
                e['updated_at'] = datetime.fromisoformat(e['updated_at'])
            if isinstance(e.get('data_evento'), str):
                e['data_evento'] = date.fromisoformat(e['data_evento'])
        
        return eventos
    
    @router.get("/{evento_id}", response_model=Evento)
    async def obter_evento(evento_id: str):
        evento = await db.eventos.find_one({"id": evento_id}, {"_id": 0})
        
        if not evento:
            raise HTTPException(status_code=404, detail="Evento não encontrado")
        
        if isinstance(evento.get('created_at'), str):
            evento['created_at'] = datetime.fromisoformat(evento['created_at'])
        if isinstance(evento.get('updated_at'), str):
            evento['updated_at'] = datetime.fromisoformat(evento['updated_at'])
        if isinstance(evento.get('data_evento'), str):
            evento['data_evento'] = date.fromisoformat(evento['data_evento'])
        
        return evento
    
    @router.put("/{evento_id}", response_model=Evento)
    async def atualizar_evento(evento_id: str, evento_update: EventoUpdate):
        existing = await db.eventos.find_one({"id": evento_id})
        
        if not existing:
            raise HTTPException(status_code=404, detail="Evento não encontrado")
        
        update_data = {k: v for k, v in evento_update.model_dump().items() if v is not None}
        update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
        
        # Convert date to isoformat if present
        if 'data_evento' in update_data and hasattr(update_data['data_evento'], 'isoformat'):
            update_data['data_evento'] = update_data['data_evento'].isoformat()
        
        await db.eventos.update_one({"id": evento_id}, {"$set": update_data})
        
        updated = await db.eventos.find_one({"id": evento_id}, {"_id": 0})
        
        if isinstance(updated.get('created_at'), str):
            updated['created_at'] = datetime.fromisoformat(updated['created_at'])
        if isinstance(updated.get('updated_at'), str):
            updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
        if isinstance(updated.get('data_evento'), str):
            updated['data_evento'] = date.fromisoformat(updated['data_evento'])
        
        return updated
    
    @router.delete("/{evento_id}", status_code=204)
    async def deletar_evento(evento_id: str):
        result = await db.eventos.delete_one({"id": evento_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Evento não encontrado")
        
        return None
    
    # Endpoint para estatísticas do dashboard
    @router.get("/stats/dashboard")
    async def estatisticas_dashboard():
        hoje = date.today().isoformat()
        
        # Contar eventos por status
        total_eventos = await db.eventos.count_documents({})
        eventos_hoje = await db.eventos.count_documents({"data_evento": hoje})
        eventos_andamento = await db.eventos.count_documents({"status": "andamento"})
        eventos_programados = await db.eventos.count_documents({"status": "programado"})
        
        # Eventos do dia
        eventos_dia = await db.eventos.find(
            {"data_evento": hoje},
            {"_id": 0}
        ).to_list(100)
        
        return {
            "total_eventos": total_eventos,
            "eventos_hoje": eventos_hoje,
            "eventos_andamento": eventos_andamento,
            "eventos_programados": eventos_programados,
            "eventos_do_dia": eventos_dia
        }
    
    return router
