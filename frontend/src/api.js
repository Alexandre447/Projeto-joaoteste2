const API_URL = 'http://localhost:8000';

export async function listarLancamentos() {
  const res = await fetch(`${API_URL}/lancamentos`);
  return await res.json();
}

export async function adicionarLancamento(novo) {
  const response = await fetch('http://localhost:8000/lancamentos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novo),
  });
  if (!response.ok) {
    throw new Error('Erro ao adicionar lançamento');
  }
  return response.json();
}

export async function excluirLancamento(id) {
  const res = await fetch(`${API_URL}/lancamentos/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
}

export async function obterOrcamento() {
  const res = await fetch(`${API_URL}/orcamento`);
  return await res.json();
}

export async function editarLancamento(id, dados) {
  const response = await fetch(`http://localhost:8000/lancamentos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error('Erro ao editar lançamento');
  }

  return await response.json();
}