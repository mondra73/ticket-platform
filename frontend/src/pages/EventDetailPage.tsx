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
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-[#666] uppercase tracking-widest text-sm animate-pulse">Cargando...</div>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-[#666]">Evento no encontrado</div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative border-b border-[#2a2a2a] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#f59e0b10_0%,_transparent_60%)]" />
        <div className="max-w-6xl mx-auto px-6 py-20">
          <button onClick={() => navigate('/events')}
            className="text-[#666] text-xs uppercase tracking-widest hover:text-[#f59e0b] transition-colors mb-8 flex items-center gap-2">
            ← Volver
          </button>
          <p className="text-[#f59e0b] uppercase tracking-[0.3em] text-xs mb-3">
            {event.location.name}
          </p>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            className="text-5xl md:text-7xl font-black uppercase text-white leading-none mb-4">
            {event.name}
          </h1>
          <div className="flex items-center gap-6 mt-6">
            <span className="text-[#666] text-sm">
              📍 {event.location.address}
            </span>
            <span className="text-[#666] text-sm">
              📅 {new Date(event.startDate).toLocaleDateString('es-AR', {
                day: '2-digit', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Sectors */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          className="text-2xl font-bold uppercase tracking-widest text-white mb-10">
          Sectores disponibles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2a2a2a]">
          {event.sectors.map((sector) => {
            const available = sector.totalStock - sector.soldStock;
            const soldPercent = (sector.soldStock / sector.totalStock) * 100;
            const isSoldOut = available === 0;
            return (
              <div key={sector.id} className={`bg-[#0a0a0a] p-8 ${!isSoldOut ? 'group cursor-pointer hover:bg-[#111]' : 'opacity-50'} transition-colors`}>
                <div className="flex items-start justify-between mb-6">
                  <span style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                    className="text-2xl font-bold uppercase text-white">
                    {sector.name}
                  </span>
                  {isSoldOut && (
                    <span className="text-xs uppercase tracking-wider text-[#666] border border-[#2a2a2a] px-2 py-1">
                      Agotado
                    </span>
                  )}
                </div>
                <div className="mb-6">
                  <span style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                    className="text-4xl font-black text-[#f59e0b]">
                    ${sector.price}
                  </span>
                </div>
                {/* Stock bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-[#666] mb-2">
                    <span>{available} disponibles</span>
                    <span>{Math.round(soldPercent)}% vendido</span>
                  </div>
                  <div className="h-1 bg-[#1a1a1a] w-full">
                    <div
                      className="h-1 bg-[#f59e0b] transition-all"
                      style={{ width: `${soldPercent}%` }}
                    />
                  </div>
                </div>
                {!isSoldOut && (
                  <button
                    onClick={() => navigate(`/checkout/${sector.id}`)}
                    className="w-full py-3 bg-[#f59e0b] text-black text-sm font-bold uppercase tracking-widest hover:bg-[#b45309] transition-colors group-hover:bg-[#b45309]">
                    Comprar entrada
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}