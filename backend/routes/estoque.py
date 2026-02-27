from fastapi import APIRouter, HTTPException
from typing import List
from models.estoque import EstoqueItem, EstoqueItemCreate, Emprestimo, EmprestimoCreate, EPI, EPICreate
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone, date

def get_estoque_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/estoque", tags=["Estoque"])
    
    # ==================== EMPRÉSTIMOS ====================
    @router.post("/emprestimos", response_model=Emprestimo, status_code=201)
    async def criar_emprestimo(emprestimo: EmprestimoCreate):
        emprestimo_obj = Emprestimo(**emprestimo.model_dump())
        
        doc = emprestimo_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        if 'data_emprestimo' in doc and hasattr(doc['data_emprestimo'], 'isoformat'):
            doc['data_emprestimo'] = doc['data_emprestimo'].isoformat()
        if 'data_prevista_devolucao' in doc and hasattr(doc['data_prevista_devolucao'], 'isoformat'):
            doc['data_prevista_devolucao'] = doc['data_prevista_devolucao'].isoformat()
        if doc.get('data_devolucao') and hasattr(doc['data_devolucao'], 'isoformat'):
            doc['data_devolucao'] = doc['data_devolucao'].isoformat()
        
        await db.emprestimos.insert_one(doc)
        return emprestimo_obj
    
    @router.get("/emprestimos", response_model=List[Emprestimo])
    async def listar_emprestimos(tipo: str = None, status: str = None):
        query = {}
        if tipo:
            query['tipo'] = tipo
        if status:
            query['status'] = status
        
        emprestimos = await db.emprestimos.find(query, {"_id": 0}).to_list(1000)
        
        for e in emprestimos:
            if isinstance(e.get('created_at'), str):
                e['created_at'] = datetime.fromisoformat(e['created_at'])
            if isinstance(e.get('updated_at'), str):
                e['updated_at'] = datetime.fromisoformat(e['updated_at'])
            if isinstance(e.get('data_emprestimo'), str):
                e['data_emprestimo'] = date.fromisoformat(e['data_emprestimo'])
            if isinstance(e.get('data_prevista_devolucao'), str):
                e['data_prevista_devolucao'] = date.fromisoformat(e['data_prevista_devolucao'])
            if e.get('data_devolucao') and isinstance(e['data_devolucao'], str):
                e['data_devolucao'] = date.fromisoformat(e['data_devolucao'])
        
        return emprestimos
    
    # ==================== EPIs ====================
    @router.post("/epis", response_model=EPI, status_code=201)
    async def criar_epi(epi: EPICreate):
        epi_obj = EPI(**epi.model_dump())
        
        doc = epi_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        if doc.get('validade') and hasattr(doc['validade'], 'isoformat'):
            doc['validade'] = doc['validade'].isoformat()
        
        await db.epis.insert_one(doc)
        return epi_obj
    
    @router.get("/epis", response_model=List[EPI])
    async def listar_epis(status: str = None):
        query = {}
        if status:
            query['status'] = status
        
        epis = await db.epis.find(query, {"_id": 0}).to_list(1000)
        
        for e in epis:
            if isinstance(e.get('created_at'), str):
                e['created_at'] = datetime.fromisoformat(e['created_at'])
            if isinstance(e.get('updated_at'), str):
                e['updated_at'] = datetime.fromisoformat(e['updated_at'])
            if e.get('validade') and isinstance(e['validade'], str):
                e['validade'] = date.fromisoformat(e['validade'])
        
        return epis
    
    @router.get("/epis/alertas")
    async def alertas_epis():
        """Retorna EPIs com estoque baixo"""
        epis = await db.epis.find({}, {"_id": 0}).to_list(1000)
        
        alertas = []
        for epi in epis:
            if epi['quantidade_estoque'] <= epi['quantidade_minima']:
                alertas.append({
                    "id": epi['id'],
                    "tipo": epi['tipo'],
                    "marca": epi['marca'],
                    "quantidade_atual": epi['quantidade_estoque'],
                    "quantidade_minima": epi['quantidade_minima'],
                    "nivel": "critico" if epi['quantidade_estoque'] == 0 else "baixo"
                })
        
        return {"total_alertas": len(alertas), "alertas": alertas}
    
    return router
