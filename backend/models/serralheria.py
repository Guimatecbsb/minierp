from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, timezone, date
import uuid

# Movimentação de Serralheria (Entradas e Saídas)
class MovimentacaoSerralheriaBase(BaseModel):
    tipo: str  # entrada, saida
    item: str  # Descrição do item (tubo, chapa, perfil, etc)
    categoria: str  # materia_prima, equipamento, ferramenta
    quantidade: float = Field(gt=0)
    unidade: str  # kg, m, unidade, etc
    origem_destino: str  # De onde veio ou para onde vai
    responsavel: str
    data_movimentacao: date
    valor_unitario: Optional[float] = None
    observacoes: Optional[str] = None

class MovimentacaoSerralheriaCreate(MovimentacaoSerralheriaBase):
    pass

class MovimentacaoSerralheria(MovimentacaoSerralheriaBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    numero_movimentacao: str = Field(default="")  # Numeração automática
    valor_total: float = Field(default=0.0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Estoque de Serralheria
class EstoqueSerralheriaBase(BaseModel):
    item: str
    categoria: str  # materia_prima, equipamento, ferramenta
    unidade: str  # kg, m, unidade, etc
    quantidade_atual: float = Field(ge=0)
    quantidade_minima: float = Field(default=0.0)
    localizacao: str  # Onde está guardado
    valor_unitario: Optional[float] = None
    observacoes: Optional[str] = None

class EstoqueSerralheriaCreate(EstoqueSerralheriaBase):
    pass

class EstoqueSerralheria(EstoqueSerralheriaBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Equipamento de Serralheria
class EquipamentoSerralheriaBase(BaseModel):
    nome: str
    tipo: str  # solda, corte, dobragem, furadeira, etc
    marca: Optional[str] = None
    modelo: Optional[str] = None
    numero_serie: Optional[str] = None
    status: str = Field(default="disponivel")  # disponivel, em_uso, manutencao, indisponivel
    data_aquisicao: Optional[date] = None
    data_ultima_manutencao: Optional[date] = None
    responsavel_atual: Optional[str] = None
    observacoes: Optional[str] = None

class EquipamentoSerralheriaCreate(EquipamentoSerralheriaBase):
    pass

class EquipamentoSerralheria(EquipamentoSerralheriaBase):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    codigo: str = Field(default="")  # Código automático
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
