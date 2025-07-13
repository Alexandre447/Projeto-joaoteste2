export default function LancamentoList({ lancamentos, onDelete }) {
  return (
    <div>
      <h2>Lançamentos</h2>
      <ul>
        {lancamentos.map((l) => (
          <li key={l.id}>
            {l.data} - {l.descricao} - R$ {l.valor.toFixed(2)} ({l.tipo})
            <button onClick={() => onDelete(l.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
