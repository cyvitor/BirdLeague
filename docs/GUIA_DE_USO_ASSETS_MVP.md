# Guia de uso dos assets do MVP — BirdLeague

Este guia liga o pack em `assets/characters/bloo/mvp/` às telas e regras do MVP. O `manifest.json` é a fonte consumível pelo frontend; este documento explica a intenção de produto.

## Mapa de colocação

| Chave | Arquivo | Onde aparece | Gatilho |
| --- | --- | --- | --- |
| `bloo/egg/idle` | `egg-idle.png` | Tutorial (passo do ovo), home inicial e card do idioma antes do treino | Nenhuma resposta concluída |
| `bloo/egg/crack-1` | `egg-crack-1.png` | Caixa fixa do personagem na pergunta e no feedback | 1–2 respostas do `FirstHatch` |
| `bloo/egg/crack-2` | `egg-crack-2.png` | Mesma caixa do treino | 3–4 respostas |
| `bloo/egg/crack-3` | `egg-crack-3.png` | Mesma caixa do treino e transição pré-nascimento | 5 respostas |
| `bloo/hatch/burst` | `hatch-burst.png` | Overlay central da cena de nascimento | Sexta resposta; 0,4–0,9 s dentro da animação de até 3 s |
| `bloo/hatchling/idle` | `hatchling-idle.png` | Nomeação, home pós-nascimento, missão `Greetings`, perfil e resumo | Estado padrão do Hatchling |
| `bloo/hatchling/happy` | `hatchling-happy.png` | Feedback positivo durante qualquer treino | Resposta correta |
| `bloo/hatchling/thinking` | `hatchling-thinking.png` | Feedback com dica/explicação | Resposta incorreta; nunca usar como punição |
| `bloo/hatchling/celebrate` | `hatchling-celebrate.png` | Nascimento, desbloqueio de conquista e resumo da missão | `New Hatchling`, `First Lesson` ou outra conquista |

## Regras para o frontend

- Renderizar todos os estados na mesma caixa quadrada com `object-fit: contain`; não recortar nem recalcular a posição por arquivo.
- Usar largura visual de 220–320 px no celular e 320–440 px no desktop.
- Preservar o ponto de chão normalizado `(0.5, 0.859375)` e o centro da prancheta durante trocas.
- O efeito `hatch-burst.png` é uma camada acima de `egg-crack-3.png` e abaixo/acima do Hatchling conforme o frame; não substitui permanentemente o personagem.
- Reações duram 400–900 ms e não bloqueiam a próxima ação. Com `prefers-reduced-motion`, fazer apenas crossfade de até 200 ms.
- CTA, enunciado e feedback ficam fora da região do rosto; nenhuma imagem contém texto.
- Usar o `alt` do manifesto quando a imagem trouxer informação. Em trocas puramente animadas e redundantes com texto visível, usar `alt=""` para evitar anúncio repetido.

## Sequência do primeiro treino

`idle (0)` → `crack-1 (1–2)` → `crack-2 (3–4)` → `crack-3 (5)` → `burst + celebrate (6)` → `hatchling/idle`.

O estado deriva da quantidade de respostas persistidas, não de acertos. Isso garante retomada visual idempotente.

## Uso nas landings

- Landing de alunos: `egg-idle` no hero; sequência de rachaduras em “O que vai acontecer”; `hatchling-celebrate` em “Sua primeira conquista”.
- Landing da escola: `egg-idle` ou `hatchling-idle` dentro do mockup do aluno; não usar `hatch-burst` como decoração contínua.
- Mockups de interface continuam sendo produzidos pelo próprio layout do frontend; não fazem parte deste pack de personagem.

## Produção e manutenção

Todos os arquivos finais são PNG RGBA, sRGB, 1024 × 1024 e têm cantos transparentes. Os estados foram gerados com a ferramenta integrada de geração de imagens, usando `assets/BIRD.png` e a logo Bluebird como referências, seguidos de remoção local de chroma-key e normalização para a prancheta especificada.

Prompts de produção: ovo intacto na paleta Bluebird; três edições progressivas que preservam silhueta; Hatchling jovem derivado do mascote; edições de expressão feliz, curiosa e comemorativa; burst separado sem personagem. Restrições comuns: contorno 2D game-ready, sem texto/logos/sombras, base fixa e fundo removível uniforme.

Antes do piloto, a escola deve aprovar identidade, proporção e expressões. Se houver revisão artística, manter nomes, chaves, prancheta e âncoras para não exigir mudança no código.

Para acessórios em camada, consulte [Guia de óculos e encaixes](GUIA_OCULOS_E_ENCAIXES.md).
