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
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <p className="text-[#f59e0b] uppercase tracking-[0.3em] text-xs mb-3">Nuevo usuario</p>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          className="text-4xl font-black uppercase text-white mb-10">
          Crear cuenta
        </h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.key} className={f.key === 'email' || f.key === 'password' ? 'col-span-2' : ''}>
              <label className="text-xs uppercase tracking-widest text-[#666] block mb-2">{f.label}</label>
              <input
                type={f.type ?? 'text'}
                placeholder={f.placeholder}
                value={form[f.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full bg-[#111] border border-[#2a2a2a] text-white px-4 py-3 text-sm focus:outline-none focus:border-[#f59e0b] transition-colors"
              />
            </div>
          ))}
          {error && <p className="col-span-2 text-red-500 text-xs uppercase tracking-wider">{error}</p>}
          <button type="submit" disabled={loading}
            className="col-span-2 py-4 bg-[#f59e0b] text-black text-sm font-bold uppercase tracking-widest hover:bg-[#b45309] transition-colors disabled:opacity-50">
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>
        <p className="text-[#666] text-sm mt-8">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-[#f59e0b] hover:underline">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
}