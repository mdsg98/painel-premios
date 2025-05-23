from sqlalchemy import create_engine # Importa a função para criar a engine do banco de dados
from sqlalchemy.ext.declarative import declarative_base # Importa a classe base para os modelos ORM
from sqlalchemy.orm import sessionmaker # Importa a função para criar sessões de banco de dados
import os # Importa o módulo os para manipulação de caminhos
from dotenv import load_dotenv # Importa a função para carregar variáveis de ambiente de um arquivo .env

# Construindo o caminho para o arquivo .env (onde está a string de conexão) que está na pasta raiz do projeto backend
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
dotenv_path = os.path.join(BASE_DIR, '.env')

# Carrega as variáveis de ambiente do arquivo .env especificado
load_dotenv(dotenv_path=dotenv_path)

# Obtém a URL de conexão do banco de dados a partir das variáveis de ambiente
NEON_DATABASE_URL = os.getenv("NEON_DATABASE_URL")

# Condicional para verificar se a variável de ambiente NEON_DATABASE_URL foi definida
if not NEON_DATABASE_URL:
    raise ValueError(
        "NEON_DATABASE_URL não foi definida nas variáveis de ambiente. "
        "Verifique o arquivo .env na raiz do projeto backend (ex: backend/.env)."
    )

# Cria a engine do SQLAlchemy (conexão com o banco de dados)
engine = create_engine(NEON_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base é usada para criar os modelos de tabela ORM (Object Relational Mapper).
Base = declarative_base()

# Função de dependência para o FastAPI (cria sessão de db para cada requisição):
def get_db():
    db = SessionLocal()
    try:
        yield db  # Fornece a sessão para o endpoint da API
    finally:
        db.close() # Fecha a sessão