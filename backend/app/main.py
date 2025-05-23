from fastapi import FastAPI, Depends, HTTPException # Importa as classes e funções do FastAPI
from sqlalchemy.orm import Session # Importa a classe Session do SQLAlchemy
from sqlalchemy import text # Para executar queries SQL puras
from typing import List # Para especificar uma lista de modelos Pydantic na resposta

# Importação dos schemas da pasta app
from . import schemas
from .database import get_db # Importa a função get_db do arquivo database.py

# Importação do arquivo de configuração do banco de dados
app = FastAPI(
    title="API Painel de Prêmios",
    description="API para gerenciar e exibir prêmios, reconhecimentos e destaques",
    version="0.1.0"
)

# --- Configuração do CORS (Cross-Origin Resource Sharing) ---
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost",         # Adicione aqui a URL do seu frontend em desenvolvimento local
    "http://localhost:8080",    # Porta usual para desenvolvimento com React
    "http://localhost:3000",    # Porta usual para desenvolvimento com Vue.js
    "http://127.0.0.1:5500",    # Adicional: URL para desenvolvimento com Live Server (VSCode)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,     # Lista de origens permitidas
    allow_credentials=True,    # Permite cookies e credenciais (implementações futuras)
    allow_methods=["*"],       # Permite todos os métodos HTTP (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],       # Permite todos os cabeçalhos HTTP
)

# Endpoint para verificar se a API está funcionando
@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API do Painel de Prêmios!"}


# Endpoint para listar todos os prêmios
@app.get("/api/premios/", response_model=List[schemas.Premio])
def listar_premios(db: Session = Depends(get_db)):
    query = text("""
        SELECT id, ano, tipo, alcance, unidade, subunidade, categoria, 
               area_conhecimento, vinculo_depositante, nome_premio, 
               descricao, link_materia, url_imagem
        FROM geral
        ORDER BY ano DESC, id DESC; 
    """)

    # A query SQL pura para selecionar todos os prêmios da tabela "geral"
    try:
        result = db.execute(query)
        premios_do_banco = result.fetchall() # Retorna uma lista de objetos tipo RowProxy

        # Se não houver prêmios, retorna uma lista vazia (array JSON vazio)
        if not premios_do_banco:
            return []

        # Converte os resultados para o formato esperado pelo Pydantic
        return premios_do_banco 

    except Exception as e:
        # Se ocorrer um erro ao executar a query, retorna um erro 500
        print(f"Erro ao buscar prêmios: {e}") # Para debug durante o desenvolvimento
        raise HTTPException(status_code=500, detail=f"Erro interno ao buscar dados dos prêmios.")
