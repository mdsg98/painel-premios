# Painel de Prêmios, Reconhecimentos e Destaques da UFMS

Este projeto é um painel interativo que exibe **prêmios**, **reconhecimentos** e **destaques** da UFMS. Ele permite que tanto os usuários internos quanto externos da instituição filtrem os dados por **Tipo**, **Ano**, **Categoria** e **Unidade**, além de visualizar informações detalhadas sobre cada item.

## Funcionalidades

- **Carregamento Dinâmico de Dados**: Os dados são carregados de uma planilha hospedada no Google Apps Script.
- **Filtros Interativos**: Os usuários podem filtrar os resultados por:
  - Tipo (Prêmio, Reconhecimento, Destaque)
  - Ano
  - Categoria
  - Unidade
- **Exibição de Resultados**: Os resultados são exibidos em um layout organizado, com informações detalhadas e imagens.
- **Botão de Limpar Filtros**: Permite redefinir os filtros e limpar os resultados exibidos.

## Tecnologias Utilizadas

- **HTML5**: Estrutura da página.
- **CSS3**: Estilização do layout.
- **JavaScript**: Lógica de carregamento, filtragem e exibição de dados.
- **Google Apps Script**: Fonte dos dados dinâmicos.

## Estrutura do Projeto
painel-premios/ ├── index.html 

### Estrutura Principal da Página
painel-premios/ ├── style.css

## Estilos da Página
painel-premios/ ├── script.js

## Lógica de Carregamento e Interação
## Como Usar

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/painel-premios.git

2. Abra o arquivo index.html em um navegador.

## Detalhes Técnicos
### Carregamento de Dados
Os dados são carregados de uma planilha hospedada no Google Apps Script por meio de uma requisição fetch. O URL da planilha está definido na variável spreadsheetUrl no arquivo script.js.

### Filtros
Os filtros são preenchidos dinamicamente com valores únicos extraídos dos dados carregados. A lógica de filtragem é aplicada ao clicar no botão "Buscar Resultados".

### Exibição de Resultados
Os resultados são exibidos em um contêiner (#data-container) com informações detalhadas, incluindo:

- Nome
- Ano
- Categoria
- Unidade
- Link da matéria
- Imagem
- Descrição
