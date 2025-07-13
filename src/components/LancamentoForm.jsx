import { useState } from 'react';
import { adicionarLancamento } from '../api';

export default function LancamentoForm({ onAdd }) {
  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    data: '',
    tipo: 'Despesa',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const novo = await adicionarLancamento({
      ...form,
      valor: parseFloat(form.valor),
    });
    onAdd(novo);
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
      <button type="submit">Adicionar</button>
    </form>
  );
}
