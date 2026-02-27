from fastapi import APIRouter, HTTPException
from typing import List
from models.operacional import (
    Atividade, AtividadeCreate,
    Camarin, CamarimCreate,
    ArCondicionado, ArCondicionadoCreate,
    Eletrica, EletricaCreate,
    Checklist, ChecklistCreate
)
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone, date

def get_operacional_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/operacional", tags=["Operacional"])
    
    # ==================== ATIVIDADES ====================
    @router.post("/atividades", response_model=Atividade, status_code=201)
    async def criar_atividade(atividade: AtividadeCreate):
        atividade_obj = Atividade(**atividade.model_dump())
        
        doc = atividade_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        
        await db.atividades.insert_one(doc)
        return atividade_obj
    
    @router.get("/atividades", response_model=List[Atividade])
    async def listar_atividades(tipo: str = None):
        query = {}
        if tipo:
            query['tipo'] = tipo
        
        atividades = await db.atividades.find(query, {"_id": 0}).to_list(1000)
        
        for a in atividades:
            if isinstance(a.get('created_at'), str):
                a['created_at'] = datetime.fromisoformat(a['created_at'])
            if isinstance(a.get('updated_at'), str):
                a['updated_at'] = datetime.fromisoformat(a['updated_at'])
        
        return atividades
    
    # ==================== CAMARINS ====================
    @router.post("/camarins", response_model=Camarin, status_code=201)
    async def criar_camarin(camarin: CamarimCreate):
        camarin_obj = Camarin(**camarin.model_dump())
        
        doc = camarin_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        
        await db.camarins.insert_one(doc)
        return camarin_obj
    
    @router.get("/camarins", response_model=List[Camarin])
    async def listar_camarins(status: str = None):
        query = {}
        if status:
            query['status'] = status
        
        camarins = await db.camarins.find(query, {"_id": 0}).to_list(1000)
        
        for c in camarins:
            if isinstance(c.get('created_at'), str):
                c['created_at'] = datetime.fromisoformat(c['created_at'])
            if isinstance(c.get('updated_at'), str):
                c['updated_at'] = datetime.fromisoformat(c['updated_at'])
        
        return camarins
    
    # ==================== AR CONDICIONADO ====================
    @router.post("/ar-condicionado", response_model=ArCondicionado, status_code=201)
    async def criar_ar_condicionado(ar: ArCondicionadoCreate):
        ar_obj = ArCondicionado(**ar.model_dump())
        
        doc = ar_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        if doc.get('data_ultima_manutencao') and hasattr(doc['data_ultima_manutencao'], 'isoformat'):
            doc['data_ultima_manutencao'] = doc['data_ultima_manutencao'].isoformat()
        if doc.get('data_proxima_manutencao') and hasattr(doc['data_proxima_manutencao'], 'isoformat'):
            doc['data_proxima_manutencao'] = doc['data_proxima_manutencao'].isoformat()
        
        await db.ar_condicionado.insert_one(doc)
        return ar_obj
    
    @router.get("/ar-condicionado", response_model=List[ArCondicionado])
    async def listar_ar_condicionado(status: str = None):
        query = {}
        if status:
            query['status'] = status
        
        ars = await db.ar_condicionado.find(query, {"_id": 0}).to_list(1000)
        
        for ar in ars:
            if isinstance(ar.get('created_at'), str):
                ar['created_at'] = datetime.fromisoformat(ar['created_at'])
            if isinstance(ar.get('updated_at'), str):
                ar['updated_at'] = datetime.fromisoformat(ar['updated_at'])
            if ar.get('data_ultima_manutencao') and isinstance(ar['data_ultima_manutencao'], str):
                ar['data_ultima_manutencao'] = date.fromisoformat(ar['data_ultima_manutencao'])
            if ar.get('data_proxima_manutencao') and isinstance(ar['data_proxima_manutencao'], str):
                ar['data_proxima_manutencao'] = date.fromisoformat(ar['data_proxima_manutencao'])
        
        return ars
    
    # ==================== ELÉTRICA ====================
    @router.post("/eletrica", response_model=Eletrica, status_code=201)
    async def criar_eletrica(eletrica: EletricaCreate):
        eletrica_obj = Eletrica(**eletrica.model_dump())
        
        doc = eletrica_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        
        await db.eletrica.insert_one(doc)
        return eletrica_obj
    
    @router.get("/eletrica", response_model=List[Eletrica])
    async def listar_eletrica(tipo: str = None, status: str = None):
        query = {}
        if tipo:
            query['tipo'] = tipo
        if status:
            query['status'] = status
        
        eletricas = await db.eletrica.find(query, {"_id": 0}).to_list(1000)
        
        for e in eletricas:
            if isinstance(e.get('created_at'), str):
                e['created_at'] = datetime.fromisoformat(e['created_at'])
            if isinstance(e.get('updated_at'), str):
                e['updated_at'] = datetime.fromisoformat(e['updated_at'])
        
        return eletricas
    
    # ==================== CHECKLISTS ====================
    @router.post("/checklists", response_model=Checklist, status_code=201)
    async def criar_checklist(checklist: ChecklistCreate):
        checklist_obj = Checklist(**checklist.model_dump())
        
        doc = checklist_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        if 'data_prevista' in doc and hasattr(doc['data_prevista'], 'isoformat'):
            doc['data_prevista'] = doc['data_prevista'].isoformat()
        if doc.get('data_conclusao') and hasattr(doc['data_conclusao'], 'isoformat'):
            doc['data_conclusao'] = doc['data_conclusao'].isoformat()
        
        await db.checklists.insert_one(doc)
        return checklist_obj
    
    @router.get("/checklists", response_model=List[Checklist])
    async def listar_checklists(tipo: str = None, status: str = None):
        query = {}
        if tipo:
            query['tipo'] = tipo
        if status:
            query['status'] = status
        
        checklists = await db.checklists.find(query, {"_id": 0}).to_list(1000)
        
        for c in checklists:
            if isinstance(c.get('created_at'), str):
                c['created_at'] = datetime.fromisoformat(c['created_at'])
            if isinstance(c.get('updated_at'), str):
                c['updated_at'] = datetime.fromisoformat(c['updated_at'])
            if isinstance(c.get('data_prevista'), str):
                c['data_prevista'] = date.fromisoformat(c['data_prevista'])
            if c.get('data_conclusao') and isinstance(c['data_conclusao'], str):
                c['data_conclusao'] = datetime.fromisoformat(c['data_conclusao'])
        
        return checklists
    
    return router
