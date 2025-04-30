# Painel de Prêmios, Reconhecimentos e Destaques da UFMS

Este projeto é um painel interativo que exibe **prêmios**, **reconhecimentos** e **destaques** da UFMS. Ele permite que tanto os usuários internos quanto externos da instituição filtrem os dados por **Tipo**, **Ano**, **Categoria** e **Unidade**, além de visualizar informações detalhadas sobre cada item em um layout organizado e com imagens.

## Funcionalidades

-   **Carregamento Dinâmico de Dados:** Os dados são carregados de forma dinâmica a partir de uma planilha hospedada no Google Apps Script, garantindo que as informações exibidas estejam sempre atualizadas.
-   **Filtros Interativos:** Os usuários podem refinar a busca e encontrar informações específicas utilizando os seguintes filtros:
    -   Tipo (Prêmio, Reconhecimento, Destaque)
    -   Ano de ocorrência
    -   Categoria do prêmio/reconhecimento/destaque
    -   Unidade acadêmica ou administrativa responsável
-   **Exibição Detalhada de Resultados:** Os resultados são apresentados em um layout claro e organizado, incluindo:
    -   Título do prêmio/reconhecimento/destaque
    -   Imagem representativa
    -   Ano, Categoria e Unidade
    -   Link para a matéria ou notícia relacionada
    -   Descrição detalhada
-   **Interface Amigável:** A página oferece uma interface intuitiva com botões para buscar e limpar os filtros, facilitando a navegação e o uso.
-   **Mensagens Informativas:** Exibe mensagens claras ao usuário, como quando nenhum resultado é encontrado para os filtros selecionados.

## Tecnologias Utilizadas

-   **HTML5:** Utilizado para estruturar a página web de forma semântica e acessível.
-   **CSS3:** Utilizado para estilizar a página, definindo o layout, as cores, a tipografia e outros aspectos visuais.
-   **JavaScript:** Utilizado para implementar a lógica de interação da página, como o carregamento dos dados, a aplicação dos filtros e a exibição dos resultados na tela.
-   **Google Apps Script:** Utilizado como serviço backend para acessar e fornecer os dados da planilha do Google Sheets de forma dinâmica.

## Estrutura do Projeto
painel-premios/
├── index.html        # Estrutura principal da página web
├── style.css         # Estilos da página
└── script.js        # Lógica de carregamento e interação

### Detalhamento dos Arquivos

-   **index.html:** Este arquivo contém a estrutura HTML principal da página, incluindo o cabeçalho, os filtros, o container para os resultados e a inclusão dos arquivos CSS e JavaScript.
-   **style.css:** Este arquivo contém as regras de estilo CSS que definem a aparência da página, como o layout, as cores, a tipografia e o espaçamento dos elementos.
-   **script.js:** Este arquivo contém o código JavaScript que implementa a lógica da página, como o carregamento dos dados da planilha, a aplicação dos filtros e a exibição dos resultados na tela.

## Como Usar

1.  **Clone o repositório:**

    ```bash
    git clone [https://github.com/seu-usuario/painel-premios.git](https://github.com/seu-usuario/painel-premios.git)
    ```

    (Substitua `seu-usuario/painel-premios.git` pelo URL do seu repositório).

2.  **Abra o arquivo `index.html` em um navegador web.**

## Classificação dos Dados

Os dados exibidos no painel são classificados e organizados nas seguintes categorias:

-   **Tipo:**
    -   Prêmio
    -   Reconhecimento
    -   Destaque

-   **Categoria:**
    -   Cultura, Comunicação e Artes
    -   Saúde e Esporte
    -   Ciência, Tecnologia e Inovação
    -   Sociedade e Impacto Social
    -   Negócios, Economia e Gestão

-   **Unidade:**
    -   FAMEZ
    -   FACH
    -   INISA
    -   INFI
    -   CPNV
    -   CPAR
    -   UFMS
    -   AGETIC
    -   HUMAP/UFMS
    -   FAALC
    -   CPCS
    -   CPTL
    -   AGINOVA
    -   CPAN
    -   FACOM
    -   CPCX
    -   FADIR
    -   INQUI
    -   FAED
    -   FACFAN
    -   INBIO
    -   FAMED
    -   ESAN
    -   CPNA
    -   PROPLAN
    -   FAODO
    -   FAENG

-   **Ano:**
    -   2006, 2009, 2011, 2016, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025

## Detalhes Técnicos

### Carregamento de Dados

Os dados são carregados de forma assíncrona a partir de uma planilha hospedada no Google Apps Script. O script do Apps Script é implantado como um aplicativo da web e fornece os dados em formato JSON. O URL do aplicativo da web é definido na variável `spreadsheetUrl` dentro do arquivo `script.js`. A função `fetch()` é utilizada para realizar a requisição HTTP.

### Filtros

Os filtros da página são preenchidos dinamicamente com os valores únicos extraídos dos dados carregados da planilha. As funções `populateFilters()`, `populateSelectTipoOrder()`, `populateSelectAnoDescending()` e `populateSelect()` no arquivo `script.js` são responsáveis por essa funcionalidade. A lógica de filtragem é aplicada quando o usuário interage com os filtros e clica no botão "Buscar Resultados". O método `filter()` do JavaScript é utilizado para realizar a filtragem dos dados.

### Exibição de Resultados

Os resultados da busca são exibidos dentro de um elemento `<div>` com o ID `data-container`. A função `renderData()` no arquivo `script.js` é responsável por criar os elementos HTML para exibir cada resultado, incluindo:

-   **Nome:** O título do prêmio/reconhecimento/destaque.
-   **Ano:** O ano em que o evento ocorreu.
-   **Categoria:** A categoria do prêmio/reconhecimento/destaque.
-   **Unidade:** A unidade acadêmica ou administrativa responsável.
-   **Link da Matéria:** Um link para a notícia ou matéria relacionada.
-   **Link da Imagem:** Um link para a imagem representativa.
-   **Descrição:** Uma descrição detalhada do evento.

Os dados são formatados e exibidos em um layout organizado, utilizando CSS para controlar a aparência e o posicionamento dos elementos.

### Considerações Importantes

-   **Google Apps Script:** É necessário configurar e implantar o script do Google Apps Script corretamente para que os dados da planilha sejam acessíveis à aplicação web.
-   **Nomes das Colunas:** Os nomes das colunas na planilha do Google Sheets devem corresponder exatamente aos nomes utilizados no código Javascript (arquivo `script.js`) para garantir que os dados sejam lidos corretamente.
-   **Links e Imagens:** Os links para as matérias e as imagens devem ser URLs válidos e acessíveis para que sejam exibidos corretamente na página.

Sinta-se à vontade para contribuir com este projeto!
