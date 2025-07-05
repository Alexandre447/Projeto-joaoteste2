import json
from models.despesa import Despesa

def salvar_lancamentos(lista, caminho="dados/lancamentos.json"):
    with open(caminho, "w") as f:
        json.dump([l.to_dict() for l in lista], f, indent=2)

def carregar_lancamentos(caminho="dados/lancamentos.json"):
    try:
        with open(caminho, "r") as f:
            dados = json.load(f)
            return [Despesa.from_dict(d) for d in dados]
    except FileNotFoundError:
        return []
