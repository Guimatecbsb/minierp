from fastapi import APIRouter, HTTPException
from typing import List
from models.serralheria import (
    MovimentacaoSerralheria, MovimentacaoSerralheriaCreate,
    EstoqueSerralheria, EstoqueSerralheriaCreate,
    EquipamentoSerralheria, EquipamentoSerralheriaCreate
)
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone, date

def get_serralheria_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/serralheria", tags=["Serralheria"])
    
    # ==================== MOVIMENTAÇÕES (ENTRADAS/SAÍDAS) ====================
    @router.post("/movimentacoes", response_model=MovimentacaoSerralheria, status_code=201)
    async def criar_movimentacao(movimentacao: MovimentacaoSerralheriaCreate):
        mov_obj = MovimentacaoSerralheria(**movimentacao.model_dump())
        
        # Gerar número automático
        count = await db.movimentacoes_serralheria.count_documents({})
        prefixo = "ENT" if mov_obj.tipo == "entrada" else "SAI"
        mov_obj.numero_movimentacao = f"{prefixo}-{str(count + 1).zfill(6)}"
        
        # Calcular valor total
        if mov_obj.valor_unitario:
            mov_obj.valor_total = mov_obj.quantidade * mov_obj.valor_unitario
        
        doc = mov_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        if 'data_movimentacao' in doc and hasattr(doc['data_movimentacao'], 'isoformat'):
            doc['data_movimentacao'] = doc['data_movimentacao'].isoformat()
        
        await db.movimentacoes_serralheria.insert_one(doc)
        
        # Atualizar estoque automaticamente
        estoque_item = await db.estoque_serralheria.find_one({"item": mov_obj.item})
        
        if estoque_item:
            nova_quantidade = estoque_item['quantidade_atual']
            if mov_obj.tipo == "entrada":
                nova_quantidade += mov_obj.quantidade
            else:
                nova_quantidade -= mov_obj.quantidade
            
            await db.estoque_serralheria.update_one(
                {"item": mov_obj.item},
                {"$set": {
                    "quantidade_atual": max(0, nova_quantidade),
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }}
            )
        
        return mov_obj
    
    @router.get("/movimentacoes", response_model=List[MovimentacaoSerralheria])
    async def listar_movimentacoes(tipo: str = None):
        query = {}
        if tipo:
            query['tipo'] = tipo
        
        movimentacoes = await db.movimentacoes_serralheria.find(query, {"_id": 0}).to_list(1000)
        
        for m in movimentacoes:
            if isinstance(m.get('created_at'), str):
                m['created_at'] = datetime.fromisoformat(m['created_at'])
            if isinstance(m.get('data_movimentacao'), str):
                m['data_movimentacao'] = date.fromisoformat(m['data_movimentacao'])
        
        return movimentacoes
    
    # ==================== ESTOQUE ====================
    @router.post("/estoque", response_model=EstoqueSerralheria, status_code=201)
    async def criar_item_estoque(item: EstoqueSerralheriaCreate):
        # Verificar se item já existe
        existing = await db.estoque_serralheria.find_one({"item": item.item})
        if existing:
            raise HTTPException(status_code=400, detail="Item já existe no estoque")
        
        item_obj = EstoqueSerralheria(**item.model_dump())
        
        doc = item_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        
        await db.estoque_serralheria.insert_one(doc)
        return item_obj
    
    @router.get("/estoque", response_model=List[EstoqueSerralheria])
    async def listar_estoque(categoria: str = None):
        query = {}
        if categoria:
            query['categoria'] = categoria
        
        estoque = await db.estoque_serralheria.find(query, {"_id": 0}).to_list(1000)
        
        for e in estoque:
            if isinstance(e.get('created_at'), str):
                e['created_at'] = datetime.fromisoformat(e['created_at'])
            if isinstance(e.get('updated_at'), str):
                e['updated_at'] = datetime.fromisoformat(e['updated_at'])
        
        return estoque
    
    @router.get("/estoque/alertas")
    async def alertas_estoque():
        """Retorna itens com estoque abaixo do mínimo"""
        itens = await db.estoque_serralheria.find({}, {"_id": 0}).to_list(1000)
        
        alertas = []
        for item in itens:
            if item['quantidade_atual'] <= item['quantidade_minima']:
                alertas.append({
                    "id": item['id'],
                    "item": item['item'],
                    "categoria": item['categoria'],
                    "quantidade_atual": item['quantidade_atual'],
                    "quantidade_minima": item['quantidade_minima'],
                    "nivel": "critico" if item['quantidade_atual'] == 0 else "baixo"
                })
        
        return {"total_alertas": len(alertas), "alertas": alertas}
    
    # ==================== EQUIPAMENTOS ====================
    @router.post("/equipamentos", response_model=EquipamentoSerralheria, status_code=201)
    async def criar_equipamento(equipamento: EquipamentoSerralheriaCreate):
        equip_obj = EquipamentoSerralheria(**equipamento.model_dump())
        
        # Gerar código automático
        count = await db.equipamentos_serralheria.count_documents({})
        equip_obj.codigo = f"SER-EQ-{str(count + 1).zfill(4)}"
        
        doc = equip_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        if doc.get('data_aquisicao') and hasattr(doc['data_aquisicao'], 'isoformat'):
            doc['data_aquisicao'] = doc['data_aquisicao'].isoformat()
        if doc.get('data_ultima_manutencao') and hasattr(doc['data_ultima_manutencao'], 'isoformat'):
            doc['data_ultima_manutencao'] = doc['data_ultima_manutencao'].isoformat()
        
        await db.equipamentos_serralheria.insert_one(doc)
        return equip_obj
    
    @router.get("/equipamentos", response_model=List[EquipamentoSerralheria])
    async def listar_equipamentos(status: str = None, tipo: str = None):
        query = {}
        if status:
            query['status'] = status
        if tipo:
            query['tipo'] = tipo
        
        equipamentos = await db.equipamentos_serralheria.find(query, {"_id": 0}).to_list(1000)
        
        for e in equipamentos:
            if isinstance(e.get('created_at'), str):
                e['created_at'] = datetime.fromisoformat(e['created_at'])
            if isinstance(e.get('updated_at'), str):
                e['updated_at'] = datetime.fromisoformat(e['updated_at'])
            if e.get('data_aquisicao') and isinstance(e['data_aquisicao'], str):
                e['data_aquisicao'] = date.fromisoformat(e['data_aquisicao'])
            if e.get('data_ultima_manutencao') and isinstance(e['data_ultima_manutencao'], str):
                e['data_ultima_manutencao'] = date.fromisoformat(e['data_ultima_manutencao'])
        
        return equipamentos
    
    return router
