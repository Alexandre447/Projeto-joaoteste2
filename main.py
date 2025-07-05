from datetime import datetime
from models.despesa import Despesa
from models.TipoDespesa import TipoDespesa
from services.operacoes import calcular_totais, filtrar_por_data, filtrar_por_tipo, listar_todos
from services.persistencia import carregar_lancamentos, salvar_lancamentos
import uuid


lancamentos = carregar_lancamentos()

for lanc in lancamentos:
    if not lanc.id:
        lanc.id = str(uuid.uuid4())[:6]

while True:
    print("1 - Adicionar lançamento")
    print("2 - Listar todos")
    print("3 - Filtrar por tipo")
    print("4 - Filtrar por data")
    print("5 - Ver totais")
    print("6 - Editar lançamento")
    print("7 - Excluir lançamento")
    print("8 - Sair")

    opcao = input("Escolha uma opção: ")

    if opcao == "1":
        desc = input("Descrição: ")
        valor = input("Valor: ")
        data = input("Data (DD/MM/AAAA): ")
        tipo = input("Tipo (Receita ou Despesa): ")
        novo_id = str(uuid.uuid4())[:6]

        data_convertida = datetime.strptime(data, "%d/%m/%Y").date()
        tipo_enum = TipoDespesa[tipo.capitalize()]

        novo = Despesa(desc, valor, data_convertida, tipo_enum, id=novo_id)
        lancamentos.append(novo)
        salvar_lancamentos(lancamentos)
        print("✔️ Lançamento adicionado com sucesso!")

    elif opcao == "2":
        listar_todos(lancamentos)

    elif opcao == "3":
        tipo = input("Filtrar por tipo (Receita ou Despesa): ")
        filtrados = filtrar_por_tipo(lancamentos, tipo)
        listar_todos(filtrados)

    elif opcao == "4":
        data = input("Filtrar por data (DD/MM/AAAA): ")
        filtrados = filtrar_por_data(lancamentos, data)
        listar_todos(filtrados)

    elif opcao == "5":
        totais = calcular_totais(lancamentos)
        print(f"\n💰 Total de receitas: R${totais['total_receitas']:.2f}")
        print(f"💸 Total de despesas: R${totais['total_despesas']:.2f}")
        print(f"📊 Saldo final:       R${totais['saldo']:.2f}")

    elif opcao == "6":
        id_edit = input("Digite o ID (ou os 6 primeiros caracteres) do lançamento que deseja editar: ").strip()

        lancamento = next((l for l in lancamentos if l.id.startswith(id_edit)), None)
        if not lancamento:
            print("❌ Lançamento não encontrado.")
            continue

        print(f"Editando: {lancamento}")
        nova_desc = input(f"Nova descrição ({lancamento.descricao}): ") or lancamento.descricao
        novo_valor = input(f"Novo valor ({lancamento.valor}): ") or lancamento.valor
        nova_data = input(f"Nova data ({lancamento.data.strftime('%d/%m/%Y')}): ") or lancamento.data.strftime('%d/%m/%Y')
        novo_tipo = input(f"Novo tipo ({lancamento.tipo.value}): ") or lancamento.tipo.value

        from models.TipoDespesa import TipoDespesa
        novos_dados = {
            "descricao": nova_desc,
            "valor": novo_valor,
            "data": datetime.strptime(nova_data, "%d/%m/%Y").date(),
            "tipo": TipoDespesa(novo_tipo)
        }

        lancamento.descricao = novos_dados["descricao"]
        lancamento.valor = float(novos_dados["valor"])
        lancamento.data = novos_dados["data"]
        lancamento.tipo = novos_dados["tipo"]

        salvar_lancamentos(lancamentos)
        print("✅ Lançamento editado com sucesso.")
    
    elif opcao == "7":
        id_excluir = input("Digite o ID (ou os 6 primeiros caracteres) do lançamento que deseja excluir: ").strip()
        lancamento = next((l for l in lancamentos if l.id.startswith(id_excluir)), None)

        if not lancamento:
            print("❌ Lançamento não encontrado.")
            continue

        print(f"Deseja excluir: {lancamento}")
        confirmar = input("Digite S para confirmar: ").strip().lower()
        if confirmar == "s":
            lancamentos = [l for l in lancamentos if l.id != lancamento.id]
            salvar_lancamentos(lancamentos)
            print("🗑️ Lançamento excluído com sucesso.")
        else:
            print("❌ Exclusão cancelada.")
    
    elif opcao == "8":
        break

    else:
        print("Opção inválida.")