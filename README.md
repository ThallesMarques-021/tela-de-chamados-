# 📞 Chamados App

Aplicação para gerenciamento de chamados com Angular + Material + Testes unitários.

---

## 🚀 Funcionalidades

- ✅ Listagem de chamados com paginação
- 🔎 Filtros reativos por ID, título, status e data
- 📋 Criação e edição de chamados via modal
- 🗑️ Exclusão com confirmação
- 💬 Notificações com `MatSnackBar`
- 🧪 Testes unitários com cobertura acima de 80%

---

## 🛠️ Tecnologias Utilizadas

| Camada       | Tecnologias                                                  |
|--------------|---------------------------------------------------------------|
| Frontend     | Angular 15+, TypeScript, RxJS, Angular Material               |
| Estilização  | CSS + Angular Material                                        |
| Testes       | Jasmine, Karma, HttpClientTestingModule                       |
| Backend fake | JSON Server (para simular requisições HTTP)                   |

---

## ▶️ Como executar o projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Rodar o backend simulado (JSON Server)

Crie um arquivo `db.json` com o seguinte conteúdo:

```json
{
  "calls": []
}
```

E execute:

```bash
npx json-server --watch db.json --port 3000
```

### 3. Iniciar a aplicação Angular

```bash
ng serve
```

Acesse em: [http://localhost:4200](http://localhost:4200)

---

## 🧪 Rodar os testes com cobertura

```bash
ng test --code-coverage
```

Relatório disponível em:

```
coverage/index.html
```

---

## 📁 Estrutura de Pastas

```
src/
├── app/
│   ├── core/
│   │   ├── models/             # Modelos de dados (Call)
│   │   └── services/           # Serviços como CallService, SnackService
│   ├── pages/
│   │   └── calls/
│   │       ├── lista-chamado/  # Componente principal de listagem
│   │       └── modal-chamados/ # Modal de criação/edição
│   └── shared/
│       └── confirm-dialog/     # Diálogo de confirmação reutilizável
```

---

## 📌 Detalhes técnicos

- Utiliza **Standalone Components** com `imports: [...]` no `@Component`
- `FormGroup` reativo com `valueChanges` + `debounceTime`
- `MatTableDataSource` com paginator e filtros customizados
- Dialogs com retorno de `afterClosed()`
- `HttpClientTestingModule` e spies com `jasmine.createSpyObj`

