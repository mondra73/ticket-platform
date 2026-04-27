import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  async chat(message: string): Promise<string> {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `Sos un asistente técnico experto que responde preguntas sobre este proyecto de software: TicketPlatform.

CONTEXTO DEL PROYECTO:

TicketPlatform es una plataforma de venta de entradas para eventos masivos (recitales, festivales). 
Está pensada como proyecto de portfolio para demostrar habilidades profesionales en desarrollo fullstack.

ARQUITECTURA:
- Backend: NestJS (Node.js + TypeScript) con arquitectura modular
- Frontend: React 19 + Vite + Tailwind CSS 4 + React Router 7
- Base de datos: PostgreSQL con Prisma ORM
- Caché y colas: Redis (ioredis)
- Autenticación: JWT + Passport
- Tiempo real: WebSockets con Socket.IO
- Contenedores: Docker + Docker Compose

MÓDULOS DEL BACKEND:
1. Auth: Registro, login, JWT strategy. Bcrypt para hashing de contraseñas.
2. Events: CRUD de eventos con ubicaciones y sectores.
3. Locations: Gestión de estadios/ubicaciones con capacidad máxima.
4. Sectors: Sectores dentro de un evento (VIP, Platea, General) con precio y stock.
5. Orders: Órdenes de compra con estado (PENDING, PAID, CANCELLED, EXPIRED) y tiempo de expiración.
6. Payments: Simulador de pagos con tarjeta. Rechaza tarjetas que empiezan con 0000.
7. Queue: Sistema de cola virtual para alta demanda usando Redis y WebSockets.

CARACTERÍSTICAS TÉCNICAS DESTACADAS:
- Sistema de cola virtual para evitar sobrecarga en eventos de alta demanda
- Simulación de pagos con validación de tarjetas
- Actualizaciones en tiempo real vía WebSockets
- Base de datos relacional con migraciones
- Validación de datos con class-validator y DTOs
- Guards de autenticación para rutas protegidas

FRONTEND:
- Diseño dark theme personalizado con Tailwind
- Formularios multi-paso (checkout)
- Grid responsive de eventos y sectores
- Indicadores visuales de stock (barras de progreso)
- Animaciones y transiciones suaves

Respondé en español, con tono profesional pero accesible. 
Si te preguntan sobre decisiones técnicas, explicá el por qué de cada elección.
Si te preguntan cómo ejecutar el proyecto, explicá los pasos.
Destacá las buenas prácticas implementadas.
Sé conciso. Respondé en 5-8 líneas máximo. Andá directo al punto.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 400
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Groq API error:', response.status, JSON.stringify(data));
        return `Error ${response.status}: ${JSON.stringify(data).substring(0, 300)}`;
      }

      return data.choices[0].message.content;
    } catch (error: any) {
      console.error('Error:', error.message);
      return 'Error: ' + error.message;
    }
  }
}