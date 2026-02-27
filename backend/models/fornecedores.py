from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, timezone
import uuid

class FornecedorBase(BaseModel):
    nome: str = Field(..., min_length=1, max_length=200)
    cnpj: str = Field(..., min_length=14, max_length=18)
    email: Optional[str] = None
    telefone: Optional[str] = None
    endereco: Optional[str] = None
    contato_responsavel: Optional[str] = None
    tipo_servico: Optional[str] = None  # Equipamentos, Serviços Terceirizados
    observacoes: Optional[str] = None

class FornecedorCreate(FornecedorBase):
    pass

class FornecedorUpdate(BaseModel):
    nome: Optional[str] = None
    cnpj: Optional[str] = None
    email: Optional[str] = None
    telefone: Optional[str] = None
    endereco: Optional[str] = None
    contato_responsavel: Optional[str] = None
    tipo_servico: Optional[str] = None
    observacoes: Optional[str] = None

class Fornecedor(FornecedorBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    codigo_cadastro: str = Field(default="")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))