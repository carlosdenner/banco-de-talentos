import { forwardRef, type InputHTMLAttributes } from 'react';

interface CheckboxGroupProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
  label: string;
  options: readonly string[] | string[];
  value?: string[];
  error?: string;
  onValueChange?: (value: string[]) => void;
  showOther?: boolean;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
}

export const CheckboxGroup = forwardRef<HTMLInputElement, CheckboxGroupProps>(
  ({ 
    label, 
    options, 
    value = [], 
    error, 
    onValueChange, 
    name, 
    required,
    showOther,
    otherValue,
    onOtherChange,
  }, ref) => {
    const handleChange = (option: string, checked: boolean) => {
      if (checked) {
        onValueChange?.([...value, option]);
      } else {
        onValueChange?.(value.filter((v) => v !== option));
      }
    };

    const isOtherSelected = value.includes('Outra');

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                ref={ref}
                type="checkbox"
                name={name}
                value={option}
                checked={value.includes(option)}
                onChange={(e) => handleChange(option, e.target.checked)}
                className="w-4 h-4 text-primary focus:ring-primary rounded"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
          {showOther && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isOtherSelected}
                onChange={(e) => handleChange('Outra', e.target.checked)}
                className="w-4 h-4 text-primary focus:ring-primary rounded"
              />
              <span className="text-gray-700">Outra</span>
            </label>
          )}
        </div>
        {showOther && isOtherSelected && (
          <input
            type="text"
            placeholder="Especifique..."
            value={otherValue || ''}
            onChange={(e) => onOtherChange?.(e.target.value)}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        )}
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

CheckboxGroup.displayName = 'CheckboxGroup';
