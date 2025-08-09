import React, { useState, useEffect } from 'react';
import { FieldType, FormField } from '../types/form';
import { useForm } from '../context/FormContext';
import { FieldTypeSelector } from '../components/FormBuilder/FieldTypeSelector';
import { FieldConfigurator } from '../components/FormBuilder/FieldConfigurator';
import { FieldList } from '../components/FormBuilder/FieldList';
import { FormSaver } from '../components/FormBuilder/FormSaver';

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function CreateForm() {
  const { state, dispatch } = useForm();
  const [selectedFieldType, setSelectedFieldType] = useState<FieldType | null>(null);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(false);

  useEffect(() => {
    // Initialize a new form if none exists
    if (!state.currentForm) {
      dispatch({ type: 'RESET_FORM' });
    }
  }, [state.currentForm, dispatch]);

  const handleSelectFieldType = (type: FieldType) => {
    setSelectedFieldType(type);
    setEditingField(null);
    setIsConfiguring(true);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setSelectedFieldType(null);
    setIsConfiguring(true);
  };

  const handleSaveField = (field: FormField) => {
    if (editingField) {
      dispatch({ 
        type: 'UPDATE_FIELD', 
        payload: { fieldId: field.id, updates: field } 
      });
    } else {
      dispatch({ type: 'ADD_FIELD', payload: field });
    }
    
    setIsConfiguring(false);
    setSelectedFieldType(null);
    setEditingField(null);
  };

  const handleCancelConfiguration = () => {
    setIsConfiguring(false);
    setSelectedFieldType(null);
    setEditingField(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Form</h1>
            <p className="mt-2 text-gray-600">
              Build your custom form by adding and configuring fields
            </p>
          </div>
          <FormSaver />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form Builder */}
        <div className="space-y-6">
          <FieldTypeSelector onSelectType={handleSelectFieldType} />
          
          {isConfiguring && (
            <FieldConfigurator
              field={editingField || (selectedFieldType ? {
                id: generateId(),
                type: selectedFieldType,
                label: '',
                required: false,
                defaultValue: '',
                validation: [],
                order: state.currentForm?.fields.length || 0,
              } : null)}
              isEditing={!!editingField}
              onSave={handleSaveField}
              onCancel={handleCancelConfiguration}
            />
          )}
        </div>

        {/* Right Column - Field List */}
        <div>
          <FieldList onEditField={handleEditField} />
        </div>
      </div>
    </div>
  );
}