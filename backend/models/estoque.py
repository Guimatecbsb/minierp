from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, timezone, date
import uuid

class EstoqueItemBase(BaseModel):
    equipamento_id: str
    tipo_movimentacao: str  # entrada, saida
    quantidade: int = Field(gt=0)
    data_movimentacao: date
    responsavel: str
    destino_origem: Optional[str] = None
    observacoes: Optional[str] = None

class EstoqueItemCreate(EstoqueItemBase):
    pass

class EstoqueItem(EstoqueItemBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Empréstimo
class EmprestimoBase(BaseModel):
    equipamento_id: str
    tipo: str  # tomado_emprestado, emprestado_terceiro
    empresa_pessoa: str  # Nome da empresa/pessoa
    quantidade: int = Field(gt=0)
    data_emprestimo: date
    data_prevista_devolucao: date
    data_devolucao: Optional[date] = None
    status: str = Field(default="ativo")  # ativo, devolvido, atrasado
    observacoes: Optional[str] = None

class EmprestimoCreate(EmprestimoBase):
    pass

class Emprestimo(EmprestimoBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# EPI
class EPIBase(BaseModel):
    tipo: str  # Capacete, Luvas, Botas, etc
    marca: str
    modelo: str
    tamanho: Optional[str] = None
    quantidade_estoque: int = Field(ge=0)
    quantidade_minima: int = Field(default=5)
    status: str = Field(default="disponível")  # disponível, indisponível
    validade: Optional[date] = None
    observacoes: Optional[str] = None

class EPICreate(EPIBase):
    pass

class EPI(EPIBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))