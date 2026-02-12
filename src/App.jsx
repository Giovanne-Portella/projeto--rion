import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
// Importaremos a página de Importação no próximo passo, por enquanto fica comentado
import ImportPage from './pages/Importation/ImportPage';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('orion_token');
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Todas as rotas internas usam o MainLayout */}
        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
           <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/settings" element={<div className="p-8">Configurações (Em construção)</div>} />
           <Route path="/import" element={<ImportPage />} />
           {/* Redireciona qualquer rota desconhecida para o dashboard */}
           <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}