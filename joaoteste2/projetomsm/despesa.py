from datetime import date
import tipo_despesa
class Despesa:
    def __init__(self, descricao: str, valor: float, data: date, tipo: tipo_despesa):
        self.descricao = descricao
        self.valor = valor
        self.data = data
        self.tipo = tipo

    def __str__(self):
        return f"Descrição: {self.descricao} | Valor: ${self.valor:.2f} | Data: {self.data} | Tipo: {self.tipo.value}"

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
