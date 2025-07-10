// src/api.js

// --- INICIALIZAÇÃO E ESTADO DA APLICAÇÃO
const spreadsheetUrl =
    'https://script.google.com/macros/s/AKfycby0sVSzIscuQ0MS4claDFAsCT1xp1sEUIlxC2vV8VMC-OvD4v8fvj9Vzs4vlHSR_cE/exec';

export async function fetchSpreadsheetData() {
    const response = await fetch(spreadsheetUrl);
    if (!response.ok) {
        throw new Error('Falha na requisição para a planilha');
    }
    return await response.json();
}
