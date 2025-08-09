import React from 'react';
import { FieldType } from '../../types/form';
import { Type, Hash, FileText, ChevronDown, Circle, CheckSquare, Calendar } from 'lucide-react';

interface FieldTypeSelectorProps {
  onSelectType: (type: FieldType) => void;
}

const fieldTypes: { type: FieldType; label: string; icon: React.ReactNode }[] = [
  { type: 'text', label: 'Text Input', icon: <Type className="h-4 w-4" /> },
  { type: 'number', label: 'Number Input', icon: <Hash className="h-4 w-4" /> },
  { type: 'textarea', label: 'Textarea', icon: <FileText className="h-4 w-4" /> },
  { type: 'select', label: 'Select Dropdown', icon: <ChevronDown className="h-4 w-4" /> },
  { type: 'radio', label: 'Radio Buttons', icon: <Circle className="h-4 w-4" /> },
  { type: 'checkbox', label: 'Checkboxes', icon: <CheckSquare className="h-4 w-4" /> },
  { type: 'date', label: 'Date Picker', icon: <Calendar className="h-4 w-4" /> },
];

export function FieldTypeSelector({ onSelectType }: FieldTypeSelectorProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Field</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {fieldTypes.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => onSelectType(type)}
            className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
          >
            <div className="flex-shrink-0 text-gray-600 mr-3">
              {icon}
            </div>
            <span className="text-sm font-medium text-gray-900">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}