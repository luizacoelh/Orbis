# Sprint 2 — CRUD core

Sprint 1 fechou a fundação (setup, banco, deploy). A ordem abaixo é proposital: Goal primeiro, porque Task e Note dependem dela pra fazer sentido o relacionamento opcional.

## Issue 5 — CRUD de Goal

```
Título: [Feature] CRUD de Goal
Descrição:
- [ ] API route (ou Server Action) para criar Goal
- [ ] API route para listar Goals do usuário logado
- [ ] API route para editar Goal (título, descrição, status)
- [ ] API route para deletar Goal
- [ ] Página/tela de listagem de Goals
- [ ] Formulário de criação/edição
Label: feature, goal
```

## Issue 6 — CRUD de Task

```
Título: [Feature] CRUD de Task
Descrição:
- [ ] API route para criar Task (com goalId opcional)
- [ ] API route para listar Tasks do usuário (com filtro por status/prioridade)
- [ ] API route para editar Task (status, prioridade, dueDate)
- [ ] API route para deletar Task
- [ ] Tela de listagem com indicação visual de status (TODO/DOING/DONE)
- [ ] Seletor de Goal vinculada (opcional) no formulário
Label: feature, task
```

## Issue 7 — CRUD de Note

```
Título: [Feature] CRUD de Note
Descrição:
- [ ] API route para criar Note (com goalId opcional e tag)
- [ ] API route para listar Notes do usuário
- [ ] API route para editar Note
- [ ] API route para deletar Note
- [ ] Tela de listagem/detalhe de Notes
- [ ] Filtro por tag (STUDY, BOOK, MOVIE, COURSE, GENERAL)
Label: feature, note
```

## Issue 8 — Dashboard simples

```
Título: [Feature] Dashboard com visão de Goal + relacionados
Descrição:
- [ ] Tela que lista Goals
- [ ] Ao abrir uma Goal, mostrar Tasks e Notes vinculadas a ela
- [ ] Navegação básica entre as telas
Label: feature, dashboard
```

> Essa issue só faz sentido depois que as três anteriores estiverem prontas — é onde o "relacionamento" do modelo de dados aparece de fato pra você na tela.

## Sobre a Issue #3 (auth)

Já fechada — todo CRUD abaixo já pode usar `userId` da sessão real, sem precisar de mock.

## Convenção de commit pra essas issues

```
feat: implementa CRUD de Goal (closes #5)
feat: implementa CRUD de Task (closes #6)
feat: implementa CRUD de Note (closes #7)
feat: implementa dashboard com Goals relacionadas (closes #8)
```
