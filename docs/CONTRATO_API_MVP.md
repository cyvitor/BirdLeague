# Contrato e Estados da API do MVP — BirdLeague

## 1. Convenções

- Base: `/api/v1`.
- JSON UTF-8 e nomes `camelCase`.
- Datas ISO 8601 em UTC.
- IDs UUID.
- OpenAPI gerado no build e validado no CI.
- Enums enviados como strings estáveis em inglês.
- Nunca retornar entidades do banco diretamente; usar contratos explícitos.

## 2. Respostas e erros

Sucesso usa o status HTTP adequado: `200`, `201`, `204`. Criação retorna `Location` quando aplicável.

Erros seguem `application/problem+json`:

```json
{
  "type": "https://birdleague/errors/validation",
  "title": "Dados inválidos",
  "status": 422,
  "code": "validation_failed",
  "traceId": "00-...",
  "errors": { "prompt": ["O enunciado é obrigatório."] }
}
```

Códigos:

- `400`: JSON ou parâmetro malformado;
- `401`: não autenticado/token inválido;
- `403`: autenticado sem permissão ou troca de senha pendente;
- `404`: recurso inexistente dentro do escopo autorizado;
- `409`: duplicidade, transição ou concorrência;
- `422`: validação de negócio/campos;
- `429`: limite excedido, com `Retry-After`;
- `500`: erro não tratado, sem detalhes internos.

Para evitar enumeração entre escolas, recurso fora do escopo normalmente responde `404`.

## 3. Paginação e filtros

Listagens usam `page` a partir de 1 e `pageSize` padrão 20, máximo 100:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "totalItems": 0,
  "totalPages": 0
}
```

Filtros são explícitos; ordenação usa `sort=createdAt:desc`. Busca livre tem limite de 100 caracteres.

## 4. Concorrência

Recursos administrativos mutáveis expõem `version`/ETag. Atualização envia `If-Match`; versão divergente retorna `409 concurrency_conflict`. Versões publicadas de perguntas e temas são imutáveis.

## 5. Idempotência

Operações críticas exigem `Idempotency-Key` UUID:

- criar aluno e matrícula;
- iniciar sessão;
- responder pergunta;
- concluir sessão;
- trocar nome do Bloo;
- publicar pergunta/tema.

O servidor persiste escola, usuário, rota, chave, hash do payload, status e resposta. Mesma chave e mesmo payload retornam a resposta original; mesma chave com payload diferente retorna `409 idempotency_key_reused`. Retenção mínima: 24 horas; eventos permanentes também possuem índices de domínio.

## 6. Rotas do MVP

### Autenticação

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/change-password`

### Administração

- `/admin/classes`
- `GET /admin/classes/{id}/students-status`
- `/admin/students`
- `/admin/students/{id}/enrollments`
- `/admin/students/{id}/reset-password`
- `/admin/themes`
- `/admin/themes/{id}/versions`
- `/admin/themes/{id}/versions/{versionId}/skills`
- `/admin/themes/{id}/versions/{versionId}/difficulties`
- `/admin/themes/{id}/versions/{versionId}/questions`
- `/admin/themes/{id}/classes`
- `/admin/questions`
- `/admin/questions/{id}/versions`

Cada coleção suporta somente os verbos necessários. Publicação é ação explícita: `POST .../{id}/publish`; arquivamento: `POST .../{id}/archive`.

`POST /admin/themes/{id}/versions` cria uma revisão `Draft` copiando a publicada atual. `POST /admin/themes/{id}/versions/{versionId}/publish` publica a revisão e atualiza o ponteiro atual do tema, sem alterar turmas automaticamente.

`.../versions/{versionId}/questions` associa `questionVersionId`, nunca apenas `questionId`. Atualizar uma pergunta publicada não altera nenhuma revisão do tema até uma substituição editorial explícita.

`POST /admin/themes/{id}/classes/{classId}/upgrade-version` recebe `themeVersionId` publicado. Retorna `409 theme_revision_incompatible` se a revisão mudar a estrutura depois de a turma iniciar o tema.

### Aluno

- `GET /student/home`
- `GET /student/bloo`
- `PATCH /student/bloo/name`
- `POST /student/first-hatch/sessions`
- `GET /student/training-sessions/{id}`
- `POST /student/training-sessions/{id}/answers`
- `POST /student/training-sessions/{id}/complete`
- `GET /student/themes`
- `GET /student/themes/{id}/progress`
- `POST /student/themes/{id}/difficulties/{difficulty}/sessions`
- `GET /student/achievements`
- `GET /student/progress`

`PATCH /student/bloo/name` aceita um nome válido ou a ação `useDefaultName`, que restaura `Bloo` e `hasCustomName = false`.

## 7. Estado da sessão

O contrato da sessão devolve perguntas sem `isCorrect`. Após responder, devolve `isCorrect`, opção correta, explicação, progresso visual e conquistas pendentes para o resumo.

Transições válidas:

```text
InProgress → Completed
InProgress → Abandoned (somente ação administrativa futura)
```

Uma sessão concluída não aceita novas respostas. A conclusão retorna snapshot de XP, progresso temático, estágio do Bloo, títulos e conquistas.

`POST /student/first-hatch/sessions` usa internamente o template `FIRST_HATCH_EN`. A resposta informa a sessão existente quando houver uma `InProgress`, evitando dois nascimentos concorrentes.

## 8. Segurança e cache

- rotas administrativas exigem `Admin`;
- rotas do aluno usam apenas o usuário autenticado, nunca um `studentId` fornecido livremente;
- toda consulta aplica `SchoolId`;
- `/api/*` responde `Cache-Control: no-store` quando autenticada;
- limite de payload JSON: 1 MB;
- timeout interno alvo: 15 segundos; operações longas futuras serão assíncronas;
- `traceId` correlaciona logs sem expor dados sensíveis.

## 9. Compatibilidade

Mudança incompatível exige nova versão de rota. Campos novos opcionais podem ser adicionados em `v1`. Clientes devem ignorar campos desconhecidos, mas enums desconhecidos devem produzir estado de fallback seguro na UI.
