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
    { key: 'name', placeholder: 'Nombre' },
    { key: 'lastName', placeholder: 'Apellido' },
    { key: 'dni', placeholder: 'DNI' },
    { key: 'email', placeholder: 'Email' },
    { key: 'username', placeholder: 'Usuario' },
    { key: 'password', placeholder: 'Contraseña', type: 'password' }
  ];

  return (
    <div className="auth-container">
      <h1>Crear cuenta</h1>
      <form onSubmit={handleSubmit}>
        {fields.map((f) => (
          <input
            key={f.key}
            type={f.type ?? 'text'}
            placeholder={f.placeholder}
            value={form[f.key as keyof typeof form]}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
          />
        ))}
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      <p>¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link></p>
    </div>
  );
}