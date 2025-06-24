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
    const loadingSpinner = document.getElementById('loading-spinner');

    // --- INICIALIZAÇÃO DA ROLAGEM SUAVE (LENIS) ---
    const lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    // --- FIM DA INICIALIZAÇÃO ---
    
    const spreadsheetUrl = 'https://script.google.com/macros/s/AKfycby0sVSzIscuQ0MS4claDFAsCT1xp1sEUIlxC2vV8VMC-OvD4v8fvj9Vzs4vlHSR_cE/exec';
    let allData = [];
    let data = [];
    let page = 1;
    const itemsPerPage = 10;
    let currentSortState = 'desc';

    const paginationContainer = document.getElementById('pagination-container');
    const prevPageButton = document.getElementById('prev-page-button');
    const nextPageButton = document.getElementById('next-page-button');
    const pageInfo = document.getElementById('page-info');

    const paginationContainerTop = document.getElementById('pagination-container-top');
    const prevPageButtonTop = document.getElementById('prev-page-button-top');
    const nextPageButtonTop = document.getElementById('next-page-button-top');
    const pageInfoTop = document.getElementById('page-info-top');

    const sortOrderSelect = document.getElementById('sort-order-select');

    // --- FUNÇÃO DE ORDENAÇÃO MULTI-NÍVEL ---
    function sortData(arrayToSort, primaryDirection = 'desc') {
        if (!arrayToSort || arrayToSort.length === 0) return;
        arrayToSort.sort((a, b) => {
            const anoA = parseInt(a['Ano'], 10) || 0;
            const anoB = parseInt(b['Ano'], 10) || 0;
            if (anoA !== anoB) {
                return primaryDirection === 'asc' ? anoA - anoB : anoB - anoA;
            }
            const codeA = parseInt(a['Cod'], 10) || 0;
            const codeB = parseInt(b['Cod'], 10) || 0;
            return codeB - codeA;
        });
    }

    // --- LÓGICA DE CARREGAMENTO INICIAL ---
    if(loadingSpinner) loadingSpinner.style.display = 'block';

    fetch(spreadsheetUrl)
        .then(response => response.json())
        .then(fetchedData => {
            if(loadingSpinner) loadingSpinner.style.display = 'none';
            allData = fetchedData;
            populateFilters(allData);
            applyFiltersFromUrl();
        })
        .catch(error => {
            if(loadingSpinner) loadingSpinner.style.display = 'none';
            console.error('Erro ao buscar os dados:', error);
            if(dataContainer) dataContainer.textContent = 'Erro ao carregar os dados.';
        });

    // --- FUNÇÕES PRINCIPAIS ---

    function renderData(dataToRender) {
        if (!dataContainer) return;
        dataContainer.innerHTML = '';

        if (!dataToRender || dataToRender.length === 0) {
            const noResultsMessage = document.createElement('p');
            noResultsMessage.classList.add('no-results-message');
            noResultsMessage.textContent = 'Não existem resultados para os filtros selecionados.';
            dataContainer.appendChild(noResultsMessage);
        } else {
            dataToRender.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item');

                const imageColumn = document.createElement('div');
                imageColumn.classList.add('item-image-column');
                const img = document.createElement('img');
                img.src = item['Link da Imagem'] || 'images/placeholder.png';
                img.alt = item['Nome do Prêmio'] || 'Imagem do prêmio';
                img.loading = 'lazy';
                imageColumn.appendChild(img);

                const contentColumn = document.createElement('div');
                contentColumn.classList.add('item-content-column');

                const mainContent = document.createElement('div');
                mainContent.classList.add('item-main-content');
                
                const title = document.createElement('h2');
                title.classList.add('item-title');
                title.textContent = item['Nome do Prêmio'];
                mainContent.appendChild(title);
                
                const description = document.createElement('p');
                description.classList.add('item-description');
                description.textContent = item['Descrição'];
                mainContent.appendChild(description);

                const linkMateria = item['Link da Matéria'];
                if (linkMateria && typeof linkMateria === 'string' && linkMateria.trim() !== "") {
                    const link = linkMateria.trim();
                    try {
                        new URL(link);
                        const linkButton = document.createElement('a');
                        linkButton.href = link;
                        linkButton.target = '_blank';
                        linkButton.rel = 'noopener noreferrer';
                        linkButton.classList.add('link-materia-button');
                        linkButton.textContent = 'Ler Matéria';
                        mainContent.appendChild(linkButton);
                    } catch (_) {
                        console.warn(`Link da Matéria inválido ignorado: ${link}`);
                    }
                }
                
                const tagsWrapper = document.createElement('div');
                tagsWrapper.classList.add('item-tags');

                // Função auxiliar para criar as tags
                const createTag = (text, typeClass) => {
                    if (text) {
                        const tag = document.createElement('span');
                        tag.classList.add('tag', typeClass);
                        tag.textContent = text;

                        // --- INÍCIO DA FUNCIONALIDADE DE CLIQUE ---
                        tag.addEventListener('click', () => {
                            // Determina qual filtro deve ser atualizado com base na classe da tag
                            switch (typeClass) {
                                case 'tag-ano':
                                    filterAnoSelect.value = text;
                                    break;
                                case 'tag-tipo':
                                    filterTipoSelect.value = text;
                                    break;
                                case 'tag-categoria':
                                    filterCategoriaSelect.value = text;
                                    break;
                                case 'tag-unidade':
                                    filterUnidadeSelect.value = text;
                                    break;
                            }
                            
                            // Chama a função principal para aplicar o filtro selecionado
                            applyFilters();
                        });
                        // --- FIM DA FUNCIONALIDADE DE CLIQUE ---

                        tagsWrapper.appendChild(tag);
                    }
                };

                createTag(item['Ano'], 'tag-ano');
                createTag(item['Tipo'], 'tag-tipo');
                createTag(item['Categoria'], 'tag-categoria');
                createTag(item['Unidade'], 'tag-unidade');

                contentColumn.appendChild(mainContent);
                contentColumn.appendChild(tagsWrapper);
                itemDiv.appendChild(imageColumn);
                itemDiv.appendChild(contentColumn);
                dataContainer.appendChild(itemDiv);
            });
        }
    }

    function renderPage(dataToRender, pageNum) { 
        const start = (pageNum - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageData = dataToRender.slice(start, end);
        renderData(pageData);
        updateAllPaginationControls(pageNum, dataToRender.length, itemsPerPage);
        updateSortDropdownState();
    }

    function applyFilters() {
        dataContainer.classList.add('loading-results');
        setTimeout(() => {
            const tipo = filterTipoSelect.value === 'Todos' ? '' : filterTipoSelect.value;
            const ano = filterAnoSelect.value === 'Todos' ? '' : filterAnoSelect.value;
            const categoria = filterCategoriaSelect.value === 'Todos' ? '' : filterCategoriaSelect.value;
            const unidade = filterUnidadeSelect.value === 'Todos' ? '' : filterUnidadeSelect.value;
            const keyword = keywordSearchInput ? keywordSearchInput.value.trim().toLowerCase() : '';

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

            currentSortState = 'desc';
            sortOrderSelect.value = 'desc';
            sortData(filteredData, 'desc');

            data = filteredData;
            page = 1;
            updateUrlWithFilters();
            renderPage(data, page);
            dataContainer.classList.remove('loading-results');
            lenis.scrollTo('#data-container', { duration: 1.5, offset: -20 });
        }, 500);
    }
    
    function loadAndDisplayDefaultData() {
        if (allData && allData.length > 0) {
            data = [...allData];
            sortData(data, 'desc');
            currentSortState = 'desc';
            page = 1;
            renderPage(data, page);
        } else {
            if(dataContainer) dataContainer.textContent = 'Nenhum prêmio, reconhecimento ou destaque encontrado.';
            if (typeof updateAllPaginationControls === "function") {
                 updateAllPaginationControls(1, 0, itemsPerPage);
            }
        }
    }

    // --- FUNÇÕES AUXILIARES ---

    function populateFilters(dataToPopulate) {
        if (dataToPopulate.length > 0) {
            populateSelect(filterTipoSelect, 'Tipo', dataToPopulate);
            populateSelectAnoDescending(filterAnoSelect, 'Ano', dataToPopulate);
            populateSelect(filterCategoriaSelect, 'Categoria', dataToPopulate);
            populateSelect(filterUnidadeSelect, 'Unidade', dataToPopulate);
        }
    }

    function populateSelect(selectElement, header, dataToPopulate) {
        const uniqueValues = [...new Set(dataToPopulate.map(item => item[header]).filter(Boolean))].sort();
        selectElement.innerHTML = '<option value="">Todos</option>';
        uniqueValues.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            selectElement.appendChild(option);
        });
    }

    function populateSelectAnoDescending(selectElement, header, data) {
        const uniqueValues = [...new Set(data.map(item => item[header]).filter(Boolean))].sort((a, b) => b - a);
        selectElement.innerHTML = '<option value="">Todos</option>';
        uniqueValues.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            selectElement.appendChild(option);
        });
    }

    function updateAllPaginationControls(pageNum, totalItems, itemsPerPageNum) {
        const totalPages = Math.ceil(totalItems / itemsPerPageNum) || 1;
        const showPagination = totalItems > itemsPerPageNum;

        const displayStyle = showPagination ? 'flex' : 'none';

        [paginationContainer, paginationContainerTop].forEach(container => {
            if (container) container.style.display = displayStyle;
        });
        
        if(pageInfo) pageInfo.textContent = `Página ${pageNum} de ${totalPages}`;
        if(pageInfoTop) pageInfoTop.textContent = `Página ${pageNum} de ${totalPages}`;
        
        [prevPageButton, prevPageButtonTop].forEach(btn => {
            if (btn) btn.disabled = pageNum === 1;
        });
        [nextPageButton, nextPageButtonTop].forEach(btn => {
            if (btn) btn.disabled = pageNum === totalPages;
        });
    }

    function updateSortDropdownState() {
        if (sortOrderSelect) {
            sortOrderSelect.value = currentSortState;
        }
    }
    
    function goToNextPage() {
        const totalPages = Math.ceil(data.length / itemsPerPage);
        if (page < totalPages) {
            page++;
            renderPage(data, page);
            lenis.scrollTo('#data-container', { duration: 1.5, offset: -20 });
        }
    }

    function goToPrevPage() {
        if (page > 1) {
            page--;
            renderPage(data, page);
            lenis.scrollTo('#data-container', { duration: 1.5, offset: -20 });
        }
    }

    function toggleBackToTopButton() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }

    function updateUrlWithFilters() {
        const params = new URLSearchParams();
        if (filterTipoSelect.value) params.set('tipo', filterTipoSelect.value);
        if (filterAnoSelect.value) params.set('ano', filterAnoSelect.value);
        if (filterCategoriaSelect.value) params.set('categoria', filterCategoriaSelect.value);
        if (filterUnidadeSelect.value) params.set('unidade', filterUnidadeSelect.value);
        if (keywordSearchInput.value) params.set('keyword', keywordSearchInput.value);
        const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
        window.history.pushState({ path: newUrl }, '', newUrl);
    }

    function applyFiltersFromUrl() {
        const params = new URLSearchParams(window.location.search);
        if (params.toString() === '') {
            loadAndDisplayDefaultData();
            return;
        }
        filterTipoSelect.value = params.get('tipo') || '';
        filterAnoSelect.value = params.get('ano') || '';
        filterCategoriaSelect.value = params.get('categoria') || '';
        filterUnidadeSelect.value = params.get('unidade') || '';
        if (keywordSearchInput) keywordSearchInput.value = params.get('keyword') || '';
        
        if (keywordSearchInput.value && clearKeywordButton) {
            clearKeywordButton.style.display = 'inline';
        }
        
        applyFilters();
    }

    // --- EVENT LISTENERS ---
    searchButton.addEventListener('click', applyFilters);
    clearFiltersButton.addEventListener('click', () => {
        dataContainer.classList.add('loading-results');
        setTimeout(() => {
            filterTipoSelect.value = '';
            filterAnoSelect.value = '';
            filterCategoriaSelect.value = '';
            filterUnidadeSelect.value = '';
            keywordSearchInput.value = '';
            if (clearKeywordButton) clearKeywordButton.style.display = 'none';
            loadAndDisplayDefaultData();
            window.history.pushState({}, '', window.location.pathname);
            dataContainer.classList.remove('loading-results');
            lenis.scrollTo('#data-container', { duration: 1.5, offset: -20 });
        }, 500);
    });
    
    filterTipoSelect.addEventListener('change', applyFilters);
    filterAnoSelect.addEventListener('change', applyFilters);
    filterCategoriaSelect.addEventListener('change', applyFilters);
    filterUnidadeSelect.addEventListener('change', applyFilters);

    sortOrderSelect.addEventListener('change', function() {
        if (!data || data.length === 0) {
            this.value = 'desc';
            return;
        }
        const sortValue = this.value;
        if (sortValue !== 'asc' && sortValue !== 'desc') return;
        currentSortState = sortValue;
        sortData(data, currentSortState);
        page = 1;
        renderPage(data, page);
    });

    nextPageButton.addEventListener('click', goToNextPage);
    prevPageButton.addEventListener('click', goToPrevPage);
    nextPageButtonTop.addEventListener('click', goToNextPage);
    prevPageButtonTop.addEventListener('click', goToPrevPage);

    window.addEventListener('scroll', toggleBackToTopButton);
    backToTopButton.addEventListener('click', () => {
        lenis.scrollTo(0, { duration: 2 });
    });

    if (clearKeywordButton && keywordSearchInput) {
        clearKeywordButton.addEventListener('click', function() {
            keywordSearchInput.value = '';
            keywordSearchInput.focus();
            clearKeywordButton.style.display = 'none';
        });
        keywordSearchInput.addEventListener('input', function() {
            clearKeywordButton.style.display = this.value.trim() !== '' ? 'inline' : 'none';
        });
    }

    if(keywordSearchInput) {
        keywordSearchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                searchButton.click();
            }
        });
    }
});