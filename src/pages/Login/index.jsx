import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { Building, User, Lock, LogIn } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.company || !formData.username || !formData.password) {
      setError('Todos os campos são obrigatórios.');
      setLoading(false);
      return;
    }

    try {
      // Chama o login. O api.js já vai salvar o token e o usuário no localStorage.
      await authService.login(formData.company, formData.username, formData.password);
            
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Falha na autenticação. Verifique empresa, usuário e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="inline-block p-3 bg-blue-600 rounded-full">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-2xl text-white shadow-inner">
              Ó
            </div>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            Bem-vindo ao Órion
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Faça login para gerenciar seus disparos.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <InputField
              id="company"
              name="company"
              type="text"
              placeholder="Empresa"
              value={formData.company}
              onChange={handleChange}
              icon={<Building className="h-5 w-5 text-slate-400" />}
            />
            <InputField
              id="username"
              name="username"
              type="text"
              placeholder="Usuário"
              value={formData.username}
              onChange={handleChange}
              icon={<User className="h-5 w-5 text-slate-400" />}
            />
            <InputField
              id="password"
              name="password"
              type="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              icon={<Lock className="h-5 w-5 text-slate-400" />}
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar no Sistema'}
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LogIn className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const InputField = ({ id, name, type, placeholder, value, onChange, icon }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      {icon}
    </div>
    <input
      id={id}
      name={name}
      type={type}
      required
      className="block w-full px-3 py-3 pl-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);