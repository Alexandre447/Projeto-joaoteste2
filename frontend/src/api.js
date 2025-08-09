const API_URL = import.meta.env.VITE_API_URL;

export async function listarLancamentos() {
  const res = await fetch(`${API_URL}/lancamentos`);
  return res.json();
}

export async function adicionarLancamento(novo) {
  const response = await fetch(`${API_URL}/lancamentos`, {
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
  const response = await fetch(`${API_URL}/lancamentos/${id}`, {
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