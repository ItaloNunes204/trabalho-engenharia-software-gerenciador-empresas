import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";

interface FieldShellProps {
    id: string;
    label: string;
    required?: boolean;
    error?: string;
    hint?: ReactNode;
    children: ReactNode;
}

function FieldShell({ id, label, required, error, hint, children }: FieldShellProps) {
    return (
        <div className={`field${error ? " field--invalid" : ""}`}>
            <label htmlFor={id} className="field__label">
                {label}
                {required && (
                    <span className="field__required" aria-hidden="true">
                        {" "}
                        *
                    </span>
                )}
            </label>
            {children}
            {hint && !error && (
                <p id={`${id}-hint`} className="field__hint">
                    {hint}
                </p>
            )}
            {error && (
                <p id={`${id}-error`} className="field__error">
                    {error}
                </p>
            )}
        </div>
    );
}

function describedBy(id: string, error?: string, hint?: ReactNode) {
    if (error) return `${id}-error`;
    if (hint) return `${id}-hint`;
    return undefined;
}

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "onChange" | "value"> {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    error?: string;
    hint?: ReactNode;
}

export function TextField({ label, value, onValueChange, error, hint, required, ...inputProps }: TextFieldProps) {
    const id = useId();
    return (
        <FieldShell id={id} label={label} required={required} error={error} hint={hint}>
            <input
                {...inputProps}
                id={id}
                className="input"
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
                aria-required={required || undefined}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy(id, error, hint)}
            />
        </FieldShell>
    );
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "onChange" | "value"> {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    error?: string;
    hint?: ReactNode;
}

export function SelectField({
    label,
    value,
    onValueChange,
    options,
    placeholder,
    error,
    hint,
    required,
    ...selectProps
}: SelectFieldProps) {
    const id = useId();
    return (
        <FieldShell id={id} label={label} required={required} error={error} hint={hint}>
            <select
                {...selectProps}
                id={id}
                className="input select"
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
                aria-required={required || undefined}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy(id, error, hint)}
            >
                {placeholder !== undefined && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </FieldShell>
    );
}
