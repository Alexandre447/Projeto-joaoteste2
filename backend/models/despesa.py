from sqlalchemy import Column, String, Float, Date, Enum
from database import Base
import enum

class TipoDespesaEnum(str, enum.Enum):
    Receita = "Receita"
    Despesa = "Despesa"

class Despesa(Base):
    __tablename__ = "lancamentos"

    id = Column(String(36), primary_key=True, index=True)
    descricao = Column(String(100))
    valor = Column(Float)
    data = Column(Date)
    tipo = Column(Enum(TipoDespesaEnum))
