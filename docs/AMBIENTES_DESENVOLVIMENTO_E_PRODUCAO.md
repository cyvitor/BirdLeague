# Ambientes de Desenvolvimento e Produção — BirdLeague

## 1. Estratégia

O projeto será executado com containers Linux para API, frontend e MySQL. Isso reduz diferenças entre Windows e Linux. Em desenvolvimento, o código pode rodar no host com apenas o MySQL em Docker; o caminho oficial será `docker compose`.

Versões-base:

- Git atual suportado pelo sistema operacional.
- .NET SDK 10 para desenvolvimento; runtime na imagem de produção.
- Node.js 24 LTS.
- MySQL 8.4 LTS.
- Docker Engine/Desktop com Compose V2.

As versões exatas serão fixadas em `global.json`, `.nvmrc`/`package.json`, imagens Docker e lockfiles quando o código for criado.

## 2. Arquivos que a implementação deverá fornecer

```text
/.env.example
/compose.yaml
/compose.override.yaml
/compose.production.yaml
/global.json
/src/backend/Dockerfile
/src/frontend/Dockerfile
```

Segredos reais nunca entram no Git.

## 3. Variáveis mínimas

| Variável | Finalidade |
| --- | --- |
| `ASPNETCORE_ENVIRONMENT` | `Development`, `Staging` ou `Production` |
| `MYSQL_DATABASE` | Nome do banco |
| `MYSQL_USER` | Usuário da aplicação |
| `MYSQL_PASSWORD` | Senha da aplicação |
| `MYSQL_ROOT_PASSWORD` | Administração do MySQL; não usada pela API |
| `ConnectionStrings__BirdLeague` | Conexão da API |
| `Auth__Issuer` | Emissor dos tokens |
| `Auth__Audience` | Público dos tokens |
| `Auth__SigningKey` | Chave forte fora do repositório |
| `NEXT_PUBLIC_API_URL` | URL pública da API |

O seed cria `vh / 123456` em cada ambiente somente quando ainda não existe administrador e força troca no primeiro acesso. Consulte [Autenticação e Segurança](AUTENTICACAO_E_SEGURANCA_MVP.md).

## 4. Desenvolvimento no Windows

Pré-requisitos:

1. Windows 11 ou Windows 10 suportado.
2. Git.
3. .NET 10 SDK.
4. Node.js 24 LTS, preferencialmente por gerenciador de versões.
5. Docker Desktop usando containers Linux e backend WSL 2.

Validação em PowerShell:

```powershell
git --version
dotnet --info
node --version
npm --version
docker version
docker compose version
```

Fluxo previsto após a criação do código:

```powershell
Copy-Item .env.example .env
docker compose up -d --build
docker compose ps
```

Para execução híbrida, subir apenas o banco e executar API e frontend no host com os comandos registrados no futuro README técnico.

## 5. Desenvolvimento no Linux

Distribuição de referência: Ubuntu 24.04 LTS x86-64. Outras distribuições suportadas podem ser usadas, mas os comandos de instalação variam.

Pré-requisitos:

1. Git.
2. .NET 10 SDK pelo repositório oficial da distribuição/Microsoft.
3. Node.js 24 LTS.
4. Docker Engine instalado pelo repositório oficial, com plugins Buildx e Compose.

Validação:

```bash
git --version
dotnet --info
node --version
npm --version
docker version
docker compose version
```

Inicialização prevista:

```bash
cp .env.example .env
docker compose up -d --build
docker compose ps
```

O usuário pode ser incluído no grupo `docker` para dispensar `sudo`, ciente de que esse grupo concede privilégios equivalentes a root.

## 6. Produção Linux — opção recomendada

Referência: Ubuntu Server 24.04 LTS, Docker Engine e Compose instalados pelo repositório oficial.

Arquitetura mínima:

```text
Internet → HTTPS/reverse proxy → frontend/API → MySQL em rede privada
                                      ↓
                              volume de assets/backups
```

Requisitos:

- usuário de implantação sem login root direto;
- firewall expondo somente 80/443 e SSH restrito;
- TLS automático por proxy reverso;
- MySQL sem porta pública;
- secrets por arquivo protegido ou secret manager;
- volumes persistentes;
- health checks e política de reinício;
- logs com rotação;
- backup diário criptografado fora do servidor;
- teste periódico de restauração;
- atualizações de segurança e janela de manutenção.

Implantação prevista:

```bash
docker compose -f compose.yaml -f compose.production.yaml pull
docker compose -f compose.yaml -f compose.production.yaml up -d
docker compose -f compose.yaml -f compose.production.yaml ps
```

Migrations devem executar como tarefa única controlada antes da troca de versão. Não executar migrations concorrentes em todas as réplicas.

## 7. Produção Windows

Produção Windows será suportada preferencialmente em uma VM Linux hospedada no Hyper-V/infraestrutura Windows, usando a mesma topologia da seção anterior. Essa é a opção recomendada porque as imagens da aplicação são Linux.

Se houver exigência de Windows Server sem VM Linux, será necessário definir uma topologia específica antes do deploy. Docker Desktop não é a opção de servidor de produção; containers nativos Windows exigiriam novas imagens e aumentariam o custo operacional. Como alternativa sem containers, API pode rodar como Windows Service/IIS, frontend como serviço Node e MySQL como Windows Service, mas esse caminho deve receber scripts, hardening e testes próprios.

## 8. Ambientes

- `Development`: dados fictícios, seed `vh`, logs detalhados e hot reload.
- `Staging`: configuração semelhante à produção, seed bootstrap com troca obrigatória, migrations e testes de aceitação.
- `Production`: seed bootstrap com troca obrigatória, segredos externos, HTTPS, logs restritos, backups e monitoramento.

Nunca restaurar dados pessoais de produção em desenvolvimento sem anonimização.

## 9. Backup e restauração

- Backup lógico diário do MySQL e retenção inicial de 7 diários + 4 semanais.
- Cópia fora do host e criptografia em trânsito e repouso.
- Assets persistentes incluídos no plano.
- Restauração ensaiada em staging antes do piloto e depois periodicamente.
- Registrar RPO e RTO definitivos com a escola antes da produção.

## 10. Checklist de liberação

- Build e testes aprovados.
- Imagens identificadas por versão imutável, nunca apenas `latest`.
- Migrations revisadas e backup confirmado.
- Administrador bootstrap já trocou `123456`; nenhum usuário possui `MustChangePassword` pendente.
- HTTPS, headers e CORS validados.
- MySQL não exposto publicamente.
- Health checks, logs e alertas ativos.
- Teste de login, treino, nascimento e acompanhamento concluído.
- Plano de rollback e restauração verificado.

## 11. Referências oficiais

- [.NET no Windows](https://learn.microsoft.com/dotnet/core/install/windows)
- [.NET no Linux](https://learn.microsoft.com/dotnet/core/install/linux)
- [Ciclo de versões do Node.js](https://nodejs.org/en/about/previous-releases)
- [Docker Desktop no Windows](https://docs.docker.com/desktop/setup/install/windows-install/)
- [Docker Engine no Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
- [MySQL 8.4](https://dev.mysql.com/doc/refman/8.4/en/)
