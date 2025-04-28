document.addEventListener('DOMContentLoaded', function() {
    const dataContainer = document.getElementById('data-container');
    const filterTipoSelect = document.getElementById('filter-tipo');
    const filterAnoSelect = document.getElementById('filter-ano');
    const filterCategoriaSelect = document.getElementById('filter-categoria');
    const filterUnidadeSelect = document.getElementById('filter-unidade');
    const searchButton = document.getElementById('search-button');
    const clearFiltersButton = document.getElementById('clear-filters-button');
    const spreadsheetUrl = 'https://script.google.com/macros/s/AKfycbzarCfobIMbbgnuVz7Fa4cuutetQ2t78hBVvZJU1GzSNwLfwTZzKbMKG4RULdhPjA/exec';
    let allData = [];

    fetch(spreadsheetUrl)
        .then(response => response.json())
        .then(data => {
            allData = data;
            populateFilters(allData);
            // Não renderizar os dados inicialmente
        })
        .catch(error => { // Se houver erro na requisição, exibe mensagem de erro
            console.error('Erro ao buscar os dados:', error);
            dataContainer.textContent = 'Erro ao carregar os dados.';
        });
     // Função para renderizar os dados no contêiner
    function renderData(dataToRender) {
        dataContainer.innerHTML = '';
        if (dataToRender.length === 0) {
            const noResultsMessage = document.createElement('p');
            noResultsMessage.textContent = 'Não existem resultados para os filtros selecionados.';
            dataContainer.appendChild(noResultsMessage);
        } else {
            dataToRender.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item');
                for (const key in item) {
                    const infoParagraph = document.createElement('p');
                    infoParagraph.innerHTML = `<strong>${key}:</strong> ${item[key]}`;
                    itemDiv.appendChild(infoParagraph);
                }
                dataContainer.appendChild(itemDiv);
            });
        }
    }
    // Função para popular os filtros com os dados únicos
    function populateFilters(data) {
        if (data.length > 0) {
            populateSelectTipoOrder(filterTipoSelect, 'Tipo', data);
            populateSelectAnoDescending(filterAnoSelect, 'Ano', data);
            populateSelect(filterCategoriaSelect, 'Categoria', data);
            populateSelect(filterUnidadeSelect, 'Unidade', data);
        }
    }
    // Função para popular um select com valores únicos de um cabeçalho específico
    function populateSelect(selectElement, header, data) {
        const uniqueValues = [...new Set(data.map(item => item[header]))].sort(); // Pega valores únicos e ordena
        selectElement.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '';
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        const todosOption = document.createElement('option');
        todosOption.value = 'Todos';
        todosOption.textContent = 'Todos';
        selectElement.appendChild(todosOption);

        uniqueValues.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            selectElement.appendChild(option);
        });
    }
    // Função para popular o select de ano em ordem decrescente
    function populateSelectAnoDescending(selectElement, header, data) {
        const uniqueValues = [...new Set(data.map(item => item[header]))].sort((a, b) => b - a);
        selectElement.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '';
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        const todosOption = document.createElement('option');
        todosOption.value = 'Todos';
        todosOption.textContent = 'Todos';
        selectElement.appendChild(todosOption);

        uniqueValues.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            selectElement.appendChild(option);
        });
    }
    // Função para popular o select de tipo com ordem personalizada (Prêmio, Reconhecimento, Destaque)
    function populateSelectTipoOrder(selectElement, header, data) {
        const customOrder = ['Prêmio', 'Reconhecimento', 'Destaque'];
        const uniqueValuesFromData = [...new Set(data.map(item => item[header]))];
        selectElement.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '';
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        const todosOption = document.createElement('option');
        todosOption.value = 'Todos';
        todosOption.textContent = 'Todos';
        selectElement.appendChild(todosOption);

        const sortedValues = [];
        customOrder.forEach(orderValue => {
            if (uniqueValuesFromData.includes(orderValue)) {
                sortedValues.push(orderValue);
            }
        });
        uniqueValuesFromData.forEach(value => {
            if (!customOrder.includes(value)) {
                sortedValues.push(value);
            }
        });

        sortedValues.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            selectElement.appendChild(option);
        });
    }
    // Adiciona eventos de clique para o botão de pesquisa
    searchButton.addEventListener('click', function() {
        const filterTipo = filterTipoSelect.value;
        const filterAno = filterAnoSelect.value;
        const filterCategoria = filterCategoriaSelect.value;
        const filterUnidade = filterUnidadeSelect.value;

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

        renderData(filteredData);
    });
    // Adiciona evento de clique para o botão de limpar filtros
    clearFiltersButton.addEventListener('click', function() {
        filterTipoSelect.value = '';
        filterAnoSelect.value = '';
        filterCategoriaSelect.value = '';
        filterUnidadeSelect.value = '';
        dataContainer.innerHTML = '';
    });
});