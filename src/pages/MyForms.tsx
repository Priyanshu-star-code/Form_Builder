import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormSchema } from '../types/form';
import { useForm } from '../context/FormContext';
import { getSavedForms, deleteForm } from '../utils/localStorage';
import { List, Calendar, Eye, Trash2, Plus, Search } from 'lucide-react';

export function MyForms() {
  const { dispatch } = useForm();
  const [savedForms, setSavedForms] = useState<FormSchema[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = () => {
    setIsLoading(true);
    try {
      const forms = getSavedForms();
      setSavedForms(forms.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
    } catch (error) {
      console.error('Failed to load forms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteForm = (formId: string) => {
    if (confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      try {
        deleteForm(formId);
        setSavedForms(prev => prev.filter(form => form.id !== formId));
      } catch (error) {
        alert('Failed to delete form. Please try again.');
      }
    }
  };

  const handlePreviewForm = (form: FormSchema) => {
    dispatch({ type: 'SET_CURRENT_FORM', payload: form });
  };

  const filteredForms = savedForms.filter(form =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <List className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">My Forms</h1>
          </div>
          <Link
            to="/create"
            onClick={() => dispatch({ type: 'RESET_FORM' })}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Form
          </Link>
        </div>
        
        <p className="text-gray-600 mb-6">
          Manage and preview your saved forms ({savedForms.length} total)
        </p>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredForms.length === 0 ? (
        <div className="text-center py-12">
          {savedForms.length === 0 ? (
            <>
              <List className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No forms created yet</h3>
              <p className="text-gray-600 mb-8">
                Start building your first form to collect and organize data.
              </p>
              <Link
                to="/create"
                onClick={() => dispatch({ type: 'RESET_FORM' })}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Form
              </Link>
            </>
          ) : (
            <>
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
              <p className="text-gray-600">
                Try adjusting your search term to find the form you're looking for.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => (
            <div
              key={form.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {form.name}
                </h3>
                <button
                  onClick={() => handleDeleteForm(form.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete form"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Created {formatDate(form.createdAt)}</span>
                </div>
                
                {form.updatedAt.getTime() !== form.createdAt.getTime() && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Updated {formatDate(form.updatedAt)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{form.fields.length} fields</span>
                  <div className="flex space-x-4">
                    <span className="text-gray-600">
                      {form.fields.filter(f => f.required).length} required
                    </span>
                    <span className="text-gray-600">
                      {form.fields.filter(f => f.derivedConfig?.isDerived).length} derived
                    </span>
                  </div>
                </div>
              </div>

              {/* Field Types Summary */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-1">
                  {Array.from(new Set(form.fields.map(f => f.type))).map(type => (
                    <span
                      key={type}
                      className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Link
                  to="/preview"
                  onClick={() => handlePreviewForm(form)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Link>
                
                <Link
                  to="/create"
                  onClick={() => dispatch({ type: 'SET_CURRENT_FORM', payload: form })}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}