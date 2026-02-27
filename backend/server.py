from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
import sys

# Add backend directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from routes.clientes import get_clientes_router
from routes.compras import get_compras_router
from routes.equipamentos import get_equipamentos_router
from routes.veiculos import get_veiculos_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(
    title="JB Estruturas ERP API",
    description="Sistema ERP para JB Estruturas e Eventos",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Root endpoint
@api_router.get("/")
async def root():
    return {
        "message": "JB Estruturas ERP API",
        "version": "1.0.0",
        "empresa": "JB Estruturas e Eventos",
        "cnpj": "48.950.114/0001-29"
    }

# Health check
@api_router.get("/health")
async def health_check():
    return {"status": "ok", "database": "connected"}

# Include module routers
api_router.include_router(get_clientes_router(db))
api_router.include_router(get_compras_router(db))
api_router.include_router(get_equipamentos_router(db))
api_router.include_router(get_veiculos_router(db))

# Include the main API router in the app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()