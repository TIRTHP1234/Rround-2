import React from 'react';

const InputField = React.forwardRef(({
    label,
    id,
    type = 'text',
    placeholder,
    error,
    className = '',
    ...props
}, ref) => {
    return (
        <div className={`flex flex-col space-y-1.5 ${className}`}>
            {label && (
                <label htmlFor={id} className="text-sm font-medium leading-none text-gray-700">
                    {label}
                </label>
            )}
            <input
                id={id}
                ref={ref}
                type={type}
                placeholder={placeholder}
                className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                {...props}
            />
            {error && <p className="text-[0.8rem] font-medium text-red-500">{error}</p>}
        </div>
    );
});

InputField.displayName = 'InputField';

export default InputField;
