import React, { useEffect } from 'react';
import { FormField, FormValues, FieldError } from '../../types/form';
import { computeDerivedValue } from '../../utils/validation';

interface FieldRendererProps {
  field: FormField;
  value: any;
  error?: FieldError;
  allValues: FormValues;
  onChange: (fieldId: string, value: any) => void;
}

export function FieldRenderer({ field, value, error, allValues, onChange }: FieldRendererProps) {
  // Handle derived field updates
  useEffect(() => {
    if (field.derivedConfig?.isDerived) {
      const computedValue = computeDerivedValue(field, allValues);
      if (computedValue !== value) {
        onChange(field.id, computedValue);
      }
    }
  }, [field, allValues, value, onChange]);

  const renderField = () => {
    const baseClasses = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
    }`;

    const isReadOnly = field.derivedConfig?.isDerived;

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={baseClasses}
            placeholder={field.placeholder}
            readOnly={isReadOnly}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.value ? Number(e.target.value) : '')}
            className={baseClasses}
            placeholder={field.placeholder}
            readOnly={isReadOnly}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={baseClasses}
            placeholder={field.placeholder}
            rows={4}
            readOnly={isReadOnly}
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={baseClasses}
            disabled={isReadOnly}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(field.id, e.target.value)}
                  className="mr-2"
                  disabled={isReadOnly}
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => {
              const currentValues = Array.isArray(value) ? value : [];
              return (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={currentValues.includes(option.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onChange(field.id, [...currentValues, option.value]);
                      } else {
                        onChange(field.id, currentValues.filter((v: string) => v !== option.value));
                      }
                    }}
                    className="mr-2"
                    disabled={isReadOnly}
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              );
            })}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={baseClasses}
            readOnly={isReadOnly}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && !field.derivedConfig?.isDerived && (
          <span className="text-red-500 ml-1">*</span>
        )}
        {field.derivedConfig?.isDerived && (
          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            Calculated
          </span>
        )}
      </label>
      
      {renderField()}
      
      {error && (
        <p className="text-sm text-red-600 mt-1">{error.message}</p>
      )}
      
      {field.derivedConfig?.isDerived && (
        <p className="text-xs text-gray-500 mt-1">
          Computed from: {field.derivedConfig.parentFields.join(', ')}
        </p>
      )}
    </div>
  );
}