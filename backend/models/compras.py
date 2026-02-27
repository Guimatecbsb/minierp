from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone, date
import uuid

class OrdemCompraBase(BaseModel):
    fornecedor_id: str
    itens: List[dict]  # [{"descricao": "", "quantidade": 0, "valor_unitario": 0}]
    status: str = Field(default="pendente")  # pendente, aprovado, recebido, cancelado
    observacoes: Optional[str] = None

class OrdemCompraCreate(OrdemCompraBase):
    pass

class OrdemCompra(OrdemCompraBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    numero_ordem: str = Field(default="")  # Numeração automática
    data_ordem: date = Field(default_factory=date.today)
    valor_total: float = Field(default=0.0, ge=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Orçamento
class OrcamentoBase(BaseModel):
    cliente_id: Optional[str] = None
    fornecedor_id: Optional[str] = None
    descricao: str
    valor_total: float = Field(ge=0)
    status: str = Field(default="pendente")  # pendente, aprovado, negado
    validade: Optional[date] = None
    observacoes: Optional[str] = None

class OrcamentoCreate(OrcamentoBase):
    pass

class Orcamento(OrcamentoBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    numero_orcamento: str = Field(default="")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))