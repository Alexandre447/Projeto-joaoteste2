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

  async function carregarLancamentos() {
  const dados = await listarLancamentos();
  setLancamentos(dados);
  setLancamentosFiltrados(dados);
}

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

  const carregarDados = async () => {
    const dados = await listarLancamentos();
    setLancamentos(dados);
    setLancamentosFiltrados(dados);
    const saldoAtual = await obterOrcamento();
    setSaldo(saldoAtual.saldo);
  };

  useEffect(() => {
    carregarDados();
  }, []);



  const handleAdd = async (novo) => {
    try {
      const novoLanc = await adicionarLancamento(novo);

      const lancamentoSeguro = {
        id: novoLanc.id,
        descricao: novoLanc.descricao || "",
        valor: Number(novoLanc.valor) || 0,
        data: novoLanc.data ? novoLanc.data.slice(0, 10) : "",
        tipo: novoLanc.tipo || "Despesa",
      };

      setLancamentos(prev => {
        const listaAtualizada = [...prev, lancamentoSeguro];
        let filtrados = [...listaAtualizada];
        if (filtroTipo) filtrados = filtrados.filter(l => l.tipo === filtroTipo);
        if (dataInicial) filtrados = filtrados.filter(l => new Date(l.data) >= new Date(dataInicial));
        if (dataFinal) filtrados = filtrados.filter(l => new Date(l.data) <= new Date(dataFinal));
        setLancamentosFiltrados(filtrados);
        return listaAtualizada;
      });

      const saldoAtual = await obterOrcamento();
      setSaldo(saldoAtual.saldo);
    } catch (err) {
      console.error("Erro ao adicionar:", err);
    }
  };

  const handleEdit = async (id, dadosAtualizados) => {
    try {
      const atualizado = await editarLancamento(id, dadosAtualizados);

      setLancamentos(prev => {
        const listaAtualizada = prev.map(l => (l.id === id ? {
          ...atualizado,
          valor: Number(atualizado.valor) || 0,
          data: atualizado.data ? atualizado.data.slice(0, 10) : "",
        } : l));

        let filtrados = [...listaAtualizada];
        if (filtroTipo) filtrados = filtrados.filter(l => l.tipo === filtroTipo);
        if (dataInicial) filtrados = filtrados.filter(l => new Date(l.data) >= new Date(dataInicial));
        if (dataFinal) filtrados = filtrados.filter(l => new Date(l.data) <= new Date(dataFinal));
        setLancamentosFiltrados(filtrados);
        return listaAtualizada;
      });

      setLancamentoEditando(null);
      const saldoAtual = await obterOrcamento();
      setSaldo(saldoAtual.saldo);
    } catch (err) {
      console.error("Erro ao editar:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await excluirLancamento(id);
      setLancamentos(prev => {
        const listaAtualizada = prev.filter(l => l.id !== id);
        let filtrados = [...listaAtualizada];
        if (filtroTipo) filtrados = filtrados.filter(l => l.tipo === filtroTipo);
        if (dataInicial) filtrados = filtrados.filter(l => new Date(l.data) >= new Date(dataInicial));
        if (dataFinal) filtrados = filtrados.filter(l => new Date(l.data) <= new Date(dataFinal));
        setLancamentosFiltrados(filtrados);
        return listaAtualizada;
      });

      const saldoAtual = await obterOrcamento();
      setSaldo(saldoAtual.saldo);
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  };

  const cancelarEdicao = () => setLancamentoEditando(null);

  return (
    <div className="container">
      <h1>Controle de Orçamento</h1>
      <LancamentoForm
        onAdd={handleAdd}
        onAtualizarSaldo={() => carregarDados()}
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
        onEdit={(l) => setLancamentoEditando(l)}
      />

      <h2>Orçamento Atual: R$ {saldo.toFixed(2)}</h2>
    </div>
  );
}

export default App;