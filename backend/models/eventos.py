from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone, date
import uuid

class EventoBase(BaseModel):
    titulo: str = Field(..., min_length=1, max_length=200)
    cliente_id: str
    data_evento: date
    hora_inicio: Optional[str] = None
    hora_fim: Optional[str] = None
    local: str
    tipo_evento: Optional[str] = None  # Show, Teatro, Convenção, etc
    status: str = Field(default="programado")  # programado, andamento, finalizado, cancelado
    equipamentos_ids: List[str] = Field(default_factory=list)
    colaboradores_ids: List[str] = Field(default_factory=list)
    observacoes: Optional[str] = None

class EventoCreate(EventoBase):
    pass

class EventoUpdate(BaseModel):
    titulo: Optional[str] = None
    cliente_id: Optional[str] = None
    data_evento: Optional[date] = None
    hora_inicio: Optional[str] = None
    hora_fim: Optional[str] = None
    local: Optional[str] = None
    tipo_evento: Optional[str] = None
    status: Optional[str] = None
    equipamentos_ids: Optional[List[str]] = None
    colaboradores_ids: Optional[List[str]] = None
    observacoes: Optional[str] = None

class Evento(EventoBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))