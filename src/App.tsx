import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FormProvider } from './context/FormContext';
import { Header } from './components/Layout/Header';
import { CreateForm } from './pages/CreateForm';
import { PreviewForm } from './pages/PreviewForm';
import { MyForms } from './pages/MyForms';

function App() {
  return (
    <FormProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/create" replace />} />
              <Route path="/create" element={<CreateForm />} />
              <Route path="/preview" element={<PreviewForm />} />
              <Route path="/myforms" element={<MyForms />} />
            </Routes>
          </main>
        </div>
      </Router>
    </FormProvider>
  );
}

export default App;