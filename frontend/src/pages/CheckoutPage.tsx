import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Order } from '../types';
import client from '../api/client';

export default function CheckoutPage() {
  const { sectorId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [order, setOrder] = useState<Order | null>(null);
  const [card, setCard] = useState({
    cardNumber: '', expiryDate: '', cvv: '', cardholderName: ''
  });
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'quantity' | 'payment' | 'done'>('quantity');

  const createOrder = async () => {
    setLoading(true);
    try {
      const res = await client.post('/orders', {
        items: [{ sectorId: Number(sectorId), quantity }]
      });
      setOrder(res.data);
      setStep('payment');
    } catch {
      alert('Error al crear la orden');
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setLoading(true);
    try {
      const res = await client.post('/payments', { orderId: order.id, ...card });
      setResult(res.data);
      setStep('done');
    } catch {
      alert('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'quantity') return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-14 py-12 sm:py-16 flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md">
        <p className="text-amber uppercase tracking-[0.3em] text-xs font-semibold mb-3">Paso 1 de 2</p>
        <h1 className="font-display text-4xl font-black uppercase text-white mb-10">
          ¿Cuántas entradas?
        </h1>
        <div className="bg-surface-2 border border-border rounded-xl p-8 mb-6">
          <label className="text-xs uppercase tracking-widest text-muted block mb-4 font-semibold">
            Cantidad (máx. 10)
          </label>
          <div className="flex items-center gap-4">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 border border-border text-white text-xl rounded-lg hover:border-amber hover:text-amber transition-colors">
              −
            </button>
            <span className="font-display text-5xl font-black text-white w-16 text-center">
              {quantity}
            </span>
            <button onClick={() => setQuantity(Math.min(10, quantity + 1))}
              className="w-12 h-12 border border-border text-white text-xl rounded-lg hover:border-amber hover:text-amber transition-colors">
              +
            </button>
          </div>
        </div>
        <button onClick={createOrder} disabled={loading}
          className="w-full py-4 bg-amber hover:bg-amber-dark text-black rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Creando orden...' : 'Continuar al pago →'}
        </button>
      </div>
    </div>
  );

  if (step === 'payment' && order) return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-14 py-12 sm:py-16 flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md">
        <p className="text-amber uppercase tracking-[0.3em] text-xs font-semibold mb-3">Paso 2 de 2</p>
        <h1 className="font-display text-4xl font-black uppercase text-white mb-2">
          Datos de pago
        </h1>
        <div className="flex items-center gap-4 mb-8">
          <span className="font-display text-3xl font-black text-amber">
            ${order.totalAmount}
          </span>
          <span className="text-muted text-xs uppercase tracking-wider">
            Expira {new Date(order.expiresAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <form onSubmit={processPayment} className="space-y-4">
          {[
            { key: 'cardNumber', label: 'Número de tarjeta', placeholder: '1234 5678 9012 3456', maxLength: 16 },
            { key: 'cardholderName', label: 'Nombre en la tarjeta', placeholder: 'JUAN PEREZ' },
            { key: 'expiryDate', label: 'Vencimiento', placeholder: 'MM/YY' },
            { key: 'cvv', label: 'CVV', placeholder: '123', maxLength: 4 }
          ].map((f) => (
            <div key={f.key}>
              <label className="text-xs uppercase tracking-widest text-muted block mb-2 font-semibold">{f.label}</label>
              <input
                placeholder={f.placeholder}
                maxLength={f.maxLength}
                value={card[f.key as keyof typeof card]}
                onChange={(e) => setCard({ ...card, [f.key]: e.target.value })}
                className="w-full bg-surface-2 border border-border text-white rounded-lg px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30 transition-all duration-200"
              />
            </div>
          ))}
          <div className="bg-surface-2 border border-border rounded-lg p-4 mt-2">
            <p className="text-muted text-xs">
              💡 <strong className="text-text">Simulador:</strong> Tarjetas que empiezan con{' '}
              <code className="text-amber">0000</code> siempre se rechazan.
            </p>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-4 bg-amber hover:bg-amber-dark text-black rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Procesando...' : 'Confirmar pago'}
          </button>
        </form>
      </div>
    </div>
  );

  if (step === 'done' && result) return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-14 py-12 sm:py-16 flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md text-center">
        <div className={`text-6xl mb-6 ${result.success ? 'text-amber' : 'text-red-500'}`}>
          {result.success ? '◈' : '✕'}
        </div>
        <h1 className="font-display text-4xl font-black uppercase text-white mb-3">
          {result.success ? 'Pago aprobado' : 'Pago rechazado'}
        </h1>
        <p className="text-muted mb-10">{result.message}</p>
        <div className="flex gap-4">
          {result.success && (
            <button onClick={() => navigate('/my-orders')}
              className="flex-1 py-4 bg-amber hover:bg-amber-dark text-black rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-200">
              Ver mis entradas
            </button>
          )}
          <button onClick={() => navigate('/events')}
            className="flex-1 py-4 border border-border text-white rounded-lg text-sm uppercase tracking-widest hover:border-amber hover:text-amber transition-all duration-200">
            Volver a eventos
          </button>
        </div>
      </div>
    </div>
  );

  return null;
}
