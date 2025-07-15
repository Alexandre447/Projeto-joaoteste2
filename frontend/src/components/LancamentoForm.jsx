import { useState, useEffect } from 'react';
import { adicionarLancamento } from '../api';

export default function LancamentoForm({ onAdd, onAtualizarSaldo, lancamentoEditando, onEdit, onCancelEdit }) {

  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    data: '',
    tipo: 'Despesa',
  });

   useEffect(() => {
    if (lancamentoEditando) {
      setForm({
        descricao: lancamentoEditando.descricao || '',
        valor: lancamentoEditando.valor?.toString() || '',
        data: lancamentoEditando.data || '',
        tipo: lancamentoEditando.tipo || 'Despesa',
      });
    } else {
      setForm({ descricao: '', valor: '', data: '', tipo: 'Despesa' });
    }
  }, [lancamentoEditando]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const dadosParaEnviar = {
      ...form,
      valor: parseFloat(form.valor),
    };

    if (lancamentoEditando) {
      await onEdit(lancamentoEditando.id, dadosParaEnviar);
    } else {
      const novo = await adicionarLancamento(dadosParaEnviar);
      onAdd(novo);
    }

    if (onAtualizarSaldo) {
      onAtualizarSaldo();
    }
    setForm({ descricao: '', valor: '', data: '', tipo: 'Despesa' });
  }

 return (
    <form onSubmit={handleSubmit}>
      <input name="descricao" value={form.descricao} onChange={handleChange} placeholder="Descrição" required />
      <input name="valor" value={form.valor} onChange={handleChange} type="number" placeholder="Valor" required />
      <input name="data" value={form.data} onChange={handleChange} type="date" required />
      <select name="tipo" value={form.tipo} onChange={handleChange}>
        <option value="Receita">Receita</option>
        <option value="Despesa">Despesa</option>
      </select>
      <button type="submit">{lancamentoEditando ? 'Salvar' : 'Adicionar'}</button>
      {lancamentoEditando && (
        <button type="button" onClick={onCancelEdit}>Cancelar</button>
      )}
    </form>
  );
}