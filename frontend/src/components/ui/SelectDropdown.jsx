import React from 'react';

const SelectDropdown = React.forwardRef(({
    label,
    id,
    options,
    error,
    placeholder = "Select an option",
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
            <div className="relative">
                <select
                    id={id}
                    ref={ref}
                    className={`flex h-10 w-full appearance-none rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                        }`}
                    {...props}
                >
                    <option value="" disabled hidden>
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {/* Custom arrow icon */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </div>
            {error && <p className="text-[0.8rem] font-medium text-red-500">{error}</p>}
        </div>
    );
});

SelectDropdown.displayName = 'SelectDropdown';

export default SelectDropdown;
