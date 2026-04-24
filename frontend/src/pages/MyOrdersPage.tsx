import { useEffect, useState } from 'react';
import type { Order } from '../types';
import client from '../api/client';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/orders/my-orders').then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Cargando tus entradas...</p>;

  const paid = orders.filter((o) => o.status === 'PAID');

  return (
    <div className="orders-container">
      <h1>Mis entradas</h1>
      {paid.length === 0 && <p>No tenés entradas compradas todavía.</p>}
      {paid.map((order) => (
        <div key={order.id} className="order-card">
          {order.items.map((item) => (
            <div key={item.id}>
              <h2>{item.sector.event.name}</h2>
              <p>{item.sector.event.location?.name}</p>
              <p>Sector: {item.sector.name} — {item.quantity} entrada/s</p>
              <div className="tickets">
                {item.tickets.map((ticket) => (
                  <div key={ticket.id} className="ticket">
                    <p>🎫 QR: {ticket.qrCode}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}