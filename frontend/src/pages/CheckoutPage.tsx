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
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <p className="text-[#f59e0b] uppercase tracking-[0.3em] text-xs mb-3">Paso 1 de 2</p>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          className="text-4xl font-black uppercase text-white mb-10">
          ¿Cuántas entradas?
        </h1>
        <div className="bg-[#111] border border-[#2a2a2a] p-8 mb-6">
          <label className="text-xs uppercase tracking-widest text-[#666] block mb-4">
            Cantidad (máx. 10)
          </label>
          <div className="flex items-center gap-4">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 border border-[#2a2a2a] text-white text-xl hover:border-[#f59e0b] hover:text-[#f59e0b] transition-colors">
              −
            </button>
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              className="text-5xl font-black text-white w-16 text-center">
              {quantity}
            </span>
            <button onClick={() => setQuantity(Math.min(10, quantity + 1))}
              className="w-12 h-12 border border-[#2a2a2a] text-white text-xl hover:border-[#f59e0b] hover:text-[#f59e0b] transition-colors">
              +
            </button>
          </div>
        </div>
        <button onClick={createOrder} disabled={loading}
          className="w-full py-4 bg-[#f59e0b] text-black text-sm font-bold uppercase tracking-widest hover:bg-[#b45309] transition-colors disabled:opacity-50">
          {loading ? 'Creando orden...' : 'Continuar al pago →'}
        </button>
      </div>
    </div>
  );

  if (step === 'payment' && order) return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <p className="text-[#f59e0b] uppercase tracking-[0.3em] text-xs mb-3">Paso 2 de 2</p>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          className="text-4xl font-black uppercase text-white mb-2">
          Datos de pago
        </h1>
        <div className="flex items-center gap-4 mb-8">
          <span style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            className="text-3xl font-black text-[#f59e0b]">
            ${order.totalAmount}
          </span>
          <span className="text-[#666] text-xs uppercase tracking-wider">
            Expira a las {new Date(order.expiresAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
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
              <label className="text-xs uppercase tracking-widest text-[#666] block mb-2">{f.label}</label>
              <input
                placeholder={f.placeholder}
                maxLength={f.maxLength}
                value={card[f.key as keyof typeof card]}
                onChange={(e) => setCard({ ...card, [f.key]: e.target.value })}
                className="w-full bg-[#111] border border-[#2a2a2a] text-white px-4 py-3 text-sm focus:outline-none focus:border-[#f59e0b] transition-colors"
              />
            </div>
          ))}
          <div className="bg-[#111] border border-[#2a2a2a] p-4 mt-2">
            <p className="text-[#666] text-xs">
              💡 <strong className="text-[#e5e5e5]">Simulador:</strong> Tarjetas que empiezan con{' '}
              <code className="text-[#f59e0b]">0000</code> siempre se rechazan.
            </p>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-4 bg-[#f59e0b] text-black text-sm font-bold uppercase tracking-widest hover:bg-[#b45309] transition-colors disabled:opacity-50">
            {loading ? 'Procesando...' : 'Confirmar pago'}
          </button>
        </form>
      </div>
    </div>
  );

  if (step === 'done' && result) return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md text-center">
        <div className={`text-6xl mb-6 ${result.success ? 'text-[#f59e0b]' : 'text-red-500'}`}>
          {result.success ? '◈' : '✕'}
        </div>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          className="text-4xl font-black uppercase text-white mb-3">
          {result.success ? 'Pago aprobado' : 'Pago rechazado'}
        </h1>
        <p className="text-[#666] mb-10">{result.message}</p>
        <div className="flex gap-4">
          {result.success && (
            <button onClick={() => navigate('/my-orders')}
              className="flex-1 py-4 bg-[#f59e0b] text-black text-sm font-bold uppercase tracking-widest hover:bg-[#b45309] transition-colors">
              Ver mis entradas
            </button>
          )}
          <button onClick={() => navigate('/events')}
            className="flex-1 py-4 border border-[#2a2a2a] text-white text-sm uppercase tracking-widest hover:border-[#f59e0b] hover:text-[#f59e0b] transition-colors">
            Volver a eventos
          </button>
        </div>
      </div>
    </div>
  );

  return null;
}