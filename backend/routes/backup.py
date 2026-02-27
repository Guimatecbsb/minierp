from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
import json
from io import BytesIO

def get_backup_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/backup", tags=["Backup"])
    
    @router.get("/export")
    async def exportar_backup():
        """Exporta backup completo do banco de dados em JSON"""
        try:
            backup_data = {
                "backup_date": datetime.now().isoformat(),
                "database": "erp_jb",
                "collections": {}
            }
            
            # Collections a fazer backup
            collections = [
                "clientes",
                "fornecedores",
                "equipamentos",
                "veiculos",
                "condutores",
                "abastecimentos",
                "eventos"
            ]
            
            for collection_name in collections:
                collection = db[collection_name]
                documents = await collection.find({}, {"_id": 0}).to_list(100000)
                backup_data["collections"][collection_name] = documents
            
            # Converter para JSON
            json_data = json.dumps(backup_data, indent=2, ensure_ascii=False, default=str)
            buffer = BytesIO(json_data.encode('utf-8'))
            buffer.seek(0)
            
            filename = f"backup_jb_erp_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            
            return StreamingResponse(
                buffer,
                media_type="application/json",
                headers={"Content-Disposition": f"attachment; filename={filename}"}
            )
        
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao gerar backup: {str(e)}")
    
    @router.post("/restore")
    async def restaurar_backup(file: UploadFile = File(...)):
        """Restaura backup do banco de dados"""
        try:
            # Ler arquivo
            contents = await file.read()
            backup_data = json.loads(contents.decode('utf-8'))
            
            if "collections" not in backup_data:
                raise HTTPException(status_code=400, detail="Formato de backup inválido")
            
            restored_collections = []
            
            # Restaurar cada collection
            for collection_name, documents in backup_data["collections"].items():
                if documents:  # Se houver documentos
                    collection = db[collection_name]
                    
                    # Limpar collection antes de restaurar
                    await collection.delete_many({})
                    
                    # Inserir documentos
                    if documents:
                        await collection.insert_many(documents)
                    
                    restored_collections.append({
                        "collection": collection_name,
                        "documents_restored": len(documents)
                    })
            
            return {
                "status": "success",
                "message": "Backup restaurado com sucesso",
                "backup_date": backup_data.get("backup_date"),
                "collections_restored": restored_collections
            }
        
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Arquivo de backup inválido (JSON mal formatado)")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao restaurar backup: {str(e)}")
    
    @router.get("/stats")
    async def estatisticas_backup():
        """Retorna estatísticas do banco para backup"""
        try:
            stats = {}
            
            collections = [
                "clientes",
                "fornecedores",
                "equipamentos",
                "veiculos",
                "condutores",
                "abastecimentos",
                "eventos"
            ]
            
            for collection_name in collections:
                count = await db[collection_name].count_documents({})
                stats[collection_name] = count
            
            return {
                "total_collections": len(collections),
                "collections": stats,
                "total_documents": sum(stats.values())
            }
        
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao obter estatísticas: {str(e)}")
    
    return router
