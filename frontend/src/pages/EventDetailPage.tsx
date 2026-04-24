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

  const handleSelectSector = (sectorId: number) => {
    navigate(`/checkout/${sectorId}`);
  };

  if (loading) return <p>Cargando...</p>;
  if (!event) return <p>Evento no encontrado</p>;

  return (
    <div className="event-detail-container">
      <h1>{event.name}</h1>
      <p>{event.location.name} — {event.location.address}</p>
      <p>{new Date(event.startDate).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })}</p>
      <h2>Sectores disponibles</h2>
      <div className="sectors-grid">
        {event.sectors.map((sector) => {
          const available = sector.totalStock - sector.soldStock;
          return (
            <div key={sector.id} className="sector-card">
              <h3>{sector.name}</h3>
              <p>Precio: ${sector.price}</p>
              <p>Disponibles: {available}</p>
              <button
                disabled={available === 0}
                onClick={() => handleSelectSector(sector.id)}
              >
                {available === 0 ? 'Agotado' : 'Comprar'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}