import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Event } from '../types';
import client from '../api/client';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.get(`/events`),
      client.get(`/sectors/event/${id}`)
    ]).then(([eventsRes, sectorsRes]) => {
      const found = eventsRes.data.find((e: Event) => e.id === Number(id));
      if (found) {
        found.sectors = sectorsRes.data;
        setEvent(found);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="text-muted uppercase tracking-widest text-sm animate-pulse">Cargando...</div>
    </div>
  );

  if (!event) return (
    <div className="flex items-center justify-center py-32">
      <div className="text-muted">Evento no encontrado</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-14 py-8 sm:py-12">
      <button onClick={() => navigate('/events')}
        className="text-muted text-xs uppercase tracking-widest hover:text-amber transition-colors mb-8 flex items-center gap-2">
        ← Volver
      </button>
      
      <p className="text-amber uppercase tracking-[0.3em] text-xs font-semibold mb-3">
        {event.location?.name || 'Ubicación'}
      </p>
      
      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-white leading-[0.95] mb-4">
        {event.name}
      </h1>
      
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 mb-12">
        <span className="text-muted text-sm">
          📍 {event.location?.address || 'Dirección'}
        </span>
        <span className="text-muted text-sm">
          📅 {new Date(event.startDate).toLocaleDateString('es-AR', {
            day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })}
        </span>
      </div>

      <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white mb-8">
        Sectores disponibles
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {event.sectors?.map((sector) => {
          const available = sector.totalStock - sector.soldStock;
          const soldPercent = (sector.soldStock / sector.totalStock) * 100;
          const isSoldOut = available === 0;
          
          return (
            <div key={sector.id} className={`bg-surface-2/50 border border-border/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 ${!isSoldOut ? 'group cursor-pointer hover:bg-surface-2 hover:border-amber/30' : 'opacity-50'} transition-all duration-300`}>
              <div className="flex items-start justify-between mb-6">
                <span className="font-display text-2xl font-bold uppercase text-white">
                  {sector.name}
                </span>
                {isSoldOut && (
                  <span className="text-xs uppercase tracking-wider text-muted border border-border px-2 py-1 rounded">
                    Agotado
                  </span>
                )}
              </div>
              
              <div className="mb-6">
                <span className="font-display text-4xl font-black text-amber">
                  ${sector.price}
                </span>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-xs text-muted mb-2">
                  <span>{available} disponibles</span>
                  <span>{Math.round(soldPercent)}% vendido</span>
                </div>
                <div className="h-1 bg-surface-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber transition-all duration-500"
                    style={{ width: `${soldPercent}%` }}
                  />
                </div>
              </div>
              
              {!isSoldOut && (
                <button
                  onClick={() => navigate(`/checkout/${sector.id}`)}
                  className="w-full py-3 bg-amber hover:bg-amber-dark text-black rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-200"
                >
                  Comprar entrada
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
