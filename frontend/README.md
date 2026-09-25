# Frontend — Gerenciador de Empresas

Painel administrativo em React + TypeScript + Vite com quatro telas: **Visão geral** (`/`), **Empresas** (`/empresas`), **Usuários** (`/usuarios`) e **Permissões** (`/permissoes`).

> **Ambiente de demonstração:** todos os dados são fictícios e ficam apenas na memória do navegador. As alterações sobrevivem à navegação entre telas, mas **recarregar a página restaura os dados iniciais**. Nenhuma requisição é feita ao backend.

As especificações de cada tela estão em [`claude/`](./claude).

## Pré-requisitos

- **Node.js 20.19+** ou **22.12+** (exigência do Vite 8). Verifique com `node -v`.
- **npm** (instalado junto com o Node).

## Instalação

Na pasta `frontend/`, instale as dependências:

```bash
cd frontend
npm install
```

Crie o arquivo de variáveis de ambiente a partir do exemplo, se ele ainda não existir:

```bash
cp .env.example .env
```

A variável `VITE_API_URL` define a URL do backend (ex.: `http://localhost:5000`). As telas atuais não a usam, mas o cliente HTTP em `src/shared/services/httpClient.ts` já está configurado com ela.

## Executando o frontend

### Modo de desenvolvimento

```bash
npm run dev
```

Acesse o endereço exibido no terminal (por padrão, <http://localhost:5173>). O Vite recarrega a página automaticamente a cada alteração no código.

Para usar outra porta ou acessar a partir de outro dispositivo da rede:

```bash
npm run dev -- --port 3000   # outra porta
npm run dev -- --host        # expõe na rede local
```

### Build de produção

```bash
npm run build     # verifica os tipos (tsc) e gera os arquivos em dist/
npm run preview   # serve o conteúdo de dist/ localmente
```

## Executando os testes

Os testes usam [Vitest](https://vitest.dev) com [Testing Library](https://testing-library.com) em ambiente jsdom (simulação de navegador), sem precisar abrir um navegador.

### Rodar todos os testes uma vez

```bash
npm test
```

### Modo observação (roda novamente a cada alteração)

```bash
npx vitest
```

### Rodar apenas parte dos testes

```bash
npx vitest run src/features/companies          # só os testes de uma pasta
npx vitest run -t "COM-T05"                    # só os testes cujo nome contém o texto
```

Os nomes dos testes começam pelo identificador do requisito da especificação (`NAV-*`, `OV-*`, `COM-*`, `USR-*`, `PER-*`), o que facilita relacionar cada teste ao item correspondente em `claude/*/spec.md`.

### Onde ficam os testes

| Arquivo | O que cobre |
| --- | --- |
| `src/app/navigation.test.tsx` | Menu, rota ativa, trilha de navegação e menu móvel |
| `src/features/overview/*.test.ts(x)` | Indicadores e empresas recentes da Visão geral |
| `src/features/companies/CompaniesPage.test.tsx` | Listagem, filtros, paginação, formulário e exclusão de empresas |
| `src/features/users/UsersPage.test.tsx` | Listagem, formulário e exclusão de usuários |
| `src/features/permissions/PermissionsPage.test.tsx` | Matriz de permissões |
| `src/shared/demo/demoDataReducer.test.ts` | Regras de atualização do estado compartilhado |

A configuração fica em `vite.config.ts` (bloco `test`) e em `src/test/setup.ts`. Utilitários de renderização para os testes estão em `src/test/renderApp.tsx`.

## Outros comandos

```bash
npm run lint   # análise estática com ESLint
```

## Estrutura resumida

```
src/
├── app/            # rotas, providers e configuração do menu
├── features/       # telas: overview, companies, users, permissions
├── shared/
│   ├── components/ # componentes reutilizáveis (Modal, Pagination, Sidebar...)
│   ├── demo/       # tipos, dados fictícios e estado compartilhado
│   ├── hooks/      # usePagination
│   ├── layouts/    # layout com menu lateral e barra superior
│   └── utils/      # formatação, validação e foco
├── styles/         # CSS global
└── test/           # configuração e utilitários de teste
```
