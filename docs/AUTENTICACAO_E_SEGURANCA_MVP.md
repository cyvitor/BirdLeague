# Autenticação e Segurança do MVP — BirdLeague

## 1. Credenciais

Todo acesso usa `Login + Senha`. E-mail não é necessário para autenticação.

- Login único dentro da escola, comparado sem diferença entre maiúsculas e minúsculas.
- Senhas armazenadas somente com Argon2id por biblioteca Node.js mantida e parâmetros versionados.
- Nunca registrar senha, token, cookie ou hash em logs.
- Administrador define a senha inicial do aluno e ela é exibida uma única vez na resposta de criação/redefinição.
- A API nunca permite consultar a senha novamente.

Política inicial:

- aluno: mínimo 8 caracteres;
- administrador: mínimo 12 caracteres;
- permitir espaços e passphrases, com máximo de 128 caracteres;
- rejeitar senha igual ao login, senhas comuns e credenciais conhecidas do seed;
- não exigir composição artificial obrigatória nem troca periódica sem motivo;
- exigir troca após redefinição administrativa, suspeita de comprometimento ou primeiro acesso do administrador seed;
- redefinir senha revoga todos os refresh tokens daquele usuário.

## 2. Administrador inicial

O seed idempotente de cada ambiente cria `vh / 123456` somente se nenhum administrador existir. A credencial é uma exceção de bootstrap:

- senha armazenada com hash;
- `MustChangePassword = true`;
- após login, somente `GET /api/v1/auth/me`, renovação controlada, logout e troca de senha são permitidos;
- o primeiro acesso exige uma nova senha de administrador válida;
- após a troca, `123456` deixa de autenticar e todas as sessões anteriores são revogadas;
- alertar no health/admin checklist enquanto existir administrador com troca pendente;
- em produção, o deploy não é considerado concluído antes da troca.

Depois, `vh` pode ser mantido, desativado ou substituído por outro administrador.

## 3. Tokens e cookies

- Access token JWT com duração de 10 minutos, devolvido em memória para o frontend.
- Refresh token opaco aleatório com duração de 7 dias.
- Refresh token armazenado no banco somente como hash, com usuário, família, criação, expiração, revogação e sucessor.
- Refresh token enviado em cookie `__Host-birdleague-refresh`, `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`.
- Rotacionar o refresh token em cada uso; reutilização de token antigo revoga toda a família.
- Access token não vai para `localStorage` nem cookie persistente.
- Logout revoga a família e expira o cookie.

Frontend e API devem usar o mesmo site, preferencialmente `app.dominio` com API em `app.dominio/api`. Se forem subdomínios diferentes, configurar CORS por allowlist exata e credenciais; nunca usar `*` com cookies.

## 4. Cloudflare

O proxy da Cloudflare é compatível com cookies seguros. Configuração obrigatória:

- TLS `Full (strict)` entre Cloudflare e origem;
- cache bypass para `/api/*`, `/login`, `/admin/*` e HTML autenticado;
- respostas autenticadas com `Cache-Control: no-store, private`;
- cache apenas para assets versionados públicos;
- não aplicar “Cache Everything” em autenticação ou API;
- manter requests síncronos curtos; nenhum endpoint do MVP deve se aproximar do proxy read timeout padrão de 120 segundos;
- uploads do MVP devem ficar muito abaixo do limite do plano; imagens administrativas, quando existirem, terão limite da aplicação de 10 MB;
- confiar em `CF-Connecting-IP` somente quando a conexão ao origin vier de faixas oficiais da Cloudflare ou de Cloudflare Tunnel;
- usar `X-Forwarded-Proto` para reconstruir HTTPS somente atrás de proxy confiável;
- origin não deve ficar publicamente acessível sem restrição; preferir Cloudflare Tunnel ou firewall aceitando apenas Cloudflare;
- rate limiting da aplicação continua obrigatório mesmo com WAF/Rate Limiting da Cloudflare.

Limites relevantes documentados pela Cloudflare: URL de 16 KB, headers de 128 KB, proxy read timeout padrão de 120 s e upload dependente do plano. O BirdLeague manterá tokens e cookies pequenos e APIs paginadas.

## 5. Proteções

- login: 5 tentativas inválidas por login/IP em 15 minutos antes de atraso/bloqueio temporário;
- refresh: limite por usuário, família e IP;
- demais endpoints autenticados: limites por usuário e rota;
- respostas de login não revelam se o usuário existe;
- auditoria de login, falha, troca/redefinição de senha, criação de administrador e revogação;
- proteção CSRF para endpoints que dependem do cookie de refresh, validando `Origin`/`Referer` e token antiforgery quando aplicável;
- headers: HSTS, CSP, `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy`;
- clock UTC sincronizado em todos os hosts.

## 6. Referências

- [Headers da Cloudflare](https://developers.cloudflare.com/fundamentals/reference/http-headers/)
- [Limites de conexão](https://developers.cloudflare.com/fundamentals/reference/connection-limits/)
- [Problemas de cache em login](https://developers.cloudflare.com/cache/troubleshooting/dynamic-content-and-login-issues/)
