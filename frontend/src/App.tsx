import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-surface/90 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/events" className="flex items-center gap-2 group shrink-0">
          <span className="text-amber text-2xl transition-transform group-hover:scale-110">◈</span>
          <span className="font-display text-white text-lg sm:text-xl font-bold tracking-widest uppercase">
            TicketPlatform
          </span>
        </Link>

        <div className="flex items-center gap-5">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-muted text-xs uppercase tracking-wider">
                {user?.name} {user?.lastName}
              </span>
              <Link to="/my-orders"
                className="text-xs uppercase tracking-wider text-text hover:text-amber transition-colors">
                Mis entradas
              </Link>
              <button onClick={handleLogout}
                className="text-xs uppercase tracking-wider text-muted hover:text-white transition-colors">
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                className="text-xs uppercase tracking-wider text-text hover:text-amber transition-colors">
                Ingresar
              </Link>
              <Link to="/register"
                className="text-xs uppercase tracking-wider bg-amber text-black px-3 py-1.5 rounded hover:bg-amber-dark transition-colors font-semibold">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Navigate to="/events" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/checkout/:sectorId" element={
            <PrivateRoute><CheckoutPage /></PrivateRoute>
          } />
          <Route path="/my-orders" element={
            <PrivateRoute><MyOrdersPage /></PrivateRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}