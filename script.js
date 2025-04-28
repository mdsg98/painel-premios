document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os elementos HTML que serão manipulados
    const dataContainer = document.getElementById('data-container');
    const filterTipoSelect = document.getElementById('filter-tipo');
    const filterAnoSelect = document.getElementById('filter-ano');
    const filterCategoriaSelect = document.getElementById('filter-categoria');
    const filterUnidadeSelect = document.getElementById('filter-unidade');
    const searchButton = document.getElementById('search-button');
    const clearFiltersButton = document.getElementById('clear-filters-button');
    
    // URL do Apps Script que fornece os dados da planilha
    const spreadsheetUrl = 'https://script.google.com/macros/s/AKfycbzarCfobIMbbgnuVz7Fa4cuutetQ2t78hBVvZJU1GzSNwLfwTZzKbMKG4RULdhPjA/exec';
    let allData = []; // Array para armazenar todos os dados da planilha
    
    // Faz a requisição para obter os dados da planilha
    fetch(spreadsheetUrl)
        .then(response => response.json()) // Converte a resposta para JSON
        .then(data => {
            allData = data; // Armazena os dados
            populateFilters(allData); // Preenche os filtros com os dados
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
            <p>Categoria: ${item['Categoria']}</p>
            <p>Unidade: ${item['Unidade']}</p>
            <p>Link da Matéria: <a href="${item['Link da Matéria']}" target="_blank">${item['Link da Matéria']}</a></p>
    `; // Exibe ano, categoria, unidade e link da matéria
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
    function populateFilters(data) {
        if (data.length > 0) { // Se houver dados
        populateSelectTipoOrder(filterTipoSelect, 'Tipo', data);
        populateSelectAnoDescending(filterAnoSelect, 'Ano', data);
        populateSelect(filterCategoriaSelect, 'Categoria', data);
        populateSelect(filterUnidadeSelect, 'Unidade', data);
        }
    }
    
    // Função para preencher um select (lista suspensa) com os valores únicos de uma coluna
    function populateSelect(selectElement, header, data) {
        const uniqueValues = [...new Set(data.map(item => item[header]))].sort(); // Obtém valores únicos e os ordena
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
    
        uniqueValues.forEach(value => { // Adiciona cada valor único como uma opção
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            selectElement.appendChild(option);
        });
    }
    
    // Função para preencher o select de Ano em ordem decrescente
    function populateSelectAnoDescending(selectElement, header, data) {
        const uniqueValues = [...new Set(data.map(item => item[header]))].sort((a, b) => b - a); // Obtém valores únicos e os ordena em ordem decrescente
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
    
    // Event listener para o botão de busca
    searchButton.addEventListener('click', function() {
        // Obtém os valores selecionados nos filtros
        const filterTipo = filterTipoSelect.value;
        const filterAno = filterAnoSelect.value;
        const filterCategoria = filterCategoriaSelect.value;
        const filterUnidade = filterUnidadeSelect.value;
    
    // Filtra os dados com base nos valores selecionados
        const filteredData = allData.filter(item => {
            let matchesTipo = true;
            let matchesAno = true;
            let matchesCategoria = true;
            let matchesUnidade = true;
    
            if (filterTipo && filterTipo !== 'Todos' && filterTipo !== '') {
                matchesTipo = item['Tipo'] === filterTipo;
        }
    
            if (filterAno && filterAno !== 'Todos' && filterAno !== '') {
                matchesAno = String(item['Ano']).trim() === filterAno.trim();
            }
    
            if (filterCategoria && filterCategoria !== 'Todos' && filterCategoria !== '') {
                matchesCategoria = item['Categoria'] === filterCategoria;
            }
    
            if (filterUnidade && filterUnidade !== 'Todos' && filterUnidade !== '') {
                matchesUnidade = item['Unidade'] === filterUnidade;
            }
    
            return matchesTipo && matchesAno && matchesCategoria && matchesUnidade;
        });
    
        // Atualiza o título da página com o número de resultados encontrados
        const h1Element = document.querySelector('h1');
        if (filteredData.length > 0) {
            h1Element.textContent = `Resultados encontrados: ${filteredData.length}`;
        }
        else {
            h1Element.textContent = 'Nenhum resultado encontrado';
        }
    
        renderData(filteredData); // Exibe os resultados filtrados
    });
    
    // Event listener para o botão de limpar filtros
    clearFiltersButton.addEventListener('click', function() {
        // Limpa os valores dos filtros
        filterTipoSelect.value = '';
        filterAnoSelect.value = '';
        filterCategoriaSelect.value = '';
        filterUnidadeSelect.value = '';
        dataContainer.innerHTML = ''; // Limpa os resultados
    
        // Reseta o título da página para o título original
        const h1Element = document.querySelector('h1');
        h1Element.textContent = 'Planilha de Prêmios, Reconhecimentos e Destaques da UFMS';
    });
    });