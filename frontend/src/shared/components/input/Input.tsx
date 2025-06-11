type InputProps = {
    label: string;
    type: string;
};

export const Input = ({ label, type }: InputProps) => {
    const inputId = `${label.toLowerCase().replace(/\s+/g, '-')}-input`;
    const placeholder = `Enter your ${label}`;

    return (
        <div className="min-w-[300px]">
            <label htmlFor={inputId} className="text-sm font-medium"> {label}</label>
            <input
                id={inputId}
                name={label.toLowerCase()}
                placeholder={placeholder}
                type={type}
                className="border rounded-md p-2 w-full"
                required
            />
        </div>
    );
};
