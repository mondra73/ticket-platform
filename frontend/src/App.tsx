import { Routes, Route, Navigate, Link } from 'react-router-dom';
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
  return (
    <nav className="navbar">
      <Link to="/events">🎫 TicketApp</Link>
      <div>
        {isAuthenticated ? (
          <>
            <span>Hola, {user?.name}</span>
            <Link to="/my-orders">Mis entradas</Link>
            <button onClick={logout}>Salir</button>
          </>
        ) : (
          <>
            <Link to="/login">Ingresar</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
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
      </main>
    </>
  );
}