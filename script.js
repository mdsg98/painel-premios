document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os elementos HTML que serão manipulados
    const searchButton = document.getElementById('search-button');
    const clearFiltersButton = document.getElementById('clear-filters-button');
    const dataContainer = document.getElementById('data-container');
    const filterTipoSelect = document.getElementById('filter-tipo');
    const filterAnoSelect = document.getElementById('filter-ano');
    const filterCategoriaSelect = document.getElementById('filter-categoria');
    const filterUnidadeSelect = document.getElementById('filter-unidade');
    
    
    // URL do Apps Script que fornece os dados da planilha
    const spreadsheetUrl = 'https://script.google.com/macros/s/AKfycbzarCfobIMbbgnuVz7Fa4cuutetQ2t78hBVvZJU1GzSNwLfwTZzKbMKG4RULdhPjA/exec';
    let allData = []; // Array para armazenar todos os dados da planilha
    let data = []; // Array para armazenar os dados filtrados
    
    // Variáveis para controle de paginação
    let page = 1; // Página atual
    const itemsPerPage = 10; // Definição de quantos resultados exibir por página

    // Variáveis para controle de paginação inferior (rodapé)
    const paginationContainer = document.getElementById('pagination-container');
    const prevPageButton = document.getElementById('prev-page-button');
    const nextPageButton = document.getElementById('next-page-button');
    const pageInfo = document.getElementById('page-info');

    //Variáveis para controle de paginação superior (topo)
    const paginationContainerTop = document.getElementById('pagination-container-top');
    const prevPageButtonTop = document.getElementById('prev-page-button-top');
    const nextPageButtonTop = document.getElementById('next-page-button-top');
    const pageInfoTop = document.getElementById('page-info-top');

    // Variáveis para controle de exibição dos filtros
    const toggleFiltersButton = document.getElementById('toggle-filters-button');

    // Variáveis para controle de ordenação por ano dos resultados
    const sortYearAscButton = document.getElementById('sort-year-asc-button'); // Botão para ordenar por ano crescente
    const sortYearDescButton = document.getElementById('sort-year-desc-button'); // Botão para ordenar por ano decrescente
    
    // Faz a requisição para obter os dados da planilha
    fetch(spreadsheetUrl)
        .then(response => response.json()) // Converte a resposta para JSON
        .then(fetchedData => {
            allData = fetchedData; // Armazena os dados
            populateFilters(allData); // Preenche os filtros com os dados

            // Verifica se há dados para renderizar
            if (allData && allData.length > 0) {
                data = [...allData]; // Inicializa os dados com todos os dados
                
                data.sort((a, b) => {
                    const yearA = parseInt(a['Ano'], 10); // Converte o ano para inteiro
                    const yearB = parseInt(b['Ano'], 10); // Converte o ano para inteiro
                    
                    if (isNaN(yearA) && isNaN(yearB)) return 0; // Se ambos os anos não forem números, retorna 0
                    if (isNaN(yearA)) return 1; // Se o ano A não for número, coloca B antes
                    if (isNaN(yearB)) return -1; // Se o ano B não for número, coloca A antes

                    return yearB - yearA; // Ordena em ordem decrescente
                });
            
                page = 1; // Garante que a página comece em 1
                renderPage(data, page); // Renderiza a primeira página dos dados
            } else { // Condicional para quando não há dados trazidos
                dataContainer.textContent = 'Nenhum dado encontrado.'; // Exibe mensagem de erro

                // Atualiza os controles de paginação
                if (typeof updateAllPaginationControls === 'function') {
                    updateAllPaginationControls(1, 0, itemsPerPage); // Atualiza os controles de paginação
                } else { // Fallback para quando a função não está definida
                    if(paginationContainer) paginationContainer.style.display = 'none'; // Esconde a paginação inferior
                    if(paginationContainerTop) paginationContainerTop.style.display = 'none'; // Esconde a paginação superior
                    if(sortYearAscButton) sortYearAscButton.style.display = 'none'; // Esconde o botão de ordenação crescente
                    if(sortYearDescButton) sortYearDescButton.style.display = 'none'; // Esconde o botão de ordenação decrescente
                }
            }
    })
    .catch(error => { // Captura erros na requisição
        console.error('Erro ao buscar os dados:', error);
        dataContainer.textContent = 'Erro ao carregar os dados.';
    });
    
    // Função para exibir os dados na página
    function renderData(dataToRender) {
        dataContainer.innerHTML = ''; // Limpa o container de dados
    
    if (dataToRender.length === 0) { // Se não houver resultados
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = 'Não existem resultados para os filtros selecionados.';
        dataContainer.appendChild(noResultsMessage);
    } else { // Se houver resultados
    dataToRender.forEach(item => { // Itera por cada item (linha da planilha)
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item'); // Adiciona a classe 'item' para estilização
    
        const nome = document.createElement('h2');
        nome.textContent = item['Nome']; // Exibe o nome
        itemDiv.appendChild(nome);
    
        const itemContent = document.createElement('div');
        itemContent.classList.add('item-content'); // Adiciona a classe 'item-content'
    
        const itemImage = document.createElement('div');
        itemImage.classList.add('item-image'); // Adiciona a classe 'item-image'
        const img = document.createElement('img');
        img.src = item['Link da Imagem']; // Exibe a imagem
        img.alt = item['Link da Imagem']; // Adiciona texto alternativo para a imagem
        itemImage.appendChild(img);
        itemContent.appendChild(itemImage);
    
        const itemDetails = document.createElement('div');
        itemDetails.classList.add('item-details'); // Adiciona a classe 'item-details'
        itemDetails.innerHTML = `
            <p>Ano: ${item['Ano']}</p>
            <p>Tipo: ${item['Tipo']}</p>
            <p>Categoria: ${item['Categoria']}</p>
            <p>Unidade: ${item['Unidade']}</p>
            <p>Link da Matéria: <a href="${item['Link da Matéria']}" target="_blank">${item['Link da Matéria']}</a></p>`;
        // Exibe ano, categoria, unidade e link da matéria
        itemContent.appendChild(itemDetails);
    
        itemDiv.appendChild(itemContent);
    
        const descricao = document.createElement('p');
        descricao.classList.add('item-description'); // Adiciona a classe 'item-description'
        descricao.textContent = item['Descrição']; // Exibe a descrição
        itemDiv.appendChild(descricao);
    
        dataContainer.appendChild(itemDiv); // Adiciona o item completo ao container
    });
    }
    }
    
    // Função para preencher os filtros com os dados da planilha
    function populateFilters(dataToPopulate) {
        if (dataToPopulate.length > 0) { // Se houver dados
        populateSelectTipoOrder(filterTipoSelect, 'Tipo', dataToPopulate); // Preenche o filtro de tipo
        populateSelectAnoDescending(filterAnoSelect, 'Ano', dataToPopulate); // Preenche o filtro de ano
        populateSelect(filterCategoriaSelect, 'Categoria', dataToPopulate); // Preenche o filtro de categoria
        populateSelect(filterUnidadeSelect, 'Unidade', dataToPopulate); // Preenche o filtro de unidade
        }
    }
    
    // Função para preencher um select (lista suspensa) com os valores únicos de uma coluna
    function populateSelect(selectElement, header, dataToPopulate) {
        const uniqueValues = [...new Set(dataToPopulate.map(item => item[header]))].sort(); // Obtém valores únicos e os ordena
        selectElement.innerHTML = ''; // Limpa as opções existentes
    
        const defaultOption = document.createElement('option'); // Cria uma opção padrão vazia
        defaultOption.value = ''; // Define o valor como vazio
        defaultOption.textContent = ''; // Define o texto como vazio
        defaultOption.selected = true; // Define como selecionado inicialmente
        selectElement.appendChild(defaultOption); // Adiciona a opção vazia padrão
    
        const todosOption = document.createElement('option'); // Cria a opção "Todos"
        todosOption.value = 'Todos'; // Define o valor como "Todos"
        todosOption.textContent = 'Todos'; // Define o texto como "Todos"
        selectElement.appendChild(todosOption); // Adiciona a opção "Todos"
    
        uniqueValues.forEach(value => { // Adiciona cada valor único como uma opção
            const option = document.createElement('option'); // Cria uma nova opção
            option.value = value; // Define o valor da opção
            option.textContent = value; // Define o texto da opção
            selectElement.appendChild(option); // Adiciona a opção ao select
        });
    }
    
    // Função para preencher o select de Ano em ordem decrescente
    function populateSelectAnoDescending(selectElement, header, data) {
        const uniqueValues = [...new Set(data.map(item => item[header]))].sort((a, b) => b - a); // Obtém valores únicos e os ordena em ordem decrescente
        selectElement.innerHTML = ''; // Limpa as opções existentes
    
        const defaultOption = document.createElement('option'); // Cria uma opção padrão vazia
        defaultOption.value = ''; // Define o valor como vazio
        defaultOption.textContent = ''; // Define o texto como vazio
        defaultOption.selected = true; // Define como selecionado inicialmente
        selectElement.appendChild(defaultOption); // Adiciona a opção vazia padrão
    
        const todosOption = document.createElement('option'); // Cria a opção "Todos"
        todosOption.value = 'Todos'; // Define o valor como "Todos"
        todosOption.textContent = 'Todos'; // Define o texto como "Todos"
        selectElement.appendChild(todosOption); // Adiciona a opção "Todos"
    
        uniqueValues.forEach(value => { // Adiciona cada valor único como uma opção
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            selectElement.appendChild(option);
        });
    }
    
    // Função para preencher o select de Tipo em uma ordem específica
    function populateSelectTipoOrder(selectElement, header, data) {
        const customOrder = ['Prêmio', 'Reconhecimento', 'Destaque']; // Define a ordem desejada
        const uniqueValuesFromData = [...new Set(data.map(item => item[header]))]; // Obtém valores únicos
        selectElement.innerHTML = ''; // Limpa as opções existentes
    
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '';
        defaultOption.selected = true; // Define como selecionado inicialmente
        selectElement.appendChild(defaultOption); // Adiciona a opção vazia padrão
    
        const todosOption = document.createElement('option');
        todosOption.value = 'Todos';
        todosOption.textContent = 'Todos';
        selectElement.appendChild(todosOption); // Adiciona a opção "Todos"
    
        const sortedValues = [];
        customOrder.forEach(orderValue => { // Adiciona os valores na ordem personalizada
            if (uniqueValuesFromData.includes(orderValue)) {
                sortedValues.push(orderValue);
        }
       });
        uniqueValuesFromData.forEach(value => { // Adiciona os valores restantes (se houver)
            if (!customOrder.includes(value)) {
                sortedValues.push(value);
            }
        });
    
        sortedValues.forEach(value => { // Adiciona as opções ao select
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            selectElement.appendChild(option);
        });
    }

    function updateAllPaginationControls(page, totalItems, itemsPerPage) {
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1; // Calcula o total de páginas
        const noResults = totalItems === 0; // Verifica se não há resultados

        const displayStyle = noResults ? 'flex' : (totalItems > 0 ? 'flex' : 'none'); // Define o estilo de exibição

        // Paginação inferior (rodapé)
        paginationContainer.style.display = displayStyle; // Exibe ou esconde a paginação inferior
        pageInfo.textContent = `Página ${page} de ${totalPages}`; // Atualiza o texto da página
        prevPageButton.disabled = page === 1; // Desabilita o botão "anterior" se estiver na primeira página
        nextPageButton.disabled = page === totalPages || noResults; // Desabilita o botão "próximo" se estiver na última página

        // Paginação superior (topo)
        paginationContainerTop.style.display = displayStyle; // Exibe ou esconde a paginação superior
        pageInfoTop.textContent = `Página ${page} de ${totalPages}`; // Atualiza o texto da página
        prevPageButtonTop.disabled = page === 1; // Desabilita o botão "anterior" se estiver na primeira página
        nextPageButtonTop.disabled = page === totalPages || noResults; // Desabilita o botão "próximo" se estiver na última página

        if (noResults) { // Se não houver resultados
            pageInfo.textContent = ''; // Limpa o texto da página
            pageInfoTop.textContent = ''; // Limpa o texto da página
            prevPageButton.disabled = true; // Desabilita o botão "anterior"
            nextPageButton.disabled = true; // Desabilita o botão "próximo"
            prevPageButtonTop.disabled = true; // Desabilita o botão "anterior" do topo
            nextPageButtonTop.disabled = true; // Desabilita o botão "próximo" do topo
        }

        if (totalItems > 0) { // Se houver resultados
            sortYearAscButton.style.display = 'block'; // Exibe o botão de ordenação crescente
            sortYearDescButton.style.display = 'block'; // Exibe o botão de ordenação decrescente
        } else {
            sortYearAscButton.style.display = 'none'; // Esconde o botão de ordenação crescente
            sortYearDescButton.style.display = 'none'; // Esconde o botão de ordenação decrescente            
        }
    }
    
    // Função para renderizar a página com os dados filtrados e paginados test
    function renderPage(data, page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageData = data.slice(start, end);

        dataContainer.innerHTML = ''; // Limpa o contêiner de dados

        if (data.length === 0) { // Se não houver resultados
            dataContainer.innerHTML = '<p>Nenhum resultado encontrado.</p>';
        }
        else { // Se houver resultados
            renderData(pageData); // Renderiza os dados da página atual
        }

        updateAllPaginationControls(page, data.length, itemsPerPage); // Atualiza os controles de paginação        
        document.querySelector("h1").scrollIntoView({ behavior: "smooth" }); // Rola suavemente para o título do projeto
    }

    function filterToggle() {
        const wrapper = document.getElementById('filter-wrapper');
        const toggleButton = document.getElementById('toggle-filters-button');

        if (wrapper.style.display === 'none') { // Se os filtros estão escondidos
            wrapper.style.display = 'block'; // Exibe os filtros
            toggleButton.textContent = 'Esconder Filtros'; // Altera o texto do botão
        } else { // Se os filtros estão visíveis
            wrapper.style.display = 'none'; // Esconde os filtros
            toggleButton.textContent = 'Mostrar Filtros'; // Altera o texto do botão
        }
    }

    // Event listener para o botão de busca
    searchButton.addEventListener('click', function() {  
    // Filtra os dados com base nos valores selecionados
        const tipo = filterTipoSelect.value;
        const ano = filterAnoSelect.value;
        const categoria = filterCategoriaSelect.value;
        const unidade = filterUnidadeSelect.value;

        const filteredData = allData.filter(item => {
            return (tipo === '' || tipo === 'Todos' || item['Tipo'] === tipo) &&
                   (ano === '' || ano === 'Todos' || String(item['Ano']) === String(ano)) && // Converte ano para string
                   (categoria === '' || categoria === 'Todos' || item['Categoria'] === categoria) &&
                   (unidade === '' || unidade === 'Todos' || item['Unidade'] === unidade);
        });

        data = filteredData; // Atualiza os dados atuais com os dados filtrados
        page = 1; // Reseta a página atual para 1
        renderPage(data, page); // Renderiza a primeira página dos dados filtrados
    });
    
    // Event listener para o botão de limpar filtros
    clearFiltersButton.addEventListener('click', function() {
        // Limpa os valores dos filtros
        filterTipoSelect.value = '';
        filterAnoSelect.value = '';
        filterCategoriaSelect.value = '';
        filterUnidadeSelect.value = '';

        dataContainer.innerHTML = ''; // Limpa o contâiner de resultados
        pageInfo.textContent = ''; // Reseta o texto da página
        paginationContainer.style.display = 'none'; // Esconde a paginação
        paginationContainerTop.style.display = 'none'; // Esconde a paginação superior
    });

    // Event listener para o botão Página Anterior do rodapé
    prevPageButton.addEventListener('click', function () {
        if (page > 1) {
            page--; // Vai para a página anterior
            renderPage(data, page); // Renderiza a nova página
        }
    });

    // Event listener para o botão Página Anterior do topo
    prevPageButtonTop.addEventListener('click', function () {
        if (page > 1) {
            page--; // Vai para a página anterior
            renderPage(data, page); // Renderiza a nova página
        }
    });    

    // Event listener para o botão de Próxima Página do rodapé
    nextPageButton.addEventListener('click', function () {
        const totalPages = Math.ceil(data.length / itemsPerPage); // Calcula o total de páginas
        if (page < totalPages) {
            page++; // Vai para a próxima página
            renderPage(data, page); // Renderiza a nova página
        }
    });

    nextPageButtonTop.addEventListener('click', function () {
        const totalPages = Math.ceil(data.length / itemsPerPage); // Calcula o total de páginas
        if (page < totalPages) {
            page++; // Vai para a próxima página
            renderPage(data, page); // Renderiza a nova página
        }
    });

    // Event listener para o botão de mostrar/esconder filtros
    toggleFiltersButton.addEventListener('click', filterToggle); // Adiciona evento de clique para mostrar/esconder filtros

    // Event listener para o botão de ordenação por ano (crescente)
    sortYearAscButton.addEventListener('click', function() {
        data.sort((a, b) => a['Ano'] - b['Ano']); // Ordena os dados por ano em ordem crescente
        page = 1; // Reseta a página atual para 1
        renderPage(data, page); // Renderiza a primeira página dos dados ordenados
    });
    sortYearDescButton.addEventListener('click', function() {
        data.sort((a, b) => b['Ano'] - a['Ano']); // Ordena os dados por ano em ordem decrescente
        page = 1; // Reseta a página atual para 1
        renderPage(data, page); // Renderiza a primeira página dos dados ordenados
    });
    });