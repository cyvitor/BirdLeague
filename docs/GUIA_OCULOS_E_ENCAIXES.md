# Guia de óculos e encaixes — BirdLeague

## Escopo do pack

O primeiro pack contém três cosméticos frontais separados do personagem:

| Modelo | Chave | Arquivo | Identidade visual |
| --- | --- | --- | --- |
| Clássico | `accessories/glasses/classic/front` | `classic-front.png` | Armação retangular arredondada em azul Bluebird |
| Estiloso | `accessories/glasses/bold/front` | `bold-front.png` | Armação expressiva laranja com detalhes azuis |
| Professor | `accessories/glasses/scholar/front` | `scholar-front.png` | Armação redonda azul-marinho com ponte dourada |

Os arquivos ficam em `assets/accessories/glasses/`. O `manifest.json` da pasta é a fonte de verdade para carregamento e encaixe.

## Coordenadas e encaixe

Os acessórios usam a mesma prancheta transparente de 1024 × 1024 do Bloo. O centro óptico de todos os modelos foi normalizado para a âncora documentada:

```txt
eyes_center de referência = (512, 420)
encaixe visual do Hatchling = aproximadamente (528, 420)
```

O frontend deve sobrepor a imagem do acessório à imagem do personagem sem aplicar recorte ou `object-fit` diferente. Como as duas camadas têm a mesma prancheta, o encaixe básico é direto:

```tsx
<div className="relative aspect-square">
  <img className="absolute inset-0 h-full w-full object-contain" src={blooAsset} alt={blooAlt} />
  <img className="absolute inset-0 h-full w-full object-contain" src={glassesAsset} alt="" />
</div>
```

O cosmético é decorativo quando o Bloo já possui texto alternativo; por isso, usar `alt=""` na composição. Em uma tela de inventário onde o item é o conteúdo principal, usar o texto alternativo do manifesto.

## Ordem das camadas

1. Sombra.
2. Base do Bloo.
3. Roupa ou variação corporal.
4. Óculos (`zIndex` lógico 30).
5. Elementos de primeiro plano e efeitos.

Na pose `thinking`, a asa próxima ao rosto deveria aparecer parcialmente à frente da armação. O MVP pode renderizar os óculos integralmente acima da base; quando houver máscaras ou personagem segmentado, renderizar a asa frontal acima dos óculos.

## Compatibilidade de poses e ângulos

As quatro poses atuais do Hatchling são essencialmente frontais e usam o encaixe visual `(528, 420)`, ligeiramente à direita da âncora geométrica por causa da perspectiva 3/4 do rosto. Não espelhar armações assimétricas.

A arquitetura prevê os ângulos `front`, `right-3q` e `left-3q`. Este pack entrega `front`, suficiente para as poses atuais. Quando uma futura pose girar a cabeça de forma perceptível:

- criar um arquivo separado, por exemplo `classic-right-3q.png`;
- manter a chave `accessories/glasses/{model}/{angle}`;
- registrar `x`, `y`, `scale` e `rotationDeg` por fase e pose;
- não simular 3/4 apenas comprimindo horizontalmente a arte frontal quando isso deformar aro e ponte.

## Regras de implementação

- Carregar o modelo pelo `key`, nunca por caminho montado manualmente.
- Persistir a escolha cosmética como modelo/chave, não como imagem composta.
- Óculos não alteram XP, dificuldade ou qualquer regra pedagógica.
- Não rasterizar permanentemente os óculos sobre o Hatchling.
- Aplicar o mesmo dimensionamento responsivo da camada base.
- Se a fase do Bloo mudar, consultar os transforms daquela fase antes de reutilizar o modelo.

## Validação visual

Os três PNGs foram validados em RGBA, 1024 × 1024, sRGB, com cantos transparentes. O encaixe foi ajustado visualmente para a perspectiva do Hatchling: centros entre `x=527.5–530.5`, com `y=420.5`. As larguras finais são 525 px (`classic`), 545 px (`bold`) e 515 px (`scholar`), dimensionadas para envolver integralmente os dois olhos.

Antes do piloto, conferir as composições em 220 px e 320 px de largura. Aprovar quando a ponte estiver centralizada, os aros cobrirem os olhos de forma equilibrada e não houver halo magenta.

## Produção

As imagens foram geradas com a ferramenta integrada, usando o Hatchling e `assets/BIRD.png` como referências. Os prompts pediram acessório isolado, arte 2D game-ready, fundo chroma-key uniforme, ausência de personagem/texto/sombra e centro óptico em `(512, 420)`. Após a geração, o fundo foi removido localmente e o conteúdo foi reposicionado matematicamente na âncora.
