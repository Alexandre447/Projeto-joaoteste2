from datetime import date, datetime
import models.TipoDespesa as TipoDespesa
class Despesa:
    def __init__(self, descricao: str, valor: float, data: date, tipo: TipoDespesa.TipoDespesa, id):
        self.id = id
        self.descricao = descricao
        self.valor = float(valor)
        self.data = data
        self.tipo = tipo

    def __str__(self):
        return f"ID: {self.id} | Descrição: {self.descricao} | Valor: R${self.valor:.2f} | Data: {self.data.strftime('%d/%m/%Y')} | Tipo: {self.tipo.value}"

    def to_dict(self):
        return {
            "id": self.id,
            "descricao": self.descricao,
            "valor": self.valor,
            "data": self.data.strftime('%d/%m/%Y'),
            "tipo": self.tipo.value
        }

    @staticmethod
    def from_dict(data):
        return Despesa(
            descricao=data['descricao'],
            valor=float(data['valor']),
            data=datetime.strptime(data['data'], "%d/%m/%Y").date(),
            tipo=TipoDespesa.TipoDespesa(data['tipo']),
            id=data.get('id')
        )