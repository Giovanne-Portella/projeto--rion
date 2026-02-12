import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Upload, ArrowRight, Zap, BarChart3 } from 'lucide-react';

export default function Welcome() {
  const [user, setUser] = useState({ name: '', company: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('orion_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      
      {/* Cabeçalho de Boas-Vindas */}
      <div className="mb-12 animate-in slide-in-from-bottom-4 duration-700 fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
          Olá, <span className="text-blue-600">{user.name || 'Visitante'}</span>!
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Bem-vindo ao ambiente <b>{user.company || 'Órion'}</b>. <br/>
          Selecione uma ferramenta abaixo para começar suas atividades.
        </p>
      </div>

      {/* Grid de Cards (Estilo Invenio) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl animate-in zoom-in-95 duration-500 delay-100">
        
        {/* Card 1: Dashboard */}
        <div 
          onClick={() => navigate('/dashboard')}
          className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer text-left overflow-hidden"
        >
          {/* Fundo Decorativo Hover */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <LayoutDashboard size={28} strokeWidth={1.5} />
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
              Painel de Controle
            </h3>
            <p className="text-slate-500 mb-6 text-sm leading-relaxed">
              Visualize métricas em tempo real, gerencie filas de disparo e acompanhe o status das campanhas ativas.
            </p>

            <div className="flex items-center text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              Acessar Painel <ArrowRight size={16} className="ml-2" />
            </div>
          </div>
        </div>

        {/* Card 2: Importação */}
        <div 
          onClick={() => navigate('/import')}
          className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-green-200 transition-all duration-300 cursor-pointer text-left overflow-hidden"
        >
          {/* Fundo Decorativo Hover */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <Upload size={28} strokeWidth={1.5} />
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-green-600 transition-colors">
              Novo Disparo
            </h3>
            <p className="text-slate-500 mb-6 text-sm leading-relaxed">
              Importe seus mailings (CSV), valide os contatos automaticamente e inicie novas campanhas de mensagens.
            </p>

            <div className="flex items-center text-sm font-semibold text-green-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              Iniciar Importação <ArrowRight size={16} className="ml-2" />
            </div>
          </div>
        </div>

      </div>

      {/* Footer / Info Rápida */}
      <div className="mt-16 flex gap-8 text-slate-400 text-sm animate-in fade-in duration-700 delay-300">
         <div className="flex items-center gap-2">
            <Zap size={16} /> <span>Sistema Operacional</span>
         </div>
         <div className="w-px h-4 bg-slate-200" />
         <div className="flex items-center gap-2">
            <BarChart3 size={16} /> <span>V 1.0.0</span>
         </div>
      </div>

    </div>
  );
}