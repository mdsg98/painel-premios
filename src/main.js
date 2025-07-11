import '../style.css';
import Lenis from '@studio-freight/lenis';
import { fetchSpreadsheetData } from './api.js';
import {
    renderData,
    populateSelect,
    populateSelectAnoDescending,
    populateSelectFromList,
    updateAllPaginationControls,
    toggleBackToTopButton,
    updateSortDropdownState,
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
    },
};

// -- DESESTRUTURANDO OS ELEMENTOS DO DOM PARA FICAR MAIS LEGÍVEL / ESTADO DA APLICAÇÃO --
const state = {
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

// --- FUNÇÕES PRINCIPAIS ---

// --- CARREGAMENTO DE PÁGINA ---
function renderCurrentPage() {
    const pageData = state.filteredData;

    const filterElements = {
        tipo: dom.filters.tipo,
        ano: dom.filters.ano,
        categoria: dom.filters.categoria,
        unidade: dom.filters.unidade,
    };
    renderData(pageData, dom.dataContainer, filterElements, applyFilters);
    updateAllPaginationControls(
        state.currentPage,
        state.filteredData.length,
        state.itemsPerPage,
        dom.pagination
    );
    updateSortDropdownState();
}

// --- FUNÇÃO PARA ATUALIZAR A URL COM OS FILTROS SELECIONADOS ---
function updateUrlWithFilters() {
    const params = new URLSearchParams();

    if (dom.filters.tipo.value) params.set('tipo', dom.filters.tipo.value);
    if (dom.filters.ano.value) params.set('ano', dom.filters.ano.value);
    if (dom.filters.categoria.value)
        params.set('categoria', dom.filters.categoria.value);
    if (dom.filters.unidade.value)
        params.set('unidade', dom.filters.unidade.value);
    if (dom.keywordSearchInput.value)
        params.set('keyword', dom.keywordSearchInput.value);

    const newUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
    window.history.pushState({ path: newUrl }, '', newUrl);
}

// --- FUNÇÃO PARA APLICAR FILTROS A PARTIR DA URL (CARREGAMENTO INICIAL) ---
function applyFiltersFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page') || '1', 10);

    dom.filters.tipo.value = params.get('tipo') || '';
    dom.filters.ano.value = params.get('ano') || '';
    dom.filters.categoria.value = params.get('categoria') || '';
    dom.filters.unidade.value = params.get('unidade') || '';
    dom.keywordSearchInput.value = params.get('keyword') || '';

    return applyFilters(page);
}

// APLICAÇÃO DE FILTROS AOS RESULTADOS
async function applyFilters(page = 1) {
    dom.dataContainer.classList.add('loading-results');

    state.currentPage = page;

    const params = new URLSearchParams({
        page: state.currentPage,
        sort: state.currentSort,
    });

    if (dom.filters.tipo.value) params.set('tipo', dom.filters.tipo.value);
    if (dom.filters.ano.value) params.set('ano', dom.filters.ano.value);
    if (dom.filters.categoria.value)
        params.set('categoria', dom.filters.categoria.value);
    if (dom.filters.unidade.value)
        params.set('unidade', dom.filters.unidade.value);
    if (dom.keywordSearchInput.value)
        params.set('keyword', dom.keywordSearchInput.value);

    try {
        const result = await fetchSpreadsheetData(params);
        state.filteredData = result.data || [];

        updateUrlWithFilters();
        renderCurrentPage();

        updateAllPaginationControls(
            state.currentPage,
            result.totalItems,
            state.itemsPerPage,
            dom.pagination
        );
    } catch (error) {
        console.error('Erro ao aplicar filtros:', error);
        dom.dataContainer.textContent = 'Não foi possível carregar os dados.';
    } finally {
        dom.dataContainer.classList.remove('loading-results');
    }
}

// --- FUNÇÃO PARA CONFIGURAR LISTENERS DE EVENTOS ---
function setupEventListeners() {
    dom.searchButton.addEventListener('click', () => applyFilters(1));
    Object.values(dom.filters).forEach((select) =>
        select.addEventListener('change', () => applyFilters(1))
    );

    // MUDANÇA DE ORDENAÇÃO
    dom.sortOrderSelect.addEventListener('change', (e) => {
        state.currentSort = e.target.value;
        applyFilters(1);
    });

    // PAGINAÇÃO - PRÓXIMA PÁGINA
    [dom.pagination.next, dom.pagination.nextTop].forEach((btn) =>
        btn.addEventListener('click', () => {
            applyFilters(state.currentPage + 1);
            lenis.scrollTo('#data-container', { duration: 1.5, offset: -20 });
        })
    );

    // PAGINAÇÃO - PÁGINA ANTERIOR
    [dom.pagination.prev, dom.pagination.prevTop].forEach((btn) =>
        btn.addEventListener('click', () => {
            applyFilters(state.currentPage - 1);
            lenis.scrollTo('#data-container', { duration: 1.5, offset: -20 });
        })
    );

    // BOTÃO DE LIMPAR FILTROS
    dom.clearFiltersButton.addEventListener('click', () => {
        dom.filters.tipo.value = '';
        dom.filters.ano.value = '';
        dom.filters.categoria.value = '';
        dom.filters.unidade.value = '';
        dom.keywordSearchInput.value = '';
        dom.sortOrderSelect.value = 'desc';
        if (dom.clearKeywordButton) {
            dom.clearKeywordButton.style.display = 'none';
        }

        state.currentSort = 'desc';

        window.history.pushState({}, '', window.location.pathname);

        applyFilters(1);
    });

    // BOTÃO VOLTAR AO TOPO
    window.addEventListener('scroll', () =>
        toggleBackToTopButton(dom.backToTopButton)
    );
    dom.backToTopButton.addEventListener('click', () =>
        lenis.scrollTo(0, { duration: 2 })
    );
}

// --- FUNÇÃO PARA BUSCAR DADOS DA PLANILHA ---
async function main() {
    dom.loadingSpinner.style.display = 'block';
    setupEventListeners();

    try {
        // Cria um pedido para as opções de filtro
        const filterParams = new URLSearchParams({ action: 'getFilters' });
        const filterOptions = await fetchSpreadsheetData(filterParams);

        // Popula os dropdowns com as opções recebidas
        // (Estamos adaptando as funções existentes para usar os novos arrays)
        populateSelectFromList(dom.filters.tipo, filterOptions.tipos);
        populateSelectFromList(dom.filters.ano, filterOptions.anos);
        populateSelectFromList(dom.filters.categoria, filterOptions.categorias);
        populateSelectFromList(dom.filters.unidade, filterOptions.unidades);

        // Depois de popular os filtros, carrega os dados da página inicial
        await applyFiltersFromUrl();
    } catch (error) {
        console.error('Falha ao inicializar a aplicação:', error);
        dom.dataContainer.textContent =
            'Erro ao carregar os dados. Tente novamente mais tarde.';
    } finally {
        dom.loadingSpinner.style.display = 'none';
    }
}

// --- INICIALIZAÇÃO DA APLICAÇÃO ---
main();
