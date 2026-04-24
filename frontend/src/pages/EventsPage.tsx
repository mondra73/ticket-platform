import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Event } from '../types';
import client from '../api/client';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    client.get('/events').then((res) => {
      setEvents(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Cargando eventos...</p>;

  return (
    <div className="events-container">
      <h1>Eventos disponibles</h1>
      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card" onClick={() => navigate(`/events/${event.id}`)}>
            <h2>{event.name}</h2>
            <p>{event.location.name}</p>
            <p>{event.location.address}</p>
            <p>{new Date(event.startDate).toLocaleDateString('es-AR', {
              day: '2-digit', month: 'long', year: 'numeric'
            })}</p>
            <button>Ver sectores</button>
          </div>
        ))}
      </div>
    </div>
  );
}