from pydantic import BaseModel, Field
from typing import Optional

# Schema para criar um prêmio (sem o id)
class PremioBase(BaseModel):
    # --- Campos OBRIGATÓRIOS ---
    ano: int = None
    tipo: str = None
    alcance: str = None
    unidade: str = None
    subunidade: Optional[str] = None
    categoria: str = None
    area_conhecimento: Optional[str] = None
    vinculo_depositante: Optional[str] = None
    nome_premio: str = None
    descricao: str = None
    link_materia: Optional[str] = None
    url_imagem: Optional[str] = None

# Schema para ler um prêmio do banco (inclui o id e herda de PremioBase)
class Premio(PremioBase):
    id: int

    class Config:
        from_attributes = True # Para Pydantic V2+