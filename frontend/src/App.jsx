import { useEffect, useState } from 'react';
import { listarLancamentos, excluirLancamento } from './api';
import LancamentoForm from './components/LancamentoForm';
import LancamentoList from './components/LancamentoList';

function App() {
  const [lancamentos, setLancamentos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const dados = await listarLancamentos();
      setLancamentos(dados);
    }
    fetchData();
  }, []);

  async function handleAdd(novo) {
    setLancamentos([...lancamentos, novo]);
  }

  async function handleDelete(id) {
    await excluirLancamento(id);
    setLancamentos(lancamentos.filter((l) => l.id !== id));
  }

  return (
    <div className="container">
      <h1>Controle de Orçamento</h1>
      <LancamentoForm onAdd={handleAdd} />
      <LancamentoList lancamentos={lancamentos} onDelete={handleDelete} />
    </div>
  );
}

export default App;
