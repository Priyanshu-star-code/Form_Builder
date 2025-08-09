import { FormField, ValidationRule, FieldError, FormValues } from '../types/form';

export function validateField(field: FormField, value: any, allValues: FormValues): string[] {
  const errors: string[] = [];

  // Handle derived fields
  if (field.derivedConfig?.isDerived) {
    return errors; // Derived fields don't need validation as they're computed
  }

  for (const rule of field.validation) {
    switch (rule.type) {
      case 'required':
        if (rule.value && (value === '' || value == null || 
            (Array.isArray(value) && value.length === 0))) {
          errors.push(rule.message);
        }
        break;

      case 'minLength':
        if (typeof value === 'string' && typeof rule.value === 'number' && 
            value.length < rule.value) {
          errors.push(rule.message);
        }
        break;

      case 'maxLength':
        if (typeof value === 'string' && typeof rule.value === 'number' && 
            value.length > rule.value) {
          errors.push(rule.message);
        }
        break;

      case 'email':
        if (value && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(rule.message);
          }
        }
        break;

      case 'password':
        if (value && typeof value === 'string') {
          if (value.length < 8) {
            errors.push('Password must be at least 8 characters');
          }
          if (!/\d/.test(value)) {
            errors.push('Password must contain at least one number');
          }
        }
        break;
    }
  }

  return errors;
}

export function validateForm(fields: FormField[], values: FormValues): FieldError[] {
  const errors: FieldError[] = [];

  fields.forEach(field => {
    const fieldErrors = validateField(field, values[field.id], values);
    fieldErrors.forEach(message => {
      errors.push({ fieldId: field.id, message });
    });
  });

  return errors;
}

export function computeDerivedValue(field: FormField, values: FormValues): any {
  if (!field.derivedConfig?.isDerived) {
    return values[field.id] || field.defaultValue;
  }

  const { parentFields, formula } = field.derivedConfig;
  
  try {
    // Simple formula evaluation - in production, you'd want a more secure approach
    let computedFormula = formula;
    
    parentFields.forEach(parentId => {
      const parentValue = values[parentId] || 0;
      computedFormula = computedFormula.replace(
        new RegExp(`\\b${parentId}\\b`, 'g'), 
        String(parentValue)
      );
    });

    // Handle age calculation from date of birth
    if (formula.includes('calculateAge')) {
      const dobField = parentFields[0];
      const dob = values[dobField];
      if (dob) {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      }
      return 0;
    }

    // Simple arithmetic evaluation
    const result = Function(`"use strict"; return (${computedFormula})`)();
    return isNaN(result) ? 0 : result;
  } catch (error) {
    console.error('Error computing derived value:', error);
    return field.defaultValue || 0;
  }
}