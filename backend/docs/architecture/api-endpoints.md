# Documentação da API — Gerenciador de Empresas

Backend em Flask + PostgreSQL. Todas as rotas retornam JSON. Todos os textos de feedback são em português e identificam a ação como parte da demonstração (dados fictícios, sem persistência real fora do banco local).

Base URL local: `http://127.0.0.1:5000`

---

## Empresas — `/api/empresas`

### `GET /api/empresas`

Lista empresas com busca, filtro e paginação (5 por página).

**Query params (todos opcionais):**
| Param | Valores | Descrição |
| --- | --- | --- |
| `search` | string | Busca em nome, CNPJ, segmento e cidade (case-insensitive) |
| `status` | `active` \| `pending` \| `inactive` \| `all` | Filtra por situação |
| `page` | inteiro | Página (padrão 1) |

**Resposta 200:**

```json
{
    "items": [
        {
            "id": 1,
            "name": "...",
            "cnpj": "...",
            "sector": "...",
            "city": "...",
            "status": "active",
            "email": "...",
            "phone": "...",
            "createdAt": "...",
            "userCount": 1
        }
    ],
    "total": 6,
    "page": 1,
    "perPage": 5
}
```

### `GET /api/empresas/:id`

Retorna uma empresa. `404` se não existir.

### `POST /api/empresas`

Cria uma empresa. Body obrigatório:

```json
{
    "name": "string",
    "cnpj": "string",
    "sector": "string",
    "city": "string",
    "status": "active | pending | inactive",
    "email": "email válido",
    "phone": "string (opcional)"
}
```

**201** com `{ "message": "...", "company": {...} }`. **422** com detalhes de validação se algum campo obrigatório faltar ou email inválido.

### `PUT /api/empresas/:id`

Mesmo body do `POST`. Atualiza a empresa mantendo `id` e `createdAt`. **404** se não existir, **422** em erro de validação.

### `DELETE /api/empresas/:id`

Remove a empresa **e todos os usuários vinculados** (`companyId` igual). **404** se não existir.

---

## Usuários — `/api/usuarios`

### `GET /api/usuarios`

Lista usuários com busca, filtro e paginação (5 por página).

**Query params:**
| Param | Valores | Descrição |
| --- | --- | --- |
| `search` | string | Busca em nome, email, nome da empresa e cargo |
| `status` | `active` \| `pending` \| `inactive` \| `all` | Filtra por situação |
| `page` | inteiro | Página (padrão 1) |

**Resposta 200:**

```json
{
    "items": [
        {
            "id": 1,
            "name": "...",
            "email": "...",
            "companyId": 1,
            "companyName": "...",
            "role": "Administrador",
            "status": "active",
            "lastAccess": "..."
        }
    ],
    "total": 6,
    "page": 1,
    "perPage": 5
}
```

### `GET /api/usuarios/:id`

Retorna um usuário. `404` se não existir.

### `POST /api/usuarios`

Cria um usuário. Body obrigatório:

```json
{
    "name": "string",
    "email": "email válido",
    "companyId": 1,
    "role": "Administrador | Editor | Visualizador",
    "status": "active | pending | inactive"
}
```

`lastAccess` sempre nasce `null` (exibir como `Nunca acessou` no front). **422** se `companyId` não existir ou dados inválidos.

### `PUT /api/usuarios/:id`

Mesmo body do `POST`. Mantém `id` e `lastAccess`. **404**/**422** conforme o caso.

### `DELETE /api/usuarios/:id`

Remove o usuário. **404** se não existir.

---

## Permissões — `/api/permissoes`

### `GET /api/permissoes`

Retorna a matriz completa (21 registros: 3 papéis × 7 funcionalidades).

```json
[
    {
        "role": "Administrador",
        "functionality": "Visualizar empresas",
        "enabled": true
    }
]
```

### `POST /api/permissoes/toggle`

Inverte uma célula da matriz. Body:

```json
{ "role": "Visualizador", "functionality": "Cadastrar empresas" }
```

Resposta: `{ "message": "...", "permission": {...} }`. **404** se a combinação não existir. **Importante:** a mudança é persistida no banco desta sessão de desenvolvimento — não reseta sozinha a cada reload do frontend, então se o time quiser esse comportamento (reset ao recarregar, conforme a spec de Permissões sugere), isso precisa ser tratado no estado do frontend, não no backend.

---

## Overview — `/api/overview`

### `GET /api/overview`

Retorna os quatro indicadores agregados, as até 4 empresas mais recentes e exemplos fictícios de atividade.

```json
{
  "totalCompanies": 6,
  "activeCompanies": 4,
  "totalUsers": 6,
  "pendingApprovals": 2,
  "recentCompanies": [ {...} ],
  "activityExamples": [ { "title": "...", "description": "...", "time": "..." } ]
}
```

`pendingApprovals` = empresas pendentes + usuários pendentes (soma, conforme spec OV-\*).

---

## Erros

Todas as rotas retornam erros no formato:

```json
{ "error": "mensagem" }
```

ou, em erro de validação:

```json
{ "error": "Dados inválidos", "details": { "campo": ["mensagem"] } }
```

Códigos usados: `200` sucesso, `201` criado, `400` requisição malformada, `404` não encontrado, `422` validação falhou.

---

## CORS

Liberado para a origem definida em `CORS_ORIGINS` (`.env`), por padrão `http://localhost:5173` (porta padrão do Vite).
