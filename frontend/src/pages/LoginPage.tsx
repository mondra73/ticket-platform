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
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Left panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-surface-2 border-r border-border p-12 xl:p-16">
        <Link to="/events" className="text-amber text-2xl hover:scale-110 transition-transform inline-block w-fit">
          ◈
        </Link>
        
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="font-display text-5xl xl:text-6xl font-black uppercase text-white leading-[0.95]">
            Tu próximo<br />
            <span className="text-amber">recital</span><br />
            te espera.
          </h2>
          <p className="text-muted text-sm leading-relaxed max-w-md">
            Ingresá a tu cuenta para comprar entradas y gestionar tus tickets.
          </p>
        </div>
        
        <p className="text-border text-xs uppercase tracking-[0.3em] font-semibold">
          TicketPlatform © 2026
        </p>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link to="/events" className="text-amber text-3xl inline-block">
              ◈
            </Link>
          </div>

          <p className="text-amber uppercase tracking-[0.3em] text-xs font-semibold mb-3">
            Bienvenido
          </p>
          
          <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-white mb-10">
            Iniciar sesión
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted block mb-2 font-semibold">
                Usuario
              </label>
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-surface-2 border border-border text-white rounded-lg px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30 transition-all duration-200"
                placeholder="tu_usuario"
                autoComplete="username"
              />
            </div>
            
            <div>
              <label className="text-xs uppercase tracking-widest text-muted block mb-2 font-semibold">
                Contraseña
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-surface-2 border border-border text-white rounded-lg px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30 transition-all duration-200"
                placeholder="••••••"
                autoComplete="current-password"
              />
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                <p className="text-red-400 text-xs uppercase tracking-wider font-semibold">{error}</p>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-amber hover:bg-amber-dark text-black rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber/20 mt-2"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
          
          <p className="text-muted text-sm mt-8 text-center">
            ¿No tenés cuenta?{' '}
            <Link to="/register" className="text-amber hover:text-amber-dark font-semibold underline underline-offset-4 transition-colors">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}