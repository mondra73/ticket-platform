import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Event } from '../types';
import client from '../api/client';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    client.get('/events')
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando eventos:', err);
        setError('No se pudieron cargar los eventos');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-muted uppercase tracking-widest text-sm animate-pulse">
        Cargando eventos...
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center py-20 px-4">
      <div className="text-center space-y-6">
        <div className="text-5xl">⚠️</div>
        <p className="text-red-400 text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-amber text-black font-semibold rounded-lg hover:bg-amber-dark transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-14 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 bg-amber/10 border border-amber/20 rounded-full px-4 py-1.5 mb-6">
          <div className="w-1.5 h-1.5 bg-amber rounded-full animate-pulse" />
          <span className="text-amber text-[11px] font-semibold uppercase tracking-[0.25em]">
            Plataforma de entradas
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-white leading-[0.95] mb-4">
          Eventos en{' '}
          <span className="text-amber">vivo</span>
        </h1>

        <p className="text-muted text-base sm:text-lg max-w-xl">
          Comprá tus entradas de forma rápida y segura. Sistema de cola virtual para alta demanda.
        </p>
      </div>

      {/* Events list */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <span className="text-amber text-xs font-semibold uppercase tracking-[0.2em] mb-1.5 block">
              Calendario
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
              Próximos eventos
            </h2>
          </div>
          <span className="text-muted text-sm">
            {events.length} evento{events.length !== 1 ? 's' : ''}
          </span>
        </div>

        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => {
              const eventDate = new Date(event.startDate);
              return (
                <div
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="group bg-surface-2/50 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl p-5 sm:p-6 cursor-pointer hover:bg-surface-2 hover:border-amber/30 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 bg-amber/10 rounded-lg flex items-center justify-center border border-amber/20">
                          <span className="text-amber text-lg sm:text-xl font-bold font-display">
                            {eventDate.getDate()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <span className="text-amber text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] block truncate">
                            {eventDate.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
                          </span>
                          <span className="text-muted text-xs block truncate">
                            {eventDate.toLocaleDateString('es-AR', { weekday: 'long' })}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-white leading-tight group-hover:text-amber transition-colors duration-300">
                        {event.name}
                      </h3>

                      <div className="flex items-center gap-2 text-muted">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-sm font-light truncate">
                          {event.location?.name || 'Ubicación'}
                          <span className="hidden sm:inline"> · {event.location?.address || 'Dirección'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0 self-start md:self-center">
                      <div className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-amber/10 border border-amber/20 rounded-lg sm:rounded-xl text-amber group-hover:bg-amber group-hover:text-black transition-all duration-300">
                        <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider whitespace-nowrap">
                          Ver sectores
                        </span>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                          fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-5 border border-border">
              <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-display text-xl text-white mb-2">No hay eventos disponibles</h3>
            <p className="text-muted text-sm">Volvé más tarde para ver nuevos eventos</p>
          </div>
        )}
      </div>
    </div>
  );
}