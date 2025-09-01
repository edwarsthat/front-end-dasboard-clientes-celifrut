import type { JSX } from 'preact';
import './css/select.css';

interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectProps {
    options: SelectOption[];
    placeholder?: string;
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    className?: string;
    name?: string;
    id?: string;
}

export function Select({ 
    options, 
    placeholder = "Seleccionar opción", 
    value, 
    onChange, 
    disabled = false,
    className = "",
    name,
    id
}: SelectProps) {
    const handleChange = (e: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
        const target = e.target as HTMLSelectElement;
        onChange(target.value);
    };

    return (
        <select 
            className={`custom-select ${className}`}
            value={value || ""}
            onChange={handleChange}
            disabled={disabled}
            name={name}
            id={id}
        >
            <option value="" disabled>
                {placeholder}
            </option>
            {options.map((option) => (
                <option 
                    key={option.value} 
                    value={option.value}
                    disabled={option.disabled}
                >
                    {option.label}
                </option>
            ))}
        </select>
    );
}
