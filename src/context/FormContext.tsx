import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { FormSchema, FormField, FormValues, FieldError } from '../types/form';

interface FormState {
  currentForm: FormSchema | null;
  formValues: FormValues;
  errors: FieldError[];
  isPreviewMode: boolean;
}

type FormAction =
  | { type: 'SET_CURRENT_FORM'; payload: FormSchema | null }
  | { type: 'ADD_FIELD'; payload: FormField }
  | { type: 'UPDATE_FIELD'; payload: { fieldId: string; updates: Partial<FormField> } }
  | { type: 'DELETE_FIELD'; payload: string }
  | { type: 'REORDER_FIELDS'; payload: FormField[] }
  | { type: 'SET_FORM_VALUES'; payload: FormValues }
  | { type: 'SET_FIELD_VALUE'; payload: { fieldId: string; value: any } }
  | { type: 'SET_ERRORS'; payload: FieldError[] }
  | { type: 'SET_PREVIEW_MODE'; payload: boolean }
  | { type: 'RESET_FORM' };

const initialState: FormState = {
  currentForm: null,
  formValues: {},
  errors: [],
  isPreviewMode: false,
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_CURRENT_FORM':
      return {
        ...state,
        currentForm: action.payload,
        formValues: action.payload ? 
          action.payload.fields.reduce((acc, field) => ({
            ...acc,
            [field.id]: field.defaultValue
          }), {}) : {},
        errors: [],
      };

    case 'ADD_FIELD':
      if (!state.currentForm) return state;
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          fields: [...state.currentForm.fields, action.payload],
          updatedAt: new Date(),
        },
      };

    case 'UPDATE_FIELD':
      if (!state.currentForm) return state;
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          fields: state.currentForm.fields.map(field =>
            field.id === action.payload.fieldId
              ? { ...field, ...action.payload.updates }
              : field
          ),
          updatedAt: new Date(),
        },
      };

    case 'DELETE_FIELD':
      if (!state.currentForm) return state;
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          fields: state.currentForm.fields.filter(field => field.id !== action.payload),
          updatedAt: new Date(),
        },
      };

    case 'REORDER_FIELDS':
      if (!state.currentForm) return state;
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          fields: action.payload.map((field, index) => ({ ...field, order: index })),
          updatedAt: new Date(),
        },
      };

    case 'SET_FORM_VALUES':
      return {
        ...state,
        formValues: action.payload,
      };

    case 'SET_FIELD_VALUE':
      return {
        ...state,
        formValues: {
          ...state.formValues,
          [action.payload.fieldId]: action.payload.value,
        },
      };

    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload,
      };

    case 'SET_PREVIEW_MODE':
      return {
        ...state,
        isPreviewMode: action.payload,
      };

    case 'RESET_FORM':
      return {
        ...initialState,
        currentForm: {
          id: generateId(),
          name: '',
          fields: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

    default:
      return state;
  }
}

const FormContext = createContext<{
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
} | null>(null);

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}