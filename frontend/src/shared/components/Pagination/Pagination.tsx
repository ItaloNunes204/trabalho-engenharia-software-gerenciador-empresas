import { Icon } from "../Icon/Icon";

interface PaginationProps {
    label: string;
    page: number;
    totalPages: number;
    rangeStart: number;
    rangeEnd: number;
    total: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ label, page, totalPages, rangeStart, rangeEnd, total, onPageChange }: PaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <div className="pagination">
            <p className="pagination__summary">
                Mostrando {rangeStart === 0 ? "0" : `${rangeStart}–${rangeEnd}`} de {total}
            </p>
            <nav aria-label={label}>
                <ul className="pagination__list">
                    <li>
                        <button
                            type="button"
                            className="pagination__button"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page <= 1}
                            aria-label="Página anterior"
                        >
                            <Icon name="chevronLeft" size={16} />
                            <span className="pagination__text">Anterior</span>
                        </button>
                    </li>
                    {pages.map((pageNumber) => (
                        <li key={pageNumber}>
                            <button
                                type="button"
                                className="pagination__button pagination__button--number"
                                onClick={() => onPageChange(pageNumber)}
                                aria-current={pageNumber === page ? "page" : undefined}
                                aria-label={`Página ${pageNumber}`}
                            >
                                {pageNumber}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button
                            type="button"
                            className="pagination__button"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages || total === 0}
                            aria-label="Próxima página"
                        >
                            <span className="pagination__text">Próxima</span>
                            <Icon name="chevronRight" size={16} />
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
