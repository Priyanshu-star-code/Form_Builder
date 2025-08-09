export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password';
  value?: number | string | boolean;
  message: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface DerivedFieldConfig {
  isDerived: boolean;
  parentFields: string[];
  formula: string; // Simple formula like "field1 + field2" or custom logic
  computeFunction?: string; // JavaScript function as string
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue: string | number | boolean | string[];
  placeholder?: string;
  options?: SelectOption[]; // For select, radio, checkbox
  validation: ValidationRule[];
  derivedConfig?: DerivedFieldConfig;
  order: number;
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FormValues {
  [fieldId: string]: any;
}

export interface FieldError {
  fieldId: string;
  message: string;
}