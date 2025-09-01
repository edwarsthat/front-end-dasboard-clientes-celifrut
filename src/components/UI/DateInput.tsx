import type { JSX } from 'preact';
import './css/dateinput.css';

interface DateInputProps {
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    name?: string;
    id?: string;
    min?: string;
    max?: string;
}

export function DateInput({ 
    value, 
    onChange, 
    placeholder = "Seleccionar fecha",
    disabled = false,
    className = "",
    name,
    id,
    min,
    max
}: DateInputProps) {
    const handleChange = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
        const target = e.target as HTMLInputElement;
        onChange(target.value);
    };

    return (
        <input
            type="week"
            className={`custom-date-input ${className}`}
            value={value || ""}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            name={name}
            id={id}
            min={min}
            max={max}
        />
    );
}
