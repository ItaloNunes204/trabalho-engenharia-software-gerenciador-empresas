from contextlib import contextmanager
from app.infrastructure.database.pool import pool


@contextmanager
def get_connection():
    with pool.connection() as conn:
        yield conn
