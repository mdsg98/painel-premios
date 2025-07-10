import '../style.css'
import Lenis from '@studio-freight/lenis';
import { fetchSpreadsheetData } from './api.js';
import { 
    renderData, 
    populateSelect, 
    populateSelectAnoDescending,
    updateAllPaginationControls,
    toggleBackToTopButton,
    updateSortDropdownState
} from './ui.js';

// -- SELECIONANDO ELEMENTOS DO HTML (DOM) QUE SERÃO MANIPULADOS --
const dom = {
    searchButton: document.getElementById('search-button'),
    clearFiltersButton: document.getElementById('clear-filters-button'),
    dataContainer: document.getElementById('data-container'),
    keywordSearchInput: document.getElementById('keyword-search'),
    backToTopButton: document.getElementById('back-to-top-button'),
    clearKeywordButton: document.getElementById('clear-keyword-button'),
    loadingSpinner: document.getElementById('loading-spinner'),
    sortOrderSelect: document.getElementById('sort-order-select'),
    filters: {
        tipo: document.getElementById('filter-tipo'),
        ano: document.getElementById('filter-ano'),
        categoria: document.getElementById('filter-categoria'),
        unidade: document.getElementById('filter-unidade'),
    },
    pagination: {
        container: document.getElementById('pagination-container'),
        prev: document.getElementById('prev-page-button'),
        next: document.getElementById('next-page-button'),
        info: document.getElementById('page-info'),
        containerTop: document.getElementById('pagination-container-top'),
        prevTop: document.getElementById('prev-page-button-top'),
        nextTop: document.getElementById('next-page-button-top'),
        infoTop: document.getElementById('page-info-top'),
    }
};

// -- DESESTRUTURANDO OS ELEMENTOS DO DOM PARA FICAR MAIS LEGÍVEL / ESTADO DA APLICAÇÃO --
const state = {
  allData: [],
  filteredData: [],
  currentPage: 1,
  itemsPerPage: 10,
  currentSort: 'desc',
};

// --- INICIALIZAÇÃO DA ROLAGEM SUAVE (LENIS) ---
const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

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

// --- FUNÇÕES PRINCIPAIS ---

// --- CARREGAMENTO DE PÁGINA ---
function renderCurrentPage(dataToRender, pageNum) { 
    const start = (state.currentPage - 1) * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    const pageData = state.filteredData.slice(start, end);

    const filterElements = {tipo: dom.filters.tipo, ano: dom.filters.ano, categoria: dom.filters.categoria, unidade: dom.filters.unidade };
    renderData(pageData, dom.dataContainer, filterElements, applyFilters);
    updateAllPaginationControls(state.currentPage, state.filteredData.length, state.itemsPerPage, dom.pagination);
    updateSortDropdownState();
}

// --- FUNÇÃO PARA ATUALIZAR A URL COM OS FILTROS SELECIONADOS ---
function updateUrlWithFilters() {
    const params = new URLSearchParams();
    
    if (dom.filters.tipo.value) params.set('tipo', dom.filters.tipo.value);
    if (dom.filters.ano.value) params.set('ano', dom.filters.ano.value);
    if (dom.filters.categoria.value) params.set('categoria', dom.filters.categoria.value);
    if (dom.filters.unidade.value) params.set('unidade', dom.filters.unidade.value);
    if (dom.keywordSearchInput.value) params.set('keyword', dom.keywordSearchInput.value);

    const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
    window.history.pushState({ path: newUrl }, '', newUrl);
}

// --- FUNÇÃO PARA APLICAR FILTROS A PARTIR DA URL (CARREGAMENTO INICIAL) ---
function applyFiltersFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (params.toString() === '') {
        // Se não há parâmetros, apenas aplica os filtros padrão (mostra tudo)
        applyFilters();
        return;
    }

    dom.filters.tipo.value = params.get('tipo') || '';
    dom.filters.ano.value = params.get('ano') || '';
    dom.filters.categoria.value = params.get('categoria') || '';
    dom.filters.unidade.value = params.get('unidade') || '';
    dom.keywordSearchInput.value = params.get('keyword') || '';
    
    applyFilters();
}

// APLICAÇÃO DE FILTROS AOS RESULTADOS
function applyFilters() {
    dom.dataContainer.classList.add('loading-results');
    setTimeout(() => {
        const tipo = dom.filters.tipo.value;
        const ano = dom.filters.ano.value;
        const categoria = dom.filters.categoria.value;
        const unidade = dom.filters.unidade.value;
        const keyword = dom.keywordSearchInput.value.trim().toLowerCase();

        state.filteredData = state.allData.filter(item => {
            const tipoMatch = !tipo || (item['Tipo'] === tipo);
            const anoMatch = !ano || (String(item['Ano']) === String(ano));
            const categoriaMatch = !categoria || (item['Categoria'] === categoria);
            const unidadeMatch = !unidade || (item['Unidade'] === unidade);
            const keywordMatch = !keyword || `${(item['Nome do Prêmio'] || '').toLowerCase()} ${(item['Descrição'] || '').toLowerCase()}`.includes(keyword);
            return tipoMatch && anoMatch && categoriaMatch && unidadeMatch && keywordMatch;
        });

        sortData(state.filteredData, state.currentSort);
        state.currentPage = 1;
        updateUrlWithFilters();
        renderCurrentPage();
        dom.dataContainer.classList.remove('loading-results');
        lenis.scrollTo('#data-container', { duration: 1.5, offset: -20 });
    }, 500);
}

// --- FUNÇÃO PARA CONFIGURAR LISTENERS DE EVENTOS ---
function setupEventListeners() {
    dom.searchButton.addEventListener('click', applyFilters);

    // --- BOTÃO DE LIMPAR FILTROS ---
     dom.clearFiltersButton.addEventListener('click', () => {
        dom.dataContainer.classList.add('loading-results');
        
        setTimeout(() => {
            dom.filters.tipo.value = '';
            dom.filters.ano.value = '';
            dom.filters.categoria.value = '';
            dom.filters.unidade.value = '';
            dom.keywordSearchInput.value = '';
            dom.sortOrderSelect.value = 'desc';
            if (dom.clearKeywordButton) dom.clearKeywordButton.style.display = 'none';

            state.filteredData = [...state.allData];
            state.currentSort = 'desc';
            state.currentPage = 1;
            
            sortData(state.filteredData, state.currentSort);
            renderCurrentPage();

            window.history.pushState({}, '', window.location.pathname);
            dom.dataContainer.classList.remove('loading-results');
            lenis.scrollTo('#data-container', { duration: 1.5, offset: -20 });
        }, 500);
    });

    Object.values(dom.filters).forEach(select => select.addEventListener('change', applyFilters));
    
    dom.sortOrderSelect.addEventListener('change', (e) => {
        state.currentSort = e.target.value;
        sortData(state.filteredData, state.currentSort);
        state.currentPage = 1;
        renderCurrentPage();
    });

    [dom.pagination.next, dom.pagination.nextTop].forEach(btn => btn.addEventListener('click', () => {
        const totalPages = Math.ceil(state.filteredData.length / state.itemsPerPage);
        if (state.currentPage < totalPages) {
            state.currentPage++;
            renderCurrentPage();
            lenis.scrollTo('#data-container', { duration: 1.5, offset: -20 });
        }
    }));

    [dom.pagination.prev, dom.pagination.prevTop].forEach(btn => btn.addEventListener('click', () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            renderCurrentPage();
            lenis.scrollTo('#data-container', { duration: 1.5, offset: -20 });
        }
    }));
    
    window.addEventListener('scroll', () => toggleBackToTopButton(dom.backToTopButton));
    dom.backToTopButton.addEventListener('click', () => lenis.scrollTo(0, { duration: 2 }));
}

// --- FUNÇÃO PARA BUSCAR DADOS DA PLANILHA ---
async function main() {
    dom.loadingSpinner.style.display = 'block';
    setupEventListeners();
    try {
        state.allData = await fetchSpreadsheetData();
        populateSelect(dom.filters.tipo, 'Tipo', state.allData);
        populateSelectAnoDescending(dom.filters.ano, 'Ano', state.allData);
        populateSelect(dom.filters.categoria, 'Categoria', state.allData);
        populateSelect(dom.filters.unidade, 'Unidade', state.allData);
        applyFiltersFromUrl();
    } catch (error) {
        console.error("Falha ao inicializar a aplicação:", error);
        dom.dataContainer.textContent = 'Erro ao carregar os dados. Tente novamente mais tarde.';
    } finally {
        dom.loadingSpinner.style.display = 'none';
    }
}

// --- INICIALIZAÇÃO DA APLICAÇÃO ---
main();

