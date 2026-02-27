from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, timezone, date
import uuid

class VeiculoBase(BaseModel):
    placa: str = Field(..., min_length=7, max_length=8)
    tipo: str  # pesado, leve
    marca: str
    modelo: str
    ano: int
    status: str = Field(default="ativo")  # ativo, manutenção, inativo
    km_atual: Optional[int] = 0
    observacoes: Optional[str] = None

class VeiculoCreate(VeiculoBase):
    pass

class VeiculoUpdate(BaseModel):
    placa: Optional[str] = None
    tipo: Optional[str] = None
    marca: Optional[str] = None
    modelo: Optional[str] = None
    ano: Optional[int] = None
    status: Optional[str] = None
    km_atual: Optional[int] = None
    observacoes: Optional[str] = None

class Veiculo(VeiculoBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Abastecimento
class AbastecimentoBase(BaseModel):
    veiculo_id: str
    condutor_id: str
    data_abastecimento: date
    litros: float = Field(gt=0)
    km_veiculo: int
    valor_total: float = Field(ge=0)
    posto: Optional[str] = None
    observacoes: Optional[str] = None

class AbastecimentoCreate(AbastecimentoBase):
    pass

class Abastecimento(AbastecimentoBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    numero_abastecimento: str = Field(default="")  # Numeração automática
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Condutor
class CondutorBase(BaseModel):
    nome: str = Field(..., min_length=1, max_length=200)
    cpf: str = Field(..., min_length=11, max_length=14)
    cnh: str
    categoria_cnh: str
    validade_cnh: date
    telefone: Optional[str] = None
    status: str = Field(default="ativo")  # ativo, inativo

class CondutorCreate(CondutorBase):
    pass

class Condutor(CondutorBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    codigo_cadastro: str = Field(default="")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))