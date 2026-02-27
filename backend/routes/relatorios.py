from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.pdf_generator import gerar_pdf_clientes, gerar_pdf_veiculos, gerar_pdf_eventos

def get_relatorios_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/relatorios", tags=["Relatórios"])
    
    @router.get("/clientes/pdf")
    async def relatorio_clientes_pdf():
        """Gera relatório PDF de clientes"""
        clientes = await db.clientes.find({}, {"_id": 0}).to_list(10000)
        
        pdf_buffer = gerar_pdf_clientes(clientes)
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=relatorio_clientes.pdf"}
        )
    
    @router.get("/veiculos/pdf")
    async def relatorio_veiculos_pdf():
        """Gera relatório PDF de veículos"""
        veiculos = await db.veiculos.find({}, {"_id": 0}).to_list(10000)
        
        pdf_buffer = gerar_pdf_veiculos(veiculos)
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=relatorio_veiculos.pdf"}
        )
    
    @router.get("/eventos/pdf")
    async def relatorio_eventos_pdf():
        """Gera relatório PDF de eventos"""
        eventos = await db.eventos.find({}, {"_id": 0}).to_list(10000)
        
        pdf_buffer = gerar_pdf_eventos(eventos)
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=relatorio_eventos.pdf"}
        )
    
    return router
