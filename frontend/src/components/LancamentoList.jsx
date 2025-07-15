export default function LancamentoList({ lancamentos, onDelete, onEdit }) {
  return (
    <div>
      <h2>Lançamentos</h2>
      <ul>
        {lancamentos.map((l) => (
          <li key={l.id}>
            {l.data} - {l.descricao} - R$ {l.valor.toFixed(2)} ({l.tipo})
            <button onClick={() => onEdit(l)}>Editar</button>
            <button onClick={() => onDelete(l.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
