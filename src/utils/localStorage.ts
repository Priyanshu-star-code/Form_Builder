import { FormSchema } from '../types/form';

const FORMS_STORAGE_KEY = 'formBuilder_savedForms';

export function getSavedForms(): FormSchema[] {
  try {
    const saved = localStorage.getItem(FORMS_STORAGE_KEY);
    if (!saved) return [];
    
    const forms = JSON.parse(saved);
    return forms.map((form: any) => ({
      ...form,
      createdAt: new Date(form.createdAt),
      updatedAt: new Date(form.updatedAt),
    }));
  } catch (error) {
    console.error('Failed to load saved forms:', error);
    return [];
  }
}

export function saveForm(form: FormSchema): void {
  try {
    const existingForms = getSavedForms();
    const updatedForms = existingForms.filter(f => f.id !== form.id);
    updatedForms.push(form);
    
    localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(updatedForms));
  } catch (error) {
    console.error('Failed to save form:', error);
    throw new Error('Failed to save form to localStorage');
  }
}

export function deleteForm(formId: string): void {
  try {
    const existingForms = getSavedForms();
    const updatedForms = existingForms.filter(f => f.id !== formId);
    localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(updatedForms));
  } catch (error) {
    console.error('Failed to delete form:', error);
    throw new Error('Failed to delete form');
  }
}

export function getFormById(formId: string): FormSchema | null {
  const forms = getSavedForms();
  return forms.find(f => f.id === formId) || null;
}