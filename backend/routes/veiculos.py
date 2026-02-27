from fastapi import APIRouter, HTTPException
from typing import List
from models.veiculos import Veiculo, VeiculoCreate, VeiculoUpdate, Abastecimento, AbastecimentoCreate, Condutor, CondutorCreate
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone

def get_veiculos_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/veiculos", tags=["Veículos"])
    
    # ==================== VEÍCULOS ====================
    @router.post("", response_model=Veiculo, status_code=201)
    async def criar_veiculo(veiculo: VeiculoCreate):
        veiculo_obj = Veiculo(**veiculo.model_dump())
        
        doc = veiculo_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        
        await db.veiculos.insert_one(doc)
        return veiculo_obj
    
    @router.get("", response_model=List[Veiculo])
    async def listar_veiculos(tipo: str = None):
        query = {}
        if tipo:
            query['tipo'] = tipo
        
        veiculos = await db.veiculos.find(query, {"_id": 0}).to_list(1000)
        
        for v in veiculos:
            if isinstance(v.get('created_at'), str):
                v['created_at'] = datetime.fromisoformat(v['created_at'])
            if isinstance(v.get('updated_at'), str):
                v['updated_at'] = datetime.fromisoformat(v['updated_at'])
        
        return veiculos
    
    @router.get("/{veiculo_id}", response_model=Veiculo)
    async def obter_veiculo(veiculo_id: str):
        veiculo = await db.veiculos.find_one({"id": veiculo_id}, {"_id": 0})
        
        if not veiculo:
            raise HTTPException(status_code=404, detail="Veículo não encontrado")
        
        if isinstance(veiculo.get('created_at'), str):
            veiculo['created_at'] = datetime.fromisoformat(veiculo['created_at'])
        if isinstance(veiculo.get('updated_at'), str):
            veiculo['updated_at'] = datetime.fromisoformat(veiculo['updated_at'])
        
        return veiculo
    
    @router.delete("/{veiculo_id}", status_code=204)
    async def deletar_veiculo(veiculo_id: str):
        result = await db.veiculos.delete_one({"id": veiculo_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Veículo não encontrado")
        
        return None
    
    # ==================== ABASTECIMENTO ====================
    @router.post("/abastecimento", response_model=Abastecimento, status_code=201)
    async def criar_abastecimento(abastecimento: AbastecimentoCreate):
        abastecimento_obj = Abastecimento(**abastecimento.model_dump())
        
        # Gerar número de abastecimento automático
        count = await db.abastecimentos.count_documents({})
        abastecimento_obj.numero_abastecimento = f"ABAST-{str(count + 1).zfill(6)}"
        
        doc = abastecimento_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        if 'data_abastecimento' in doc and hasattr(doc['data_abastecimento'], 'isoformat'):
            doc['data_abastecimento'] = doc['data_abastecimento'].isoformat()
        
        await db.abastecimentos.insert_one(doc)
        return abastecimento_obj
    
    @router.get("/abastecimento", response_model=List[Abastecimento])
    async def listar_abastecimentos():
        abastecimentos = await db.abastecimentos.find({}, {"_id": 0}).to_list(1000)
        
        for a in abastecimentos:
            if isinstance(a.get('created_at'), str):
                a['created_at'] = datetime.fromisoformat(a['created_at'])
            if isinstance(a.get('data_abastecimento'), str):
                from datetime import date
                a['data_abastecimento'] = date.fromisoformat(a['data_abastecimento'])
        
        return abastecimentos
    
    # ==================== CONDUTORES ====================
    @router.post("/condutores", response_model=Condutor, status_code=201)
    async def criar_condutor(condutor: CondutorCreate):
        condutor_obj = Condutor(**condutor.model_dump())
        
        # Gerar código de cadastro automático
        count = await db.condutores.count_documents({})
        condutor_obj.codigo_cadastro = f"COND-{str(count + 1).zfill(6)}"
        
        doc = condutor_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        if 'validade_cnh' in doc and hasattr(doc['validade_cnh'], 'isoformat'):
            doc['validade_cnh'] = doc['validade_cnh'].isoformat()
        
        await db.condutores.insert_one(doc)
        return condutor_obj
    
    @router.get("/condutores", response_model=List[Condutor])
    async def listar_condutores():
        condutores = await db.condutores.find({}, {"_id": 0}).to_list(1000)
        
        for c in condutores:
            if isinstance(c.get('created_at'), str):
                c['created_at'] = datetime.fromisoformat(c['created_at'])
            if isinstance(c.get('updated_at'), str):
                c['updated_at'] = datetime.fromisoformat(c['updated_at'])
            if isinstance(c.get('validade_cnh'), str):
                from datetime import date
                c['validade_cnh'] = date.fromisoformat(c['validade_cnh'])
        
        return condutores
    
    return router