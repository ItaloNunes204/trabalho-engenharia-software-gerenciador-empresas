/** Converte AAAA-MM-DD em DD/MM/AAAA sem passar por fuso horário. */
export function formatDate(isoDate: string): string {
    const [year, month, day] = isoDate.split("-");
    return day && month && year ? `${day}/${month}/${year}` : isoDate;
}

export function todayIsoDate(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
}

export function pluralize(count: number, singular: string, plural: string): string {
    return `${count} ${count === 1 ? singular : plural}`;
}

/** Normaliza texto para busca sem diferenciar maiúsculas nem acentos. */
export function normalizeSearch(text: string): string {
    return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

export function matchesSearch(query: string, fields: string[]): boolean {
    const normalizedQuery = normalizeSearch(query);
    if (!normalizedQuery) return true;
    return fields.some((field) => normalizeSearch(field).includes(normalizedQuery));
}
