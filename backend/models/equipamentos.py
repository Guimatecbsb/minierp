from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, timezone
import uuid

class EquipamentoBase(BaseModel):
    nome: str = Field(..., min_length=1, max_length=200)
    codigo: str = Field(..., min_length=1)
    tipo: str  # Camarim, Ar Condicionado, Elétrica, Serralheria, etc
    marca: Optional[str] = None
    modelo: Optional[str] = None
    numero_serie: Optional[str] = None
    quantidade: int = Field(default=1, ge=0)
    estado: str = Field(default="disponível")  # disponível, indisponível, manutenção, emprestado
    localizacao: Optional[str] = None
    observacoes: Optional[str] = None

class EquipamentoCreate(EquipamentoBase):
    pass

class EquipamentoUpdate(BaseModel):
    nome: Optional[str] = None
    codigo: Optional[str] = None
    tipo: Optional[str] = None
    marca: Optional[str] = None
    modelo: Optional[str] = None
    numero_serie: Optional[str] = None
    quantidade: Optional[int] = None
    estado: Optional[str] = None
    localizacao: Optional[str] = None
    observacoes: Optional[str] = None

class Equipamento(EquipamentoBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))