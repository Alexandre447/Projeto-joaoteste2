from fastapi.testclient import TestClient
from backend.main import app  # importa sua app FastAPI

client = TestClient(app)

def test_raiz():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "API funcionando!"}  # se você tiver esse endpoint

def test_criar_lancamento():
    lancamento = {
        "descricao": "Teste Receita",
        "valor": 100.0,
        "data": "2025-07-09",
        "tipo": "Receita"
    }
    response = client.post("/lancamentos", json=lancamento)
    assert response.status_code == 201
    data = response.json()
    assert data["descricao"] == "Teste Receita"
    assert data["valor"] == 100.0
    assert data["tipo"] == "Receita"
    assert "id" in data

def test_listar_lancamentos():
    response = client.get("/lancamentos")
    assert response.status_code == 200
    assert isinstance(response.json(), list)