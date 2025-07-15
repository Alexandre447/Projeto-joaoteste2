import { useEffect, useState } from 'react';
import { listarLancamentos, excluirLancamento } from './api';
import { obterOrcamento } from './api';
import LancamentoForm from './components/LancamentoForm';
import LancamentoList from './components/LancamentoList';

function App() {
  const [lancamentos, setLancamentos] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [lancamentoEditando, setLancamentoEditando] = useState(null);

  const carregarSaldo = async () => {
    const data = await obterOrcamento();
    setSaldo(data.saldo);
  };

  useEffect(() => {
    async function fetchData() {
      const dados = await listarLancamentos();
      setLancamentos(dados);
    }
    fetchData();
    carregarSaldo();
  }, []);

  useEffect(() => {
    async function carregarSaldo() {
      const data = await obterOrcamento();
      setSaldo(data.saldo);
    }
    carregarSaldo();
  }, []);


  async function handleAdd(novo) {
    setLancamentos([...lancamentos, novo]);
    await carregarSaldo();
  }

  async function handleDelete(id) {
    await excluirLancamento(id);
    setLancamentos(lancamentos.filter((l) => l.id !== id));
    await carregarSaldo();
  }
  async function handleEdit(id, dadosAtualizados) {
    const atualizado = await editarLancamento(id, dadosAtualizados);
    setLancamentos((prev) =>
      prev.map((l) => (l.id === id ? atualizado : l))
    );
    setLancamentoEditando(null);
    await carregarSaldo();
  }

  function cancelarEdicao() {
    setLancamentoEditando(null);
  }

  return (
    <div className="container">
      <h1>Controle de Orçamento</h1>
      <LancamentoForm
        onAdd={handleAdd}
        onAtualizarSaldo={carregarSaldo}
        lancamentoEditando={lancamentoEditando}
        onEdit={handleEdit}
        onCancelEdit={cancelarEdicao}
      />
      <LancamentoList
        lancamentos={lancamentos}
        onDelete={handleDelete}
        onEdit={(lancamento) => setLancamentoEditando(lancamento)}
      />
      <h2>Orçamento Atual: R$ {saldo.toFixed(2)}</h2>
    </div>
  );
}

export default App;