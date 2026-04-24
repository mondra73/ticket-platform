import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/events');
    } catch {
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#111] border-r border-[#2a2a2a] p-16">
        <span className="text-[#f59e0b] text-2xl">◈</span>
        <div>
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            className="text-6xl font-black uppercase text-white leading-none mb-4">
            Tu próximo<br />
            <span className="text-[#f59e0b]">recital</span><br />
            te espera.
          </h2>
          <p className="text-[#666] text-sm">
            Ingresá a tu cuenta para comprar entradas y gestionar tus tickets.
          </p>
        </div>
        <p className="text-[#2a2a2a] text-xs uppercase tracking-widest">TicketPlatform © 2026</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <p className="text-[#f59e0b] uppercase tracking-[0.3em] text-xs mb-3">Bienvenido</p>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            className="text-4xl font-black uppercase text-white mb-10">
            Iniciar sesión
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-[#666] block mb-2">Usuario</label>
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-[#111] border border-[#2a2a2a] text-white px-4 py-3 text-sm focus:outline-none focus:border-[#f59e0b] transition-colors"
                placeholder="tu_usuario"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#666] block mb-2">Contraseña</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-[#111] border border-[#2a2a2a] text-white px-4 py-3 text-sm focus:outline-none focus:border-[#f59e0b] transition-colors"
                placeholder="••••••"
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs uppercase tracking-wider">{error}</p>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-[#f59e0b] text-black text-sm font-bold uppercase tracking-widest hover:bg-[#b45309] transition-colors disabled:opacity-50 mt-2">
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
          <p className="text-[#666] text-sm mt-8">
            ¿No tenés cuenta?{' '}
            <Link to="/register" className="text-[#f59e0b] hover:underline">Registrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}