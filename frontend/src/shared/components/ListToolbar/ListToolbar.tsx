import { useId } from "react";
import { Icon } from "../Icon/Icon";

interface ListToolbarProps {
    searchLabel: string;
    searchPlaceholder: string;
    search: string;
    onSearchChange: (value: string) => void;
    statusLabel: string;
    status: string;
    onStatusChange: (value: string) => void;
    statusOptions: { value: string; label: string }[];
}

export function ListToolbar({
    searchLabel,
    searchPlaceholder,
    search,
    onSearchChange,
    statusLabel,
    status,
    onStatusChange,
    statusOptions,
}: ListToolbarProps) {
    const searchId = useId();
    const statusId = useId();

    return (
        <div className="toolbar">
            <div className="field toolbar__search">
                <label htmlFor={searchId} className="field__label">
                    {searchLabel}
                </label>
                <div className="input-with-icon">
                    <Icon name="search" size={16} />
                    <input
                        id={searchId}
                        type="search"
                        className="input"
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                    />
                </div>
            </div>
            <div className="field toolbar__status">
                <label htmlFor={statusId} className="field__label">
                    {statusLabel}
                </label>
                <select
                    id={statusId}
                    className="input select"
                    value={status}
                    onChange={(event) => onStatusChange(event.target.value)}
                >
                    {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
