# 📝 React + Redux Form Builder

A dynamic form builder application built with **React**, **TypeScript**, **Material-UI (MUI)** and **Redux Toolkit**.  
The app allows users to design forms with configurable fields and validations, preview them as end users, manage saved form schemas, and persist schemas to `localStorage` (no backend required).

---

## 🚀 Key Features

- Create dynamic forms with multiple field types (Text, Number, Textarea, Select, Radio, Checkbox, Date).
- Configure fields: label, required toggle, default value, and validation rules.
- Derived fields: compute values from parent fields using formulas (e.g., Age from DOB).
- Reorder and delete fields with ease.
- Preview forms with live validation and derived-field updates.
- Persist form schemas in `localStorage`.
- View and open previously saved forms.

---

## 📍 Routes Overview

| Route      | Description                                                   |
| ---------- | ------------------------------------------------------------- |
| `/create`  | Build a new form by dynamically adding and configuring fields |
| `/preview` | Render and interact with the currently built form             |
| `/myforms` | View all previously saved form schemas                        |

---

## 📂 Suggested Project Structure

## src/

### ├─ components/ Reusable UI components

### ├─ pages/ Route-based pages

### ├─ redux/ Redux store and slices

### ├─ utils/ Validation, storage, helper functions

### ├─ types/ TypeScript type definitions

### ├─ App.tsx Main application file

└─ index.tsx Entry point

---

## 🔧 Field Types & Configurations

**Supported Field Types**  
`text`, `number`, `textarea`, `select`, `radio`, `checkbox`, `date`

**Configurable Properties**

- `label` (string)
- `required` (boolean)
- `defaultValue` (string/number/date)
- `validation` (rules: notEmpty, min/max length, email format, password rules)

**Derived Fields**

- `isDerived` (boolean)
- `parents` (array of field IDs)
- `formula` (custom logic for computation)

---

## 💾 Example LocalStorage Schema

```json
{
  "id": "form_20250809_001",
  "name": "User Registration",
  "createdAt": "2025-08-09T10:30:00.000Z",
  "fields": [
    {
      "id": "f1",
      "type": "date",
      "label": "Date of Birth",
      "required": true,
      "defaultValue": "",
      "validation": {}
    },
    {
      "id": "f2",
      "type": "number",
      "label": "Age",
      "isDerived": true,
      "parents": ["f1"],
      "formula": "floor((today() - parent('f1')) / 365.25)",
      "required": false,
      "defaultValue": ""
    }
  ]
}
```

## 📌 Validation & Derived Field Rules

#### 1 Validations run on both input change and form submit.

#### 2 nline error messages via MUI FormHelperText.

#### 3 Derived fields auto-update based on parent changes and are read-only by default.

#### 4 Prevent circular dependencies between derived fields.

#### 5 🎨 UX & UI Guidelines

Use Material-UI components for a consistent, responsive design.

#### 6 Drag-and-drop support for field reordering (e.g., react-beautiful-dnd).

#### 7 Tooltips for advanced settings like formula editor.

#### 8 Form save prompts for a name and auto-generated createdAt timestamp.

#### 9 Compact list view in /myforms with sort and delete options.

# Clone repository

git clone https://github.com/your-org/react-redux-form-builder.git
cd react-redux-form-builder

# Install dependencies

npm install

# Run development server

npm start

# Build for production

npm run build
