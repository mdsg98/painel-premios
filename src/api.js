// src/api.js

// --- INICIALIZAÇÃO E ESTADO DA APLICAÇÃO ---
const spreadsheetUrl =
    'https://script.google.com/macros/s/AKfycbxSCpWq_6LZ4eMWE4y1RSwbK5eh7N4t3xvMXVs-TAUQ3WjsJSGif1ZnHWh_0GrrKD8/exec';

export async function fetchSpreadsheetData(params) {
    const url = new URL(spreadsheetUrl);
    url.search = params.toString();

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Falha na requisição para a planilha');
    }
    return await response.json();
}
