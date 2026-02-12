import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ImportPage from './pages/Importation/ImportPage';
import Welcome from './pages/Welcome';
import MainLayout from './components/Layout/MainLayout';
import { authService } from './services/api';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          {}
          <Route index element={<Navigate to="/welcome" replace />} />
          
          <Route path="welcome" element={<Welcome />} /> {}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="import" element={<ImportPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;