import React, { useEffect, useState } from 'react';
import { useForm } from '../context/FormContext';
import { FormRenderer } from '../components/FormPreview/FormRenderer';
import { validateForm, computeDerivedValue } from '../utils/validation';
import { FormValues, FieldError } from '../types/form';
import { Eye, AlertCircle, CheckCircle } from 'lucide-react';

export function PreviewForm() {
  const { state, dispatch } = useForm();
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: true });
    
    // Initialize form values with defaults and computed derived values
    if (state.currentForm) {
      const initialValues: FormValues = {};
      
      state.currentForm.fields.forEach(field => {
        if (field.derivedConfig?.isDerived) {
          initialValues[field.id] = computeDerivedValue(field, state.formValues);
        } else {
          initialValues[field.id] = state.formValues[field.id] ?? field.defaultValue;
        }
      });
      
      dispatch({ type: 'SET_FORM_VALUES', payload: initialValues });
    }

    return () => {
      dispatch({ type: 'SET_PREVIEW_MODE', payload: false });
    };
  }, [state.currentForm, dispatch]);

  const handleFieldChange = (fieldId: string, value: any) => {
    dispatch({ type: 'SET_FIELD_VALUE', payload: { fieldId, value } });
    
    // Clear errors for this field when user starts typing
    setErrors(prev => prev.filter(error => error.fieldId !== fieldId));
    setIsSubmitted(false);
  };

  const handleSubmit = (values: FormValues) => {
    if (!state.currentForm) return;

    const validationErrors = validateForm(state.currentForm.fields, values);
    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      setIsSubmitted(true);
      console.log('Form submitted successfully:', values);
      
      // Show success message
      setTimeout(() => {
        alert('Form submitted successfully! Check the console for submitted values.');
      }, 100);
    } else {
      // Scroll to first error
      const firstErrorField = document.querySelector(`[data-field="${validationErrors[0].fieldId}"]`);
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (!state.currentForm) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">No Form to Preview</h1>
          <p className="text-gray-600 mb-8">
            Create a form first to see the preview. Go to the Create Form page to get started.
          </p>
          <a
            href="/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Your First Form
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Eye className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">Form Preview</h1>
        </div>
        <p className="text-gray-600">
          {state.currentForm.name || 'Untitled Form'} - This is how your form will appear to users
        </p>
      </div>

      {/* Form Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-600">
              {state.currentForm.fields.length}
            </div>
            <div className="ml-2 text-sm text-blue-600">Total Fields</div>
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-red-600">
              {state.currentForm.fields.filter(f => f.required).length}
            </div>
            <div className="ml-2 text-sm text-red-600">Required Fields</div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-purple-600">
              {state.currentForm.fields.filter(f => f.derivedConfig?.isDerived).length}
            </div>
            <div className="ml-2 text-sm text-purple-600">Derived Fields</div>
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-sm font-medium text-red-800">
              Please fix the following errors:
            </h3>
          </div>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {errors.map((error, index) => {
              const field = state.currentForm?.fields.find(f => f.id === error.fieldId);
              return (
                <li key={index}>
                  <strong>{field?.label}:</strong> {error.message}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Success Message */}
      {isSubmitted && errors.length === 0 && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-sm font-medium text-green-800">
              Form submitted successfully! All validations passed.
            </h3>
          </div>
        </div>
      )}

      {/* Form Renderer */}
      <FormRenderer
        fields={state.currentForm.fields}
        values={state.formValues}
        errors={errors}
        onChange={handleFieldChange}
        onSubmit={handleSubmit}
      />

      {/* Debug Info (Development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Info (Development Only)</h3>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(state.formValues, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}