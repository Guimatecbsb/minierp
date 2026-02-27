from fastapi import APIRouter, HTTPException
from typing import List
from models.clientes import Cliente, ClienteCreate, ClienteUpdate
from models.fornecedores import Fornecedor, FornecedorCreate, FornecedorUpdate
from models.compras import OrdemCompra, OrdemCompraCreate, Orcamento, OrcamentoCreate
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone, date

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
    
    # ==================== ORDENS DE COMPRA ====================
    @router.post("/ordens", response_model=OrdemCompra, status_code=201)
    async def criar_ordem_compra(ordem: OrdemCompraCreate):
        ordem_obj = OrdemCompra(**ordem.model_dump())
        
        # Gerar número automático
        count = await db.ordens_compra.count_documents({})
        ordem_obj.numero_ordem = f"ORD-{str(count + 1).zfill(6)}"
        
        doc = ordem_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        if 'data_ordem' in doc and hasattr(doc['data_ordem'], 'isoformat'):
            doc['data_ordem'] = doc['data_ordem'].isoformat()
        
        await db.ordens_compra.insert_one(doc)
        return ordem_obj
    
    @router.get("/ordens", response_model=List[OrdemCompra])
    async def listar_ordens():
        ordens = await db.ordens_compra.find({}, {"_id": 0}).to_list(1000)
        
        for o in ordens:
            if isinstance(o.get('created_at'), str):
                o['created_at'] = datetime.fromisoformat(o['created_at'])
            if isinstance(o.get('updated_at'), str):
                o['updated_at'] = datetime.fromisoformat(o['updated_at'])
            if isinstance(o.get('data_ordem'), str):
                o['data_ordem'] = date.fromisoformat(o['data_ordem'])
        
        return ordens
    
    # ==================== ORÇAMENTOS ====================
    @router.post("/orcamentos", response_model=Orcamento, status_code=201)
    async def criar_orcamento(orcamento: OrcamentoCreate):
        orcamento_obj = Orcamento(**orcamento.model_dump())
        
        # Gerar número automático
        count = await db.orcamentos.count_documents({})
        orcamento_obj.numero_orcamento = f"ORC-{str(count + 1).zfill(6)}"
        
        doc = orcamento_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        if 'validade' in doc and doc['validade'] and hasattr(doc['validade'], 'isoformat'):
            doc['validade'] = doc['validade'].isoformat()
        
        await db.orcamentos.insert_one(doc)
        return orcamento_obj
    
    @router.get("/orcamentos", response_model=List[Orcamento])
    async def listar_orcamentos(status: str = None):
        query = {}
        if status:
            query['status'] = status
        
        orcamentos = await db.orcamentos.find(query, {"_id": 0}).to_list(1000)
        
        for o in orcamentos:
            if isinstance(o.get('created_at'), str):
                o['created_at'] = datetime.fromisoformat(o['created_at'])
            if isinstance(o.get('updated_at'), str):
                o['updated_at'] = datetime.fromisoformat(o['updated_at'])
            if o.get('validade') and isinstance(o['validade'], str):
                o['validade'] = date.fromisoformat(o['validade'])
        
        return orcamentos
    
    return router