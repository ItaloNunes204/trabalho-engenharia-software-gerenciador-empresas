import { useState } from "react";

export const PAGE_SIZE = 5;

export function usePagination<T>(items: T[], pageSize = PAGE_SIZE) {
    const [requestedPage, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const page = Math.min(Math.max(requestedPage, 1), totalPages);

    // Mantém a página ativa dentro do intervalo após exclusões ou filtros.
    if (page !== requestedPage) {
        setPage(page);
    }

    const start = (page - 1) * pageSize;
    const pageItems = items.slice(start, start + pageSize);

    return {
        page,
        setPage,
        totalPages,
        pageItems,
        total: items.length,
        rangeStart: items.length === 0 ? 0 : start + 1,
        rangeEnd: start + pageItems.length,
    };
}
