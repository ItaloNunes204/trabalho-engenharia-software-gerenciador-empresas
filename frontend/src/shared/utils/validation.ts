const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
    return EMAIL_PATTERN.test(value.trim());
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function hasErrors<T>(errors: FieldErrors<T>): boolean {
    return Object.values(errors).some(Boolean);
}
