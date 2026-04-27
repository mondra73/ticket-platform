import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', lastName: '', dni: '', email: '', username: '', password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/login');
    } catch {
      setError('Error al registrarse. Verificá los datos.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Nombre', placeholder: 'Juan' },
    { key: 'lastName', label: 'Apellido', placeholder: 'Pérez' },
    { key: 'dni', label: 'DNI', placeholder: '12345678' },
    { key: 'email', label: 'Email', placeholder: 'juan@mail.com' },
    { key: 'username', label: 'Usuario', placeholder: 'juanperez' },
    { key: 'password', label: 'Contraseña', placeholder: '••••••', type: 'password' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-14 py-12 sm:py-16 flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-lg">
        <p className="text-amber uppercase tracking-[0.3em] text-xs font-semibold mb-3">Nuevo usuario</p>
        <h1 className="font-display text-4xl font-black uppercase text-white mb-10">
          Crear cuenta
        </h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.key} className={f.key === 'email' || f.key === 'password' ? 'col-span-2' : ''}>
              <label className="text-xs uppercase tracking-widest text-muted block mb-2 font-semibold">{f.label}</label>
              <input
                type={f.type ?? 'text'}
                placeholder={f.placeholder}
                value={form[f.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full bg-surface-2 border border-border text-white rounded-lg px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30 transition-all duration-200"
              />
            </div>
          ))}
          {error && <p className="col-span-2 text-red-400 text-xs uppercase tracking-wider font-semibold">{error}</p>}
          <button type="submit" disabled={loading}
            className="col-span-2 py-4 bg-amber hover:bg-amber-dark text-black rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>
        <p className="text-muted text-sm mt-8 text-center">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-amber hover:text-amber-dark font-semibold underline underline-offset-4 transition-colors">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
