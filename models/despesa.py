from datetime import date
import models.TipoDespesa as TipoDespesa
class Despesa:
    def __init__(self, descricao: str, valor: float, data: date, tipo: TipoDespesa):
        self.descricao = descricao
        self.valor = float(valor)
        self.data = data
        self.tipo = tipo

    def __str__(self):
        return f"Descrição: {self.descricao} | Valor: ${self.valor:.2f} | Data: {self.data} | Tipo: {self.tipo}"

def to_dict(self):
    return {
        "descricao": self.descricao,
        "valor": self.valor,
        "data": self.data,
        "tipo": self.tipo.name
    }

@staticmethod
def from_dict(data):
    return Despesa(
         data['descricao'],
        data['valor'],
        data['data'],
        TipoDespesa[data['tipo'].upper()]
        )

def GetDescricao(self):
    return self.descricao

def SetDescricao(self, descricao):
    self.descricao = descricao

def GetValor(self):
    return self.valor

def SetValor(self, valor):
    self.valor = valor

def GetData(self):
    return self.data

def SetData(self, data):
    self.data = data

def GetTipo(self):
    return self.tipo

def SetTipo(self, tipo):
    self.tipo = tipo
