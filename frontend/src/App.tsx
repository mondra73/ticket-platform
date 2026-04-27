import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ChatWidget from './components/ChatWidget';

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
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="h-full flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Link to="/events" className="flex items-center gap-2 group shrink-0">
          <span className="text-amber text-2xl transition-transform group-hover:scale-110 duration-300">◈</span>
          <span className="font-display text-white text-lg sm:text-xl font-bold tracking-widest uppercase">
            TicketPlatform
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/my-orders"
                className="text-xs uppercase tracking-wider text-text hover:text-amber transition-colors">
                Mis entradas
              </Link>
              <button onClick={handleLogout}
                className="text-xs uppercase tracking-wider text-muted hover:text-red-400 transition-colors">
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
                className="text-xs uppercase tracking-wider bg-amber text-black px-4 py-2 rounded-lg hover:bg-amber-dark transition-all font-semibold">
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
      <div style={{ paddingTop: '64px', paddingLeft: '64px', paddingRight: '32px' }}>
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
      <ChatWidget />
    </div>
  );
}
