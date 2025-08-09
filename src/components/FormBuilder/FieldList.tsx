import React from 'react';
import { FormField } from '../../types/form';
import { useForm } from '../../context/FormContext';
import { Edit2, Trash2, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';

interface FieldListProps {
  onEditField: (field: FormField) => void;
}

export function FieldList({ onEditField }: FieldListProps) {
  const { state, dispatch } = useForm();

  if (!state.currentForm || state.currentForm.fields.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <p className="text-gray-500">No fields added yet. Add your first field to get started!</p>
      </div>
    );
  }

  const sortedFields = [...state.currentForm.fields].sort((a, b) => a.order - b.order);

  const handleMoveField = (fieldId: string, direction: 'up' | 'down') => {
    const currentIndex = sortedFields.findIndex(f => f.id === fieldId);
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < sortedFields.length - 1)
    ) {
      const newFields = [...sortedFields];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      [newFields[currentIndex], newFields[targetIndex]] = [newFields[targetIndex], newFields[currentIndex]];
      
      dispatch({ type: 'REORDER_FIELDS', payload: newFields });
    }
  };

  const handleDeleteField = (fieldId: string) => {
    if (confirm('Are you sure you want to delete this field?')) {
      dispatch({ type: 'DELETE_FIELD', payload: fieldId });
    }
  };

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return '📝';
      case 'number': return '#️⃣';
      case 'textarea': return '📄';
      case 'select': return '📋';
      case 'radio': return '◯';
      case 'checkbox': return '☑️';
      case 'date': return '📅';
      default: return '📝';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Form Fields ({sortedFields.length})</h3>
      </div>

      <div className="divide-y divide-gray-200">
        {sortedFields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => handleMoveField(field.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <button
                    onClick={() => handleMoveField(field.id, 'down')}
                    disabled={index === sortedFields.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{getFieldTypeIcon(field.type)}</span>
                    <h4 className="font-medium text-gray-900">{field.label}</h4>
                    {field.required && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    )}
                    {field.derivedConfig?.isDerived && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Derived
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="capitalize">{field.type}</span>
                    {field.validation.length > 0 && (
                      <span>{field.validation.length} validation rule{field.validation.length !== 1 ? 's' : ''}</span>
                    )}
                    {field.derivedConfig?.isDerived && (
                      <span>Formula: {field.derivedConfig.formula}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEditField(field)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteField(field.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}