document.addEventListener('DOMContentLoaded', function() {
    const dataContainer = document.getElementById('data-container');
    const spreadsheetUrl = 'https://script.google.com/macros/s/AKfycbzarCfobIMbbgnuVz7Fa4cuutetQ2t78hBVvZJU1GzSNwLfwTZzKbMKG4RULdhPjA/exec'; // URL do Google Sheets em formato JSON transformado pelo Apps Script

    fetch(spreadsheetUrl)
        .then(response => response.json())
        .then(data => {
            // 'data' agora é um array de objetos Javascript, onde cada objeto representa uma linha da sua planilha
            data.feed.entry.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item');

                // Itere pelas propriedades de cada item (correspondentes aos cabeçalhos das colunas)
                for (const key in item) {
                    if (key.startsWith('gsx$')) { // As colunas são prefixadas com 'gsx$'
                        const columnName = key.substring(4); // Remove o 'gsx$' para obter o nome do cabeçalho
                        const columnValue = item[key].$t; // '$t' contém o valor da célula

                        const infoParagraph = document.createElement('p');
                        infoParagraph.textContent = `${columnName}: ${columnValue}`;
                        itemDiv.appendChild(infoParagraph);
                    }
                }
                dataContainer.appendChild(itemDiv);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar os dados:', error);
            dataContainer.textContent = 'Erro ao carregar os dados.';
        });
});