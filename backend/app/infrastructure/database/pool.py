import os
from app.infrastructure.database.connection import ConnectionPool
from dotenv import load_dotenv

load_dotenv()

DB_URL = (
    f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}"
    f"@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
)

pool = ConnectionPool(
    conninfo=DB_URL,
    min_size=1,
    max_size=10,
    open=True,
)
