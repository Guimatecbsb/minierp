from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, timezone

class EmpresaBase(BaseModel):
    razao_social: str = Field(default="JB Estruturas e Eventos")
    cnpj: str = Field(default="48.950.114/0001-29")
    email: Optional[str] = None
    telefone: Optional[str] = None
    endereco: Optional[str] = None
    logo_url: Optional[str] = None

class EmpresaUpdate(BaseModel):
    razao_social: Optional[str] = None
    cnpj: Optional[str] = None
    email: Optional[str] = None
    telefone: Optional[str] = None
    endereco: Optional[str] = None
    logo_url: Optional[str] = None

class Empresa(EmpresaBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default="empresa_config")
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))