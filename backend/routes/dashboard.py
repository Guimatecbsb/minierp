from fastapi import APIRouter
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import date

def get_dashboard_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
    
    @router.get("/stats")
    async def estatisticas_gerais():
        hoje = date.today().isoformat()
        
        # Contadores
        total_clientes = await db.clientes.count_documents({})
        total_fornecedores = await db.fornecedores.count_documents({})
        total_equipamentos = await db.equipamentos.count_documents({})
        total_veiculos = await db.veiculos.count_documents({})
        
        # Equipamentos por estado
        equipamentos_disponiveis = await db.equipamentos.count_documents({"estado": "disponível"})
        equipamentos_manutencao = await db.equipamentos.count_documents({"estado": "manutenção"})
        
        # Veículos por status
        veiculos_ativos = await db.veiculos.count_documents({"status": "ativo"})
        veiculos_manutencao = await db.veiculos.count_documents({"status": "manutenção"})
        
        # Eventos
        eventos_hoje = await db.eventos.count_documents({"data_evento": hoje})
        eventos_andamento = await db.eventos.count_documents({"status": "andamento"})
        eventos_programados = await db.eventos.count_documents({"status": "programado"})
        
        # Eventos do dia
        eventos_dia = await db.eventos.find(
            {"data_evento": hoje},
            {"_id": 0}
        ).sort("hora_inicio", 1).to_list(100)
        
        # Alertas (simulados por enquanto)
        alertas = []
        
        # Verificar veículos em manutenção
        if veiculos_manutencao > 0:
            alertas.append({
                "tipo": "warning",
                "titulo": "Veículos em Manutenção",
                "mensagem": f"{veiculos_manutencao} veículo(s) em manutenção",
                "prioridade": "media"
            })
        
        # Verificar equipamentos em manutenção
        if equipamentos_manutencao > 0:
            alertas.append({
                "tipo": "warning",
                "titulo": "Equipamentos em Manutenção",
                "mensagem": f"{equipamentos_manutencao} equipamento(s) em manutenção",
                "prioridade": "media"
            })
        
        return {
            "contadores": {
                "clientes": total_clientes,
                "fornecedores": total_fornecedores,
                "equipamentos": total_equipamentos,
                "veiculos": total_veiculos,
                "equipamentos_disponiveis": equipamentos_disponiveis,
                "veiculos_ativos": veiculos_ativos
            },
            "eventos": {
                "hoje": eventos_hoje,
                "andamento": eventos_andamento,
                "programados": eventos_programados,
                "lista_dia": eventos_dia
            },
            "alertas": alertas
        }
    
    return router
