from datetime import date
from despesa import Despesa
from tipo_despesa import TipoDespesa

data = date(2025, 7, 2)
impostos = Despesa("du guverno", 1533.28, data, TipoDespesa.Despesa)

print(impostos)