# Painel de Prêmios, Reconhecimentos e Destaques da UFMS

Este projeto é um painel interativo que exibe prêmios, reconhecimentos e destaques da UFMS. Ele permite que usuários filtrem, pesquisem, ordenem e visualizem essas informações de forma paginada.

## Funcionalidades

-   **Carregamento Dinâmico de Dados:** Carrega dados de uma planilha do Google Apps Script.
-   **Filtros Interativos:** Permite filtrar por Tipo, Ano, Categoria e Unidade.
    -   O filtro de 'Tipo' possui uma ordem de exibição personalizada (Prêmio, Reconhecimento, Destaque).
    -   O filtro de 'Ano' exibe os anos em ordem decrescente.
-   **Busca por Palavra-Chave:** Permite pesquisar termos em campos como Nome, Descrição, Tipo, Categoria e Unidade. Inclui um botão para limpar rapidamente o termo pesquisado.
-   **Ordenação de Resultados:** Permite ordenar os resultados por ano, em ordem crescente ou decrescente.
-   **Exibição de Resultados:** Exibe resultados em um layout organizado com imagens e detalhes.
    -   Suporte para múltiplos links de matéria, separados por vírgula.
-   **Paginação dos Resultados:** Divide os resultados em múltiplas páginas para melhor navegação, com controles no topo e no rodapé da lista.
-   **Botão de Limpar Filtros:** Limpa todos os filtros aplicados, a busca por palavra-chave, a ordenação e redefine os resultados para a visualização padrão.
-   **Botão "Voltar ao Topo":** Facilita a navegação para o topo da página.

## Tecnologias

-   **HTML5:** Estrutura da página.
-   **CSS3:** Estilos da página.
-   **JavaScript:** Lógica da aplicação.
-   **Google Apps Script:** Fonte dos dados.

## Overview da Planilha

Os dados são organizados nas seguintes colunas:

-   **Tipo:** (Prêmio, Reconhecimento, Destaque)
-   **Ano:** Ano do evento.
-   **Categoria:** Área do evento.
-   **Unidade:** Unidade da UFMS.
-   **Nome do Prêmio:** Nome do prêmio/evento. (Utilizado para exibição)
-   **Nome:** (Utilizado internamente para busca e outras lógicas)
-   **Descrição:** Detalhes do evento.
-   **Link da Matéria:** Link(s) para a(s) notícia(s), podendo conter múltiplos links separados por vírgula.
-   **Link da Imagem:** Link para a imagem.

## Como Usar

1.  Clone o repositório.
2.  Abra `index.html` no navegador.

## Uso dos Filtros e Funcionalidades

-   Selecione opções nos filtros (Tipo, Ano, Categoria, Unidade).
-   Digite termos na caixa "Pesquisar" para filtrar por palavra-chave. Pressione "Enter" ou clique em "Buscar Resultados".
-   Use o menu "Ordenar resultados por ordem" para classificar os itens por ano.
-   Clique em "Buscar Resultados" para aplicar os filtros e a pesquisa.
-   Utilize os botões "Página Anterior" e "Próxima Página" para navegar entre os resultados.
-   Clique em "Limpar Filtros" para redefinir todas as seleções e buscas.
-   O botão "↑" (Voltar ao Topo) aparece durante a rolagem da página para facilitar o retorno ao cabeçalho.