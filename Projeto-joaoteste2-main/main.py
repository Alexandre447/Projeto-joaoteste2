from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, datetime
import uuid
from fastapi.responses import RedirectResponse

from models.despesa import Despesa
from models.TipoDespesa import TipoDespesa
from services.persistencia import carregar_lancamentos, salvar_lancamentos

app = FastAPI()

# Carrega lançamentos na inicialização
lancamentos: List[Despesa] = carregar_lancamentos()

# Pydantic model para validação e serialização
class LancamentoCreate(BaseModel):
    descricao: str
    valor: float
    data: date
    tipo: str = Field(..., pattern="^(Receita|Despesa)$")

class Lancamento(LancamentoCreate):
    id: str

# Helper para converter Despesa para dict serializável
def despesa_to_dict(desp: Despesa) -> dict:
    return {
        "id": desp.id,
        "descricao": desp.descricao,
        "valor": float(desp.valor),
        "data": desp.data,
        "tipo": desp.tipo.value
    }

@app.get("/lancamentos", response_model=List[Lancamento])
def listar_lancamentos():
    lancamentos = carregar_lancamentos()
    return [despesa_to_dict(l) for l in lancamentos]

@app.post("/lancamentos", response_model=Lancamento, status_code=201)
def adicionar_lancamento(lanc: LancamentoCreate):
    novo_id = str(uuid.uuid4())[:6]
    tipo_enum = TipoDespesa[lanc.tipo.capitalize()]
    novo = Despesa(lanc.descricao, lanc.valor, lanc.data, tipo_enum, id=novo_id)
    lancamentos.append(novo)
    salvar_lancamentos(lancamentos)
    return despesa_to_dict(novo)

@app.get("/lancamentos/{id}", response_model=Lancamento)
def obter_lancamento(id: str):
    lanc = next((l for l in lancamentos if l.id == id), None)
    if not lanc:
        raise HTTPException(status_code=404, detail="Lançamento não encontrado")
    return despesa_to_dict(lanc)

@app.put("/lancamentos/{id}", response_model=Lancamento)
def editar_lancamento(id: str, dados: LancamentoCreate):
    lanc = next((l for l in lancamentos if l.id == id), None)
    if not lanc:
        raise HTTPException(status_code=404, detail="Lançamento não encontrado")
    lanc.descricao = dados.descricao
    lanc.valor = dados.valor
    lanc.data = dados.data
    lanc.tipo = TipoDespesa[dados.tipo.capitalize()]
    salvar_lancamentos(lancamentos)
    return despesa_to_dict(lanc)

@app.delete("/lancamentos/{id}")
def excluir_lancamento(id: str):
    global lancamentos
    lanc = next((l for l in lancamentos if l.id == id), None)
    if not lanc:
        raise HTTPException(status_code=404, detail="Lançamento não encontrado")
    lancamentos = [l for l in lancamentos if l.id != id]
    salvar_lancamentos(lancamentos)
    return {"detail": "Lançamento excluído com sucesso"}

@app.get("/")
def raiz():
    return RedirectResponse(url="/docs")