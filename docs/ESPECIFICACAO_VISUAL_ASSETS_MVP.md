# Especificação Visual e Assets do MVP — BirdLeague

## 1. Objetivo

Definir como Egg, rachaduras, Hatchling, reações e efeitos serão produzidos e encaixados sem deslocamentos. `assets/BIRD.png` é a referência principal da identidade do personagem.

## 2. Sistema de coordenadas

Todos os assets centrais usarão prancheta de **1024 × 1024 px**, PNG transparente.

- Centro visual: `(512, 520)`.
- Linha de chão: `y = 880`.
- Área segura: `x = 112–912`, `y = 72–880`.
- Sombra: centro `(512, 856)`, máximo `560 × 96`.
- Ponto de apoio fixo: `(512, 880)` em todos os estados.

## 3. Escala e enquadramento

### Egg e rachaduras

- Caixa aproximada: `560 × 680 px`.
- Centro horizontal: `x = 512`.
- Base: `y = 880`; topo aproximado: `y = 200`.
- A silhueta externa não muda entre os estados de rachadura.

### Hatchling

- Caixa máxima: `720 × 800 px`.
- Centro horizontal: `x = 512`.
- Base dos pés: `y = 880`.
- Olhos na faixa `y = 390–460`.
- Nenhuma extremidade pode ser cortada.

## 4. Estados obrigatórios

| Asset key | Uso |
| --- | --- |
| `bloo/egg/idle` | Ovo inteiro na home |
| `bloo/egg/crack-1` | Após 1–2 respostas |
| `bloo/egg/crack-2` | Após 3–4 respostas |
| `bloo/egg/crack-3` | Após 5 respostas |
| `bloo/hatch/burst` | Efeito da sexta resposta |
| `bloo/hatchling/idle` | Home após nascimento |
| `bloo/hatchling/happy` | Acerto |
| `bloo/hatchling/thinking` | Erro ou dica; curioso, nunca triste |
| `bloo/hatchling/celebrate` | Conquista |

## 5. Camadas e encaixes

Os arquivos-fonte devem separar sombra, corpo, rosto, detalhes, efeitos e acessórios futuros.

| Âncora | Referência | Uso |
| --- | --- | --- |
| `head_center` | `(512, 250)` | chapéus |
| `eyes_center` | `(512, 420)` | óculos |
| `chest_center` | `(512, 635)` | medalhas |
| `left_hand` | `(300, 650)` | itens de mão |
| `right_hand` | `(724, 650)` | itens de mão |
| `ground_center` | `(512, 880)` | sombra e efeitos |

Cada exportação terá manifesto com suas âncoras reais.

## 6. Formato e nomenclatura

- Mestre editável com camadas; entrega PNG RGBA 1024 × 1024 em sRGB.
- WebP/AVIF podem ser gerados no build.
- Nomes minúsculos sem espaços, como `egg-crack-1.png`.
- Sem texto dentro das imagens.
- Efeitos animados ou reutilizáveis devem ficar separados.

Manifesto sugerido:

```json
{
  "key": "bloo/hatchling/idle",
  "width": 1024,
  "height": 1024,
  "groundAnchor": { "x": 0.5, "y": 0.859375 },
  "anchors": { "headCenter": { "x": 0.5, "y": 0.244 } }
}
```

## 7. Movimento e responsividade

- Reações: 400–900 ms; nascimento: no máximo 3 segundos.
- Animações não bloqueiam a próxima ação.
- Com `prefers-reduced-motion`, usar opacidade de até 200 ms.
- Usar `object-fit: contain` e a mesma caixa em todos os estados.
- Celular: 220–320 px de largura visual; desktop: 320–440 px.
- CTA e texto não podem sobrepor rosto ou rachaduras.

## 8. Critérios de aprovação

- Trocas mantêm centro, escala e base sem salto perceptível.
- Rachaduras são legíveis em tela de 360 px.
- Expressões são compreensíveis sem texto.
- Erro transmite curiosidade e incentivo.
- Não há halos ou serrilhado evidente na transparência.
- Cada asset possui chave, dimensões e texto alternativo cadastráveis.

## 9. Ícones de conquistas

Os ícones usam SVG como fonte principal e PNG transparente de 256 × 256 px como fallback. Todos compartilham:

- moldura circular inspirada em medalha;
- contorno azul-escuro, preenchimento azul/laranja e brilho amarelo;
- formas simples legíveis a 32 px;
- símbolo central sem texto;
- área segura de 24 px;
- versões `locked` em cinza-azulado, sem depender apenas da cor: usar também silhueta e pequeno cadeado;
- nomes `achievements/{code-lowercase}`.

| Código | Símbolo visual | Cor/acento | Asset key |
| --- | --- | --- | --- |
| `NEW_HATCHLING` | ovo aberto com cabeça do Bloo | amarelo e azul | `achievements/new-hatchling` |
| `FIRST_LESSON` | livro aberto com uma estrela | azul-claro | `achievements/first-lesson` |
| `FIRST_THEME` | mapa/trilha com primeiro marcador | laranja | `achievements/first-theme` |
| `THEME_EXPLORER` | bússola sobre livro | azul e laranja | `achievements/theme-explorer` |
| `BLOO_IS_LEARNING` | Bloo pensando com pequena lâmpada | amarelo | `achievements/bloo-is-learning` |
| `SKILL_LEARNED` | cérebro estilizado com check | verde e azul | `achievements/skill-learned` |
| `GREETINGS_CLIMBER` | quatro degraus com balões de fala | laranja | `achievements/greetings-climber` |
| `GREETINGS_MASTER` | dois balões de fala e coroa | dourado | `achievements/greetings-master` |
| `VOCABULARY_EXPLORER` | bússola formada por letras | azul-claro | `achievements/vocabulary-explorer` |

Cada ícone terá `AltText` equivalente à descrição curta da conquista. A coroa de `Greetings Master` não deve se parecer com item comprável; ela representa domínio.
