import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, Settings, LogOut, User, Menu } from 'lucide-react';
import { authService } from '../../services/api';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Recupera dados do usuário de forma segura
  let user = { name: 'Usuário', company: 'Empresa' };
  try {
    const userData = localStorage.getItem('orion_user');
    if (userData) {
      user = JSON.parse(userData);
    }
  } catch (error) {
    console.error("Erro ao carregar dados do usuário do localStorage:", error);
    localStorage.removeItem('orion_user'); // Limpa dados inválidos
  }

  const handleLogout = () => {
    authService.logout();
    navigate('/login'); // Redireciona para o login após o logout
  };

  const menuItems = [
    { label: 'Painel de Controle', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Importação & Validação', path: '/import', icon: <UploadCloud size={20} /> },
    { label: 'Configurações', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-gray-800">
      {/* Sidebar Lateral */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
        
        {/* Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg shadow-blue-500/50 shadow-lg">
            Ó
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider">ÓRION</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">System Manager</p>
          </div>
        </div>

        {/* Menu de Navegação */}
        <nav className="flex-1 mt-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 translate-x-1' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Rodapé do Usuário */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg">
              {user.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-white">{user.name || 'Usuário'}</p>
              <p className="text-xs text-slate-400 truncate">{user.company || 'Empresa'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 w-full py-2 border border-slate-800 rounded hover:bg-slate-800 transition-colors"
          >
            <LogOut size={14} /> SAIR DO SISTEMA
          </button>
        </div>
      </aside>

      {/* Área de Conteúdo (Páginas) */}
      <main className="flex-1 overflow-auto relative">
        {/* Header Superior */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-slate-700">
              {menuItems.find(i => i.path === location.pathname)?.label || 'Bem-vindo'}
            </h2>
            <div className="flex gap-4">
               <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                 ● Sistema Online
               </span>
            </div>
        </header>

        {/* Onde as páginas Dashboard/Import renderizam */}
        <div className="p-8">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}