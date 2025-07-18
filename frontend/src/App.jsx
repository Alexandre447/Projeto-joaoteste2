import { useEffect, useState } from 'react';
import { listarLancamentos, excluirLancamento, editarLancamento } from './api';
import { obterOrcamento } from './api';
import LancamentoForm from './components/LancamentoForm';
import LancamentoList from './components/LancamentoList';

function App() {
  const [lancamentos, setLancamentos] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [lancamentoEditando, setLancamentoEditando] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [lancamentosFiltrados, setLancamentosFiltrados] = useState([]);

   function aplicarFiltro() {
    let filtrados = [...lancamentos];

    if (filtroTipo) {
      filtrados = filtrados.filter(l => l.tipo === filtroTipo);
    }

    if (dataInicial) {
      filtrados = filtrados.filter(l => new Date(l.data) >= new Date(dataInicial));
    }

    if (dataFinal) {
      filtrados = filtrados.filter(l => new Date(l.data) <= new Date(dataFinal));
    }

    setLancamentosFiltrados(filtrados);
  }

  function limparFiltro() {
    setFiltroTipo('');
    setDataInicial('');
    setDataFinal('');
    setLancamentosFiltrados(lancamentos);
  }

  const carregarSaldo = async () => {
    const data = await obterOrcamento();
    setSaldo(data.saldo);
  };

  useEffect(() => {
    async function fetchData() {
      const dados = await listarLancamentos();
      setLancamentos(dados);
      setLancamentosFiltrados(dados);
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

      <div className="filtros">
      <label>
        Tipo:
        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
          <option value="">Todos</option>
          <option value="Receita">Receita</option>
          <option value="Despesa">Despesa</option>
        </select>
      </label>

      <label>
        Data Inicial:
        <input type="date" value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} />
      </label>

      <label>
        Data Final:
        <input type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} />
      </label>

      <button onClick={aplicarFiltro}>Filtrar</button>
      <button onClick={limparFiltro}>Limpar</button>
    </div>

      <LancamentoList
        lancamentos={lancamentosFiltrados}
        onDelete={handleDelete}
        onEdit={(lancamento) => setLancamentoEditando(lancamento)}
      />
      <h2>Orçamento Atual: R$ {saldo.toFixed(2)}</h2>
    </div>
  );
}

export default App;