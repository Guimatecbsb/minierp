from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone, date
import uuid

# Atividade Operacional
class AtividadeBase(BaseModel):
    nome: str
    tipo: str  # camarin, ar_condicionado, eletrica, montagem, desmontagem
    descricao: Optional[str] = None
    duracao_estimada: Optional[int] = None  # em minutos
    equipamentos_necessarios: List[str] = Field(default_factory=list)
    responsavel_padrao: Optional[str] = None
    observacoes: Optional[str] = None

class AtividadeCreate(AtividadeBase):
    pass

class Atividade(AtividadeBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Camarin
class CamarimBase(BaseModel):
    evento_id: str
    identificacao: str  # Ex: Camarin A, Camarin VIP
    capacidade: int = Field(gt=0)
    equipamentos: List[str] = Field(default_factory=list)  # Ex: Espelho, Cadeiras, Mesa
    status: str = Field(default="disponivel")  # disponivel, ocupado, manutencao
    responsavel: Optional[str] = None
    observacoes: Optional[str] = None

class CamarimCreate(CamarimBase):
    pass

class Camarin(CamarimBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Ar Condicionado
class ArCondicionadoBase(BaseModel):
    evento_id: str
    identificacao: str  # Ex: AC-01, Split Palco Principal
    marca: str
    modelo: str
    capacidade_btus: int
    localizacao: str
    status: str = Field(default="operacional")  # operacional, manutencao, defeito
    data_ultima_manutencao: Optional[date] = None
    data_proxima_manutencao: Optional[date] = None
    observacoes: Optional[str] = None

class ArCondicionadoCreate(ArCondicionadoBase):
    pass

class ArCondicionado(ArCondicionadoBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Elétrica
class EletricaBase(BaseModel):
    evento_id: str
    tipo: str  # quadro_geral, tomada, iluminacao, geradores
    identificacao: str
    localizacao: str
    potencia_kw: Optional[float] = None
    voltagem: Optional[str] = None  # 110V, 220V, Trifásico
    status: str = Field(default="operacional")  # operacional, manutencao, defeito
    responsavel_tecnico: Optional[str] = None
    observacoes: Optional[str] = None

class EletricaCreate(EletricaBase):
    pass

class Eletrica(EletricaBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Checklist
class ChecklistBase(BaseModel):
    evento_id: str
    tipo: str  # pre_evento, pos_evento, seguranca, equipamentos
    titulo: str
    itens: List[dict] = Field(default_factory=list)  # [{"descricao": "", "concluido": false, "responsavel": ""}]
    status: str = Field(default="pendente")  # pendente, em_andamento, concluido
    responsavel: str
    data_prevista: date
    observacoes: Optional[str] = None

class ChecklistCreate(ChecklistBase):
    pass

class Checklist(ChecklistBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    data_conclusao: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
