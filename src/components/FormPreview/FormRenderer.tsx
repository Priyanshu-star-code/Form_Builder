import React from 'react';
import { FormField, FormValues, FieldError } from '../../types/form';
import { FieldRenderer } from './FieldRenderer';

interface FormRendererProps {
  fields: FormField[];
  values: FormValues;
  errors: FieldError[];
  onChange: (fieldId: string, value: any) => void;
  onSubmit?: (values: FormValues) => void;
}

export function FormRenderer({ fields, values, errors, onChange, onSubmit }: FormRendererProps) {
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(values);
    }
  };

  const getFieldError = (fieldId: string) => {
    return errors.find(error => error.fieldId === fieldId);
  };

  if (fields.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <p className="text-gray-500">No fields to display. Add some fields to see the preview.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        {sortedFields.map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={values[field.id]}
            error={getFieldError(field.id)}
            allValues={values}
            onChange={onChange}
          />
        ))}

        {onSubmit && (
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Submit Form
            </button>
          </div>
        )}
      </form>
    </div>
  );
}