import React from 'react';

interface EditableCellProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'number';
  className?: string;
  placeholder?: string;
  suffix?: string;
}

export const EditableCell: React.FC<EditableCellProps> = ({ value, onChange, type = 'text', className = '', placeholder = '0', suffix }) => {
  const hasValue = value !== '' && value !== null && value !== undefined && value !== 0 && value !== '0';

  // Use a wrapper for positioning if a suffix is provided
  if (suffix) {
    return (
      <td className={`p-0 border ${className}`}>
        <div className="relative w-full h-full flex items-center justify-center">
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full h-full py-2 px-4 bg-transparent border-none text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {hasValue && (
            <span className="absolute left-3 text-xs text-gray-500 pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
      </td>
    );
  }

  // Original render for cells without a suffix
  return (
    <td className={`p-0 border ${className}`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-full py-2 px-4 bg-transparent border-none text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </td>
  );
};