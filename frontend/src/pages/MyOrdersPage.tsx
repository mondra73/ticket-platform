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

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="text-muted uppercase tracking-widest text-sm animate-pulse">
        Cargando entradas...
      </div>
    </div>
  );

  const paid = orders.filter((o) => o.status === 'PAID');

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-14 py-8 sm:py-12">
      <p className="text-amber uppercase tracking-[0.3em] text-xs font-semibold mb-3">Tu historial</p>
      <h1 className="font-display text-4xl sm:text-5xl font-black uppercase text-white mb-10">
        Mis entradas
      </h1>

      {paid.length === 0 ? (
        <div className="text-center py-20 border border-border rounded-2xl">
          <p className="text-5xl mb-4">🎫</p>
          <p className="font-display text-2xl uppercase text-muted mb-2">
            No tenés entradas todavía
          </p>
          <p className="text-muted text-sm">Comprá tu primera entrada y aparecerá acá.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paid.map((order) =>
            order.items.map((item) => (
              <div key={item.id} className="bg-surface-2/50 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl p-5 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-amber text-xs uppercase tracking-widest mb-2">
                      {new Date(order.createdAt).toLocaleDateString('es-AR', {
                        day: '2-digit', month: 'long', year: 'numeric'
                      })}
                    </p>
                    <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white">
                      {item.sector.event.name}
                    </h2>
                    <p className="text-muted text-sm mt-1">
                      {item.sector.name} — {item.quantity} entrada{item.quantity > 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 self-start border border-amber/30 bg-amber/10 text-amber text-xs uppercase tracking-widest px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-amber rounded-full" />
                    Pagado
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {item.tickets.map((ticket, i) => (
                    <div key={ticket.id} className="bg-surface/80 border border-border/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs uppercase tracking-widest text-muted">
                          Entrada #{i + 1}
                        </span>
                        <span className={`text-xs uppercase tracking-wider font-medium ${
                          ticket.validated ? 'text-green-400' : 'text-amber'
                        }`}>
                          {ticket.validated ? 'Usada' : 'Válida'}
                        </span>
                      </div>
                      <p className="text-muted text-xs font-mono break-all">
                        {ticket.qrCode}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
