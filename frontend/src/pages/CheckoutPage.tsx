import { useEffect, useState } from 'react';
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
      const res = await client.post('/payments', {
        orderId: order.id,
        ...card
      });
      setResult(res.data);
      setStep('done');
    } catch {
      alert('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'quantity') return (
    <div className="checkout-container">
      <h1>Seleccioná la cantidad</h1>
      <input
        type="number"
        min={1}
        max={10}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <button onClick={createOrder} disabled={loading}>
        {loading ? 'Creando orden...' : 'Continuar'}
      </button>
    </div>
  );

  if (step === 'payment' && order) return (
    <div className="checkout-container">
      <h1>Datos de pago</h1>
      <p>Total: ${order.totalAmount}</p>
      <p>Expira: {new Date(order.expiresAt).toLocaleTimeString()}</p>
      <form onSubmit={processPayment}>
        <input
          placeholder="Número de tarjeta (16 dígitos)"
          maxLength={16}
          value={card.cardNumber}
          onChange={(e) => setCard({ ...card, cardNumber: e.target.value })}
        />
        <input
          placeholder="Vencimiento (MM/YY)"
          value={card.expiryDate}
          onChange={(e) => setCard({ ...card, expiryDate: e.target.value })}
        />
        <input
          placeholder="CVV"
          maxLength={4}
          value={card.cvv}
          onChange={(e) => setCard({ ...card, cvv: e.target.value })}
        />
        <input
          placeholder="Nombre en la tarjeta"
          value={card.cardholderName}
          onChange={(e) => setCard({ ...card, cardholderName: e.target.value })}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Procesando...' : 'Pagar'}
        </button>
      </form>
    </div>
  );

  if (step === 'done' && result) return (
    <div className="checkout-container">
      <h1>{result.success ? '✅ Pago aprobado' : '❌ Pago rechazado'}</h1>
      <p>{result.message}</p>
      <button onClick={() => navigate('/my-orders')}>Ver mis entradas</button>
      <button onClick={() => navigate('/events')}>Volver a eventos</button>
    </div>
  );

  return null;
}