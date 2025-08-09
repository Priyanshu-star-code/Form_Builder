import React, { useState } from 'react';
import { useForm } from '../../context/FormContext';
import { saveForm } from '../../utils/localStorage';
import { Save, Loader } from 'lucide-react';

export function FormSaver() {
  const { state, dispatch } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState(state.currentForm?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!state.currentForm || !formName.trim()) return;

    setIsSaving(true);
    try {
      const formToSave = {
        ...state.currentForm,
        name: formName.trim(),
        updatedAt: new Date(),
      };

      saveForm(formToSave);
      dispatch({ type: 'SET_CURRENT_FORM', payload: formToSave });
      setIsModalOpen(false);
      
      // Show success message
      alert('Form saved successfully!');
    } catch (error) {
      alert('Failed to save form. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!state.currentForm || state.currentForm.fields.length === 0) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        <Save className="h-4 w-4 mr-2" />
        Save Form
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Save Form</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Name
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter form name"
                autoFocus
              />
            </div>

            <div className="mb-4 text-sm text-gray-600">
              <p>This form contains:</p>
              <ul className="mt-2 space-y-1">
                <li>• {state.currentForm.fields.length} field{state.currentForm.fields.length !== 1 ? 's' : ''}</li>
                <li>• {state.currentForm.fields.filter(f => f.required).length} required field{state.currentForm.fields.filter(f => f.required).length !== 1 ? 's' : ''}</li>
                <li>• {state.currentForm.fields.filter(f => f.derivedConfig?.isDerived).length} derived field{state.currentForm.fields.filter(f => f.derivedConfig?.isDerived).length !== 1 ? 's' : ''}</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formName.trim() || isSaving}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Form
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}