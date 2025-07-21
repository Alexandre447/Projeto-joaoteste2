import json
import os
from typing import List
from models.despesa import Despesa
from models.TipoDespesa import TipoDespesa

CAMINHO_ARQUIVO = "data/lancamentos.json"

def carregar_lancamentos() -> List[Despesa]:
    if not os.path.exists(CAMINHO_ARQUIVO):
        return []

    with open(CAMINHO_ARQUIVO, "r", encoding="utf-8") as f:
        dados = json.load(f)
        return [
            Despesa(
                descricao=d["descricao"],
                valor=d["valor"],
                data=d["data"],
                tipo=TipoDespesa[d["tipo"]],
                id=d["id"]
            )
            for d in dados
        ]

def salvar_lancamentos(lancamentos: List[Despesa]):
    os.makedirs(os.path.dirname(CAMINHO_ARQUIVO), exist_ok=True)
    with open(CAMINHO_ARQUIVO, "w", encoding="utf-8") as f:
        json.dump(
            [
                {
                    "id": l.id,
                    "descricao": l.descricao,
                    "valor": l.valor,
                    "data": l.data,
                    "tipo": l.tipo.name,
                }
                for l in lancamentos
            ],
            f,
            ensure_ascii=False,
            indent=2,
            default=str
        )
