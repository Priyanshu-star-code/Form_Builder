import React, { useState } from 'react';
import { FormField, FieldType, ValidationRule, SelectOption } from '../../types/form';
import { useForm } from '../../context/FormContext';
import { X, Plus, Trash2, GripVertical } from 'lucide-react';

interface FieldConfiguratorProps {
  field: FormField | null;
  isEditing: boolean;
  onSave: (field: FormField) => void;
  onCancel: () => void;
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

const defaultValidationRules: Record<FieldType, ValidationRule[]> = {
  text: [{ type: 'required', value: true, message: 'This field is required' }],
  number: [{ type: 'required', value: true, message: 'This field is required' }],
  textarea: [{ type: 'required', value: true, message: 'This field is required' }],
  select: [{ type: 'required', value: true, message: 'Please select an option' }],
  radio: [{ type: 'required', value: true, message: 'Please select an option' }],
  checkbox: [{ type: 'required', value: true, message: 'Please select at least one option' }],
  date: [{ type: 'required', value: true, message: 'This field is required' }],
};

export function FieldConfigurator({ field, isEditing, onSave, onCancel }: FieldConfiguratorProps) {
  const { state } = useForm();
  const [formData, setFormData] = useState<FormField>(
    field || {
      id: generateId(),
      type: 'text',
      label: '',
      required: false,
      defaultValue: '',
      validation: [],
      order: state.currentForm?.fields.length || 0,
    }
  );

  const [options, setOptions] = useState<SelectOption[]>(
    field?.options || [{ label: '', value: '' }]
  );

  const handleSave = () => {
    const fieldToSave: FormField = {
      ...formData,
      options: ['select', 'radio', 'checkbox'].includes(formData.type) ? options.filter(opt => opt.label && opt.value) : undefined,
    };

    onSave(fieldToSave);
  };

  const addOption = () => {
    setOptions([...options, { label: '', value: '' }]);
  };

  const updateOption = (index: number, key: keyof SelectOption, value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [key]: value };
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const addValidationRule = (type: ValidationRule['type']) => {
    const newRule: ValidationRule = {
      type,
      value: type === 'required' ? true : type === 'minLength' || type === 'maxLength' ? 1 : true,
      message: getDefaultMessage(type),
    };

    setFormData({
      ...formData,
      validation: [...formData.validation, newRule],
    });
  };

  const updateValidationRule = (index: number, updates: Partial<ValidationRule>) => {
    const newRules = [...formData.validation];
    newRules[index] = { ...newRules[index], ...updates };
    setFormData({ ...formData, validation: newRules });
  };

  const removeValidationRule = (index: number) => {
    setFormData({
      ...formData,
      validation: formData.validation.filter((_, i) => i !== index),
    });
  };

  const getDefaultMessage = (type: ValidationRule['type']): string => {
    switch (type) {
      case 'required': return 'This field is required';
      case 'minLength': return 'Minimum length not met';
      case 'maxLength': return 'Maximum length exceeded';
      case 'email': return 'Please enter a valid email address';
      case 'password': return 'Password must be at least 8 characters with one number';
      default: return 'Invalid input';
    }
  };

  const availableParentFields = state.currentForm?.fields.filter(f => 
    f.id !== formData.id && !f.derivedConfig?.isDerived
  ) || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          {isEditing ? 'Edit Field' : 'Configure New Field'}
        </h3>
        <button
          onClick={onCancel}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Basic Configuration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field Label
          </label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter field label"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ 
              ...formData, 
              type: e.target.value as FieldType,
              validation: defaultValidationRules[e.target.value as FieldType] || []
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isEditing}
          >
            <option value="text">Text Input</option>
            <option value="number">Number Input</option>
            <option value="textarea">Textarea</option>
            <option value="select">Select Dropdown</option>
            <option value="radio">Radio Buttons</option>
            <option value="checkbox">Checkboxes</option>
            <option value="date">Date Picker</option>
          </select>
        </div>

        {/* Placeholder */}
        {(['text', 'number', 'textarea'].includes(formData.type)) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={formData.placeholder || ''}
              onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter placeholder text"
            />
          </div>
        )}

        {/* Default Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Default Value
          </label>
          {formData.type === 'textarea' ? (
            <textarea
              value={String(formData.defaultValue)}
              onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          ) : (
            <input
              type={formData.type === 'number' ? 'number' : formData.type === 'date' ? 'date' : 'text'}
              value={String(formData.defaultValue)}
              onChange={(e) => setFormData({ 
                ...formData, 
                defaultValue: formData.type === 'number' ? Number(e.target.value) : e.target.value 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        </div>

        {/* Options for select, radio, checkbox */}
        {['select', 'radio', 'checkbox'].includes(formData.type) && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Options
              </label>
              <button
                type="button"
                onClick={addOption}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </button>
            </div>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Label"
                    value={option.label}
                    onChange={(e) => updateOption(index, 'label', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={option.value}
                    onChange={(e) => updateOption(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Derived Field Configuration */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.derivedConfig?.isDerived || false}
              onChange={(e) => setFormData({
                ...formData,
                derivedConfig: {
                  isDerived: e.target.checked,
                  parentFields: [],
                  formula: '',
                }
              })}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              This is a derived field (computed from other fields)
            </span>
          </label>
        </div>

        {formData.derivedConfig?.isDerived && (
          <div className="pl-6 border-l-2 border-blue-200 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Fields
              </label>
              <select
                multiple
                value={formData.derivedConfig.parentFields}
                onChange={(e) => {
                  const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData({
                    ...formData,
                    derivedConfig: {
                      ...formData.derivedConfig!,
                      parentFields: selectedValues,
                    }
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                size={Math.min(availableParentFields.length, 4)}
              >
                {availableParentFields.map(field => (
                  <option key={field.id} value={field.id}>
                    {field.label} ({field.type})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple fields</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Formula
              </label>
              <input
                type="text"
                value={formData.derivedConfig.formula}
                onChange={(e) => setFormData({
                  ...formData,
                  derivedConfig: {
                    ...formData.derivedConfig!,
                    formula: e.target.value,
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., field1 + field2 or calculateAge(dateOfBirth)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use field IDs in formulas. Special functions: calculateAge(fieldId)
              </p>
            </div>
          </div>
        )}

        {/* Validation Rules */}
        {!formData.derivedConfig?.isDerived && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Validation Rules
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addValidationRule(e.target.value as ValidationRule['type']);
                    e.target.value = '';
                  }
                }}
                className="text-sm border border-gray-300 rounded px-2 py-1"
                defaultValue=""
              >
                <option value="">Add Rule</option>
                <option value="required">Required</option>
                <option value="minLength">Min Length</option>
                <option value="maxLength">Max Length</option>
                <option value="email">Email Format</option>
                <option value="password">Password</option>
              </select>
            </div>

            <div className="space-y-2">
              {formData.validation.map((rule, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium capitalize">{rule.type}:</span>
                  {(rule.type === 'minLength' || rule.type === 'maxLength') && (
                    <input
                      type="number"
                      value={Number(rule.value) || 0}
                      onChange={(e) => updateValidationRule(index, { value: Number(e.target.value) })}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                      min="0"
                    />
                  )}
                  <input
                    type="text"
                    value={rule.message}
                    onChange={(e) => updateValidationRule(index, { message: e.target.value })}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                    placeholder="Error message"
                  />
                  <button
                    type="button"
                    onClick={() => removeValidationRule(index)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.label.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isEditing ? 'Update Field' : 'Add Field'}
          </button>
        </div>
      </div>
    </div>
  );
}