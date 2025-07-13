from datetime import datetime

def listar_todos(lancamentos):
    for l in lancamentos:
        print(l)

def filtrar_por_tipo(lancamentos, tipo_str):
    return [l for l in lancamentos if l.tipo.value.lower() == tipo_str.lower()]

def filtrar_por_data(lancamentos, data_str):
    alvo = datetime.strptime(data_str, "%d/%m/%Y").date()
    return [l for l in lancamentos if l.data == alvo]

def calcular_totais(lancamentos):
    total_receitas = sum(l.valor for l in lancamentos if l.tipo.value == "Receita")
    total_despesas = sum(l.valor for l in lancamentos if l.tipo.value == "Despesa")
    saldo = total_receitas - total_despesas

    return {
        "total_receitas": total_receitas,
        "total_despesas": total_despesas,
        "saldo": saldo
    }

def editar_lancamento(lancamentos, id_alvo, novos_dados):
    for lanc in lancamentos:
        if lanc.id == id_alvo:
            lanc.descricao = novos_dados['descricao']
            lanc.valor = float(novos_dados['valor'])
            lanc.data = novos_dados['data']
            lanc.tipo = novos_dados['tipo']
            return True
    return False

def excluir_lancamento(lancamentos, id_alvo):
    for i, lanc in enumerate(lancamentos):
        if lanc.id == id_alvo:
            del lancamentos[i]
            return True
    return False