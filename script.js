document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os elementos HTML que serão manipulados
    const searchButton = document.getElementById('search-button');
    const clearFiltersButton = document.getElementById('clear-filters-button');
    const dataContainer = document.getElementById('data-container');
    const filterTipoSelect = document.getElementById('filter-tipo');
    const filterAnoSelect = document.getElementById('filter-ano');
    const filterCategoriaSelect = document.getElementById('filter-categoria');
    const filterUnidadeSelect = document.getElementById('filter-unidade');
    const keywordSearchInput = document.getElementById('keyword-search');
    const backToTopButton = document.getElementById('back-to-top-button');
    const clearKeywordButton = document.getElementById('clear-keyword-button');

    // --- INICIALIZAÇÃO DA ROLAGEM SUAVE (LENIS) ---
    const lenis = new Lenis({
    lerp: 0.1, // Controla a "suavidade". Valores menores são mais suaves.
    smoothWheel: true,
    });

    function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    // --- FIM DA INICIALIZAÇÃO ---
    
    
    // URL do Apps Script que fornece os dados da planilha
    const spreadsheetUrl = 'https://script.google.com/macros/s/AKfycby0sVSzIscuQ0MS4claDFAsCT1xp1sEUIlxC2vV8VMC-OvD4v8fvj9Vzs4vlHSR_cE/exec';
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


    // Variáveis para controle de ordenação por ano dos resultados
    const sortOrderSelect = document.getElementById('sort-order-select');
    let currentSortState = 'desc'; // Padrão de ordenação inicial (decrescente)

    // Função para carregar e exibir os dados padrão
    function loadAndDisplayDefaultData() {
        if (allData && allData.length > 0) {
            data = [...allData];
            data.sort((a, b) => {
                const codA = parseInt(a['Cod'], 10);
                const codB = parseInt(b['Cod'], 10);
                if (isNaN(codA) && isNaN(anoB)) return 0;
                if (isNaN(codA)) return 1;
                if (isNaN(codB)) return -1;
                return codB - codA;
            });
            currentSortState = 'desc'; // Mantém o estado lógico como 'desc' para a ordenação dos dados
            // O dropdown será explicitamente setado para 'placeholder' no clearFiltersButton
            page = 1;
            renderPage(data, page); // renderPage chamará updateSortDropdownState, que o colocaria em 'desc'
        } else {
            if(dataContainer) dataContainer.textContent = 'Nenhum prêmio, reconhecimento ou destaque encontrado.';
            if (typeof updateAllPaginationControls === "function") {
                 updateAllPaginationControls(1, 0, itemsPerPage);
            }
            if (sortOrderSelect) sortOrderSelect.value = 'placeholder';
        }
    }

    // Função para atualizar o estado do dropdown de ordenação por ano
    function updateSortDropdownState() {
        if (sortOrderSelect) {
            if (currentSortState === 'asc' || currentSortState === 'desc') {
                sortOrderSelect.value = currentSortState; // Atualiza o valor do dropdown
            } else {
                sortOrderSelect.value = 'placeholder'; // Define como placeholder se o estado não for reconhecido (asc ou desc)
            }
        }
    }

    
    // Faz a requisição para obter os dados da planilha
    fetch(spreadsheetUrl)
        .then(response => response.json()) // Converte a resposta para JSON
        .then(fetchedData => {
            allData = fetchedData; // Armazena os dados
            populateFilters(allData); // Preenche os filtros com os dados
            applyFiltersFromUrl(); // Aplica os filtros da URL, se existirem
    })
    .catch(error => { // Captura erros na requisição
        console.error('Erro ao buscar os dados:', error);
        dataContainer.textContent = 'Erro ao carregar os dados.';
    });
    
    // Função para exibir os dados na página
    function renderData(dataToRender) {
        if (!dataContainer) return; // Verifica se o container de dados existe
        dataContainer.innerHTML = ''; // Limpa o container de dados
    
        if (!dataToRender || dataToRender.length === 0) { // Se não houver resultados para renderizar
            const noResultsMessage = document.createElement('p');
            noResultsMessage.textContent = 'Não existem resultados para os filtros selecionados.';
            dataContainer.appendChild(noResultsMessage);
        } else { // Se houver resultados
        dataToRender.forEach(item => { // Itera por cada item (linha da planilha)
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item'); // Adiciona a classe 'item' para estilização
        
            const nome = document.createElement('h2');
            nome.textContent = item['Nome do Prêmio']; // Exibe o nome
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
            
            // Construção do HTML de detalhes sem os campos vazios
            let detailsHTML = ''; // Adiciona os detalhes
            if (item['Ano']) {
                detailsHTML += `<p>Ano: ${item['Ano']}</p>`;
            }
            if (item['Tipo']) {
                detailsHTML += `<p>Tipo: ${item['Tipo']}</p>`;
            }
            if (item['Categoria']) {
                detailsHTML += `<p>Categoria: ${item['Categoria']}</p>`;
            }
            if (item['Unidade']) {
                detailsHTML += `<p>Unidade: ${item['Unidade']}</p>`;
            }

            // Condicional para ocultar o link da matéria se estiver vazio
            const linkMateria = item['Link da Matéria']; // Usando o nome da sua variável original
            if (linkMateria && typeof linkMateria === 'string' && linkMateria.trim() !== "") {
                // Divide a string de links pela vírgula, remove espaços extras de cada link, e filtra quaisquer strings vazias que possam surgir (ex: "link1,,link2")
                const link = linkMateria.trim();

                try {
                    new URL(link); // Valida a URL

                    detailsHTML += `
                        <div class="link-materia-container">
                            <div class="link-buttons-wrapper">
                                <a href="${link}" target="_blank" rel="noopener noreferrer" class="link-materia-button">Ver Matéria</a>
                            </div>
                        </div>`;                  
                } catch (_) {
                    // Se a URL for inválida, exibe um aviso no console
                    console.warn(`Link da Matéria inválido para: ${link}`);
                }
            }
            
            itemDetails.innerHTML = detailsHTML; // Adiciona os detalhes ao elemento p/ renderização
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

    // Função para atualizar todos os controles de paginação
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

        // Exibe ou esconde o botão de ordenação por ano
        const sortOrderSelect = document.getElementById('sort-order-select');
        if (sortOrderSelect) {
            if (totalItems > 0) {
                sortOrderSelect.style.display = 'block'; // Exibe o dropdown de ordenação
            } else {
                sortOrderSelect.style.display = 'none'; // Esconde o dropdown de ordenação
            }
        }
        if(searchButton) searchButton.dataset.clickedClear = 'false'; // Reseta o estado do botão de busca
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
        updateSortDropdownState();  // Atualiza a função do dropdown de ordenação por ano após renderizar
        lenis.scrollTo(0, { duration: 2 });
    }

    // Event listener para o dropdown de ordenação por ano
    sortOrderSelect.addEventListener('change', function() {
        if (!data || data.length === 0) {
            this.value = 'placeholder'; // Reseta o valor do dropdown se não houver dados
            return;
        }

        const sortValue = this.value;
        // Condicional para valor crescente
        if (sortValue === 'asc') {
            data.sort((a, b) => {
                const codA = parseInt(a['Cod'], 10);
                const codB = parseInt(b['Cod'], 10);
                if (isNaN(codA) && isNaN(codB)) return 0;
                if (isNaN(codA)) return 1;
                if (isNaN(codB)) return -1;
                return codA - codB; // Crescente
            });
            currentSortState = 'asc';
        } else if (sortValue === 'desc') { // Condicional para valor decrescente
            data.sort((a, b) => {
                const codA = parseInt(a['Cod'], 10);
                const codB = parseInt(b['Cod'], 10);
                if (isNaN(codA) && isNaN(codB)) return 0;
                if (isNaN(codA)) return 1;
                if (isNaN(codB)) return -1;
                return codB - codA; // Decrescente
            });
            currentSortState = 'desc';
        } else { // Caso selecione o placeholder
            return;
        }
        page = 1;
        renderPage(data, page);
    });


    // Função para voltar ao topo da página
    function scrollToTop() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add("show");  
        } else {
            backToTopButton.classList.remove("show");
        }
    }

    // Event listener para o botão de busca
    function applyFilters() {
        // Esta parte está correta: a opacidade é aplicada imediatamente.
        dataContainer.classList.add('loading-results');

        // A lógica de filtragem é agendada.
        setTimeout(() => {
            // ---> INÍCIO DA CORREÇÃO CRÍTICA <---
            // As linhas abaixo PRECISAM estar DENTRO do setTimeout para que os valores
            // sejam lidos no momento exato em que a filtragem vai acontecer.
            const tipo = filterTipoSelect.value === 'Todos' ? '' : filterTipoSelect.value;
            const ano = filterAnoSelect.value === 'Todos' ? '' : filterAnoSelect.value;
            const categoria = filterCategoriaSelect.value === 'Todos' ? '' : filterCategoriaSelect.value;
            const unidade = filterUnidadeSelect.value === 'Todos' ? '' : filterUnidadeSelect.value;
            const keyword = keywordSearchInput ? keywordSearchInput.value.trim().toLowerCase() : '';
            // ---> FIM DA CORREÇÃO CRÍTICA <---

            // Agora, a lógica de filtragem pode usar as variáveis acima, pois elas existem neste escopo.
            const filteredData = allData.filter(item => {
                const tipoMatch = tipo === '' || (item['Tipo'] && item['Tipo'] === tipo);
                const anoMatch = ano === '' || (item['Ano'] && String(item['Ano']) === String(ano));
                const categoriaMatch = categoria === '' || (item['Categoria'] && item['Categoria'] === categoria);
                const unidadeMatch = unidade === '' || (item['Unidade'] && item['Unidade'] === unidade);
                let keywordMatch = true;
                if (keyword !== "") {
                    const searchableText = `${(item['Nome do Prêmio'] || '').toLowerCase()} ${(item['Descrição'] || '').toLowerCase()}`;
                    keywordMatch = searchableText.includes(keyword);
                }
                return tipoMatch && anoMatch && categoriaMatch && unidadeMatch && keywordMatch;
            });

            if (filteredData.length > 0) {
                filteredData.sort((a, b) => {
                // Usando 'Cod' para corresponder à sua estrutura de dados
                const codeA = parseInt(a['Cod'], 10);
                const codeB = parseInt(b['Cod'], 10);
                
                // Tratamento para valores que não são números
                if (isNaN(codeA) && isNaN(codeB)) return 0;
                if (isNaN(codeA)) return 1;
                if (isNaN(codeB)) return -1;
                
                // Retorna b - a para ordem decrescente (mais novo para mais velho)
                return codeB - codeA; 
                });
            }

            data = filteredData;
            page = 1;
            updateUrlWithFilters();
            renderPage(data, page);

            // Esta linha agora será alcançada, e a opacidade será removida.
            dataContainer.classList.remove('loading-results');

            lenis.scrollTo('#data-container', { duration: 1.5, offset: -20 });

        }, 500); // Fim do setTimeout
    }

    searchButton.addEventListener('click', applyFilters);

    clearFiltersButton.addEventListener('click', () => {
        dataContainer.classList.add('loading-results');

            setTimeout(() => {
                filterTipoSelect.value = '';
                filterAnoSelect.value = '';
                filterCategoriaSelect.value = '';
                filterUnidadeSelect.value = '';
                keywordSearchInput.value = '';

                // Esconde o botão 'X' da barra de busca, se estiver visível
                if (clearKeywordButton) {
                    clearKeywordButton.style.display = 'none';
                }

                // Carrega e exibe a lista de dados padrão (sem filtros)
                loadAndDisplayDefaultData();

                window.history.pushState({}, '', window.location.pathname);

                dataContainer.classList.remove('loading-results');

                lenis.scrollTo(0, { duration: 1.5, offset: -20 });
            }, 500);
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

    
    // Evento de clique para voltar ao topo
    window.addEventListener('scroll', scrollToTop);
    backToTopButton.addEventListener('click',() => {
        lenis.scrollTo(0, { duration: 2 }); // Rola suavemente para o topo da página
    });

    // Event listener para o botão de limpar pesquisa por palavra-chave
    if (clearKeywordButton && keywordSearchInput) {
        clearKeywordButton.addEventListener('click', function() {
            keywordSearchInput.value = ''; // Limpa o campo de pesquisa por palavra-chave
            keywordSearchInput.focus(); // Opcional: Foca no campo de pesquisa
            clearKeywordButton.style.display = 'none'; // Esconde o botão 'X'
        });

        keywordSearchInput.addEventListener('input', function() {
            if (keywordSearchInput.value.trim() !== '') {
                clearKeywordButton.style.display = 'inline'; // Mostra o 'X'
            } else {
                clearKeywordButton.style.display = 'none'; // Esconde o 'X'
            }
        });
    }

    // Event listener para o campo de pesquisa por palavra-chave ao pressionar 'Enter'
    keywordSearchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') { // Verifica se a tecla pressionada é 'Enter'
            event.preventDefault(); // Previne o comportamento padrão do Enter
            searchButton.click(); // Simula um clique no botão de busca
        }
    });

    // Função para carregar filtros na URL
    function updateUrlWithFilters() {
        const params = new URLSearchParams();

        if (filterTipoSelect.value) params.set('tipo', filterTipoSelect.value);
        if (filterAnoSelect.value) params.set('ano', filterAnoSelect.value); // Corrigido o nome da variável
        if (filterCategoriaSelect.value) params.set('categoria', filterCategoriaSelect.value);
        if (filterUnidadeSelect.value) params.set('unidade', filterUnidadeSelect.value);
        if (keywordSearchInput.value) params.set('keyword', keywordSearchInput.value);

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({path: newUrl }, '', newUrl);
    }

    function applyFiltersFromUrl() {
        const params = new URLSearchParams(window.location.search);

        // Sem valores iniciais, carrega os dados padrão
        if (params.toString() === '') {
            loadAndDisplayDefaultData();
            return;
        }

        const tipo = params.get('tipo') || '';
        const ano = params.get('ano') || '';
        const categoria = params.get('categoria') || '';
        const unidade = params.get('unidade') || '';
        const keyword = params.get('keyword') || '';

        filterTipoSelect.value = tipo
        filterAnoSelect.value = ano;
        filterCategoriaSelect.value = categoria;
        filterUnidadeSelect.value = unidade;

        // Se o campo de pesquisa por palavra-chave existir na busca, insere o seu valor no input
        if (keywordSearchInput) {
            keywordSearchInput.value = keyword; 
            
            // Se o campo de pesquisa por palavra-chave tiver um valor, exibe o botão 'X' para limpar a pesquisa
            if (keyword && clearKeywordButton) {
                clearKeywordButton.style.display = 'inline'; 
            }
            
        }

        applyFilters(); // Aplica os filtros com os valores obtidos da URL
    }
    
    });