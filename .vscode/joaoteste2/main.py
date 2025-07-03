from datetime import date, datetime
from models.despesa import Despesa
from models.TipoDespesa import TipoDespesa


desc = input("fale sobre o lançamento: ")
valor = input("Valor em dinheiro: ")
data = input("DD/MM/AAAA: ")
valorData = datetime.strptime(data, "%d/%m/%Y")
tipo = input("Receita ou Despesa? ")

impostos = Despesa(desc, valor, valorData, tipo)

print(impostos)