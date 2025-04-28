document.addEventListener('DOMContentLoaded', function() {
    const dataContainer = document.getElementById('data-container');
    const filterTipoSelect = document.getElementById('filter-tipo');
    const filterAnoSelect = document.getElementById('filter-ano');
    const filterCategoriaSelect = document.getElementById('filter-categoria');
    const filterUnidadeSelect = document.getElementById('filter-unidade');
    const searchButton = document.getElementById('search-button');
    const spreadsheetUrl = 'https://script.google.com/macros/s/AKfycbzarCfobIMbbgnuVz7Fa4cuutetQ2t78hBVvZJU1GzSNwLfwTZzKbMKG4RULdhPjA/exec';
    let allData = [];

    fetch(spreadsheetUrl)
        .then(response => response.json())
        .then(data => {
            allData = data;
            populateFilters(allData);
            renderData(allData);
        })
        
        .catch(error => { // Se houver erro na requisição, exibe mensagem de erro
            console.error('Erro ao buscar os dados:', error);
            dataContainer.textContent = 'Erro ao carregar os dados.';
        });
    // Função para renderizar os dados no contêiner
    function renderData(dataToRender) {
        dataContainer.innerHTML = '';
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
    // Função para popular os filtros com os dados únicos
    function populateFilters(data) {
        if (data.length > 0) {
            const firstItem = data[0];
            const headers = Object.keys(firstItem);

            populateSelect(filterTipoSelect, 'Tipo', data);
            populateSelect(filterAnoSelect, 'Ano', data);
            populateSelect(filterCategoriaSelect, 'Categoria', data);
            populateSelect(filterUnidadeSelect, 'Unidade', data);
        }
    }
    // Função para popular um select com valores únicos de um cabeçalho específico
    function populateSelect(selectElement, header, data) {
        const values = [...new Set(data.map(item => item[header]))].sort(); // Pega valores únicos e ordena
        values.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            selectElement.appendChild(option);
        });
    }
    // Adiciona um evento de clique ao botão de pesquisa
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

            if (filterTipo && filterTipo !== 'Todos') {
                matchesTipo = item['Tipo'] === filterTipo;
            }

            if (filterAno && filterAno !== 'Todos') {
                matchesAno = item['Ano'] === filterAno;
            }

            if (filterCategoria && filterCategoria !== 'Todos') {
                matchesCategoria = item['Categoria'] === filterCategoria;
            }

            if (filterUnidade && filterUnidade !== 'Todos') {
                matchesUnidade = item['Unidade'] === filterUnidade;
            }

            return matchesTipo && matchesAno && matchesCategoria && matchesUnidade;
        });

        renderData(filteredData);
    });
});