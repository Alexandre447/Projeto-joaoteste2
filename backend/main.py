from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
from datetime import date
import uuid

from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models.despesa import Despesa, TipoDespesaEnum

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)


class LancamentoCreate(BaseModel):
    descricao: str
    valor: float
    data: date
    tipo: TipoDespesaEnum

class Lancamento(LancamentoCreate):
    id: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/lancamentos", response_model=List[Lancamento])
def listar_lancamentos(db: Session = Depends(get_db)):
    lancamentos = db.query(Despesa).all()
    return lancamentos

@app.post("/lancamentos", response_model=Lancamento, status_code=201)
def adicionar_lancamento(lanc: LancamentoCreate, db: Session = Depends(get_db)):
    novo_id = str(uuid.uuid4())[:6]
    novo = Despesa(
        id=novo_id,
        descricao=lanc.descricao,
        valor=lanc.valor,
        data=lanc.data,
        tipo=lanc.tipo,
    )
    db.add(novo)
    db.commit()     
    db.refresh(novo)
    return novo

@app.get("/lancamentos/{id}", response_model=Lancamento)
def obter_lancamento(id: str, db: Session = Depends(get_db)):
    lanc = db.query(Despesa).filter(Despesa.id == id).first()
    if not lanc:
        raise HTTPException(status_code=404, detail="Lançamento não encontrado")
    return lanc

@app.put("/lancamentos/{id}", response_model=Lancamento)
def editar_lancamento(id: str, dados: LancamentoCreate, db: Session = Depends(get_db)):
    lanc = db.query(Despesa).filter(Despesa.id == id).first()
    if not lanc:
        raise HTTPException(status_code=404, detail="Lançamento não encontrado")

    lanc.descricao = dados.descricao
    lanc.valor = dados.valor
    lanc.data = dados.data
    lanc.tipo = dados.tipo
    db.commit()
    db.refresh(lanc)
    return lanc

@app.delete("/lancamentos/{id}")
def excluir_lancamento(id: str, db: Session = Depends(get_db)):
    lanc = db.query(Despesa).filter(Despesa.id == id).first()
    if not lanc:
        raise HTTPException(status_code=404, detail="Lançamento não encontrado")
    db.delete(lanc)
    db.commit()
    return {"detail": "Lançamento excluído com sucesso"}

@app.get("/orcamento")
def calcular_orcamento(db: Session = Depends(get_db)):
    lancamentos = db.query(Despesa).all()
    total = sum(
        l.valor if l.tipo == TipoDespesaEnum.Receita else -l.valor for l in lancamentos
    )
    return {"saldo": round(total, 2)}

@app.get("/")
def raiz():
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/docs")
