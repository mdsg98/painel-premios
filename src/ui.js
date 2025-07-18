// src/ui.js

// --- FUNÇÃO PARA RENDERIZAR OS DADOS NA TELA ---
export function renderData(
    dataToRender,
    dataContainer,
    filterElements,
    applyFiltersCallback
) {
    if (!dataContainer) return;
    dataContainer.innerHTML = '';

    if (!dataToRender || dataToRender.length === 0) {
        const noResultsMessage = document.createElement('p');
        noResultsMessage.classList.add('no-results-message');
        noResultsMessage.textContent =
            'Não existem resultados para os filtros selecionados.';
        dataContainer.appendChild(noResultsMessage);
    } else {
        dataToRender.forEach((item) => {
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
            if (
                linkMateria &&
                typeof linkMateria === 'string' &&
                linkMateria.trim() !== ''
            ) {
                const link = linkMateria.trim();
                // Verifica se o link é válido antes de criar o botão
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

            const createTag = (text, typeClass) => {
                if (text) {
                    const tag = document.createElement('span');
                    tag.classList.add('tag', typeClass);
                    tag.textContent = text;
                    tag.addEventListener('click', () => {
                        switch (typeClass) {
                            case 'tag-ano':
                                filterElements.ano.value = text;
                                break;
                            case 'tag-tipo':
                                filterElements.tipo.value = text;
                                break;
                            case 'tag-categoria':
                                filterElements.categoria.value = text;
                                break;
                            case 'tag-unidade':
                                filterElements.unidade.value = text;
                                break;
                        }
                        // AGORA USA A FUNÇÃO RECEBIDA COMO PARÂMETRO
                        applyFiltersCallback();
                    });
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

// --- FUNÇÃO PARA POPULAR SELECTS COM VALORES ÚNICOS ---
export function populateSelect(selectElement, header, dataToPopulate) {
    const uniqueValues = [
        ...new Set(dataToPopulate.map((item) => item[header]).filter(Boolean)),
    ].sort();
    selectElement.innerHTML = '<option value="">Todos</option>';
    uniqueValues.forEach((value) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        selectElement.appendChild(option);
    });
}

// --- FUNÇÃO PARA POPULAR SELECTS A PARTIR DE UMA LISTA (FILTROS) ---
export function populateSelectFromList(selectElement, optionsList) {
    selectElement.innerHTML = '<option value="">Todos</option>';
    optionsList.forEach((value) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        selectElement.appendChild(option);
    });
}

// --- FUNÇÃO PARA POPULAR SELECT DE ANO EM ORDEM DECRESCENTE ---
export function populateSelectAnoDescending(selectElement, header, data) {
    const uniqueValues = [
        ...new Set(data.map((item) => item[header]).filter(Boolean)),
    ].sort((a, b) => b - a);
    selectElement.innerHTML = '<option value="">Todos</option>';
    uniqueValues.forEach((value) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        selectElement.appendChild(option);
    });
}

// --- FUNÇÃO PARA ATUALIZAR CONTROLES DE PAGINAÇÃO ---
export function updateAllPaginationControls(
    pageNum,
    totalItems,
    itemsPerPageNum,
    paginationElements
) {
    const totalPages = Math.ceil(totalItems / itemsPerPageNum) || 1;
    const showPagination = totalItems > itemsPerPageNum;
    const displayStyle = showPagination ? 'flex' : 'none';

    [paginationElements.container, paginationElements.containerTop].forEach(
        (container) => {
            if (container) container.style.display = displayStyle;
        }
    );

    if (paginationElements.info)
        paginationElements.info.textContent = `Página ${pageNum} de ${totalPages}`;
    if (paginationElements.infoTop)
        paginationElements.infoTop.textContent = `Página ${pageNum} de ${totalPages}`;

    [paginationElements.prev, paginationElements.prevTop].forEach((btn) => {
        if (btn) btn.disabled = pageNum === 1;
    });
    [paginationElements.next, paginationElements.nextTop].forEach((btn) => {
        if (btn) btn.disabled = pageNum === totalPages;
    });
}

// --- FUNÇÃO PARA ATUALIZAR O ESTADO DO SELECT DE ORDENAMENTO ---
export function updateSortDropdownState(sortSelectElement, currentSortValue) {
    if (sortSelectElement) {
        sortSelectElement.value = currentSortValue;
    }
}

// --- FUNÇÃO PARA TOGGLE DO BOTÃO DE VOLTAR AO TOPO ---
export function toggleBackToTopButton(button) {
    if (window.scrollY > 300) {
        button.classList.add('show');
    } else {
        button.classList.remove('show');
    }
}
