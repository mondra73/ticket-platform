# 🎫 TicketPlatform

Plataforma de venta de entradas para eventos masivos, construida como proyecto de portfolio para demostrar habilidades en arquitectura de software, sistemas distribuidos y desarrollo fullstack profesional.

---

## ¿Por qué este proyecto?

La venta de entradas para eventos masivos es uno de los escenarios más exigentes en ingeniería de software: miles de usuarios intentando comprar simultáneamente, stock limitado, pagos en tiempo real, y tolerancia cero a errores de concurrencia. Este proyecto implementa soluciones reales a esos problemas.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | NestJS 11 + TypeScript |
| Frontend | React 19 + Vite + Tailwind CSS 4 |
| Base de datos | PostgreSQL 16 + Prisma ORM |
| Caché / Colas | Redis 7 + ioredis |
| Autenticación | JWT + Passport |
| Tiempo real | WebSockets (Socket.IO) |
| Contenedores | Docker + Docker Compose |
| Asistente IA | Groq API (LLaMA 3.3 70B) |

---

## Arquitectura

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│         React + Vite + Tailwind CSS              │
│         WebSocket client (Socket.IO)             │
└─────────────────┬───────────────────────────────┘
                  │ HTTP / WebSocket
┌─────────────────▼───────────────────────────────┐
│                  Backend                         │
│              NestJS (Node.js)                    │
│   ┌──────┐ ┌───────┐ ┌────────┐ ┌──────────┐   │
│   │ Auth │ │Events │ │Orders  │ │ Payments │   │
│   └──────┘ └───────┘ └────────┘ └──────────┘   │
│   ┌──────────────────────────────────────────┐  │
│   │     Queue Service (WebSockets + Redis)   │  │
│   └──────────────────────────────────────────┘  │
└───────────────┬─────────────────┬───────────────┘
                │                 │
    ┌───────────▼──┐     ┌────────▼──────┐
    │  PostgreSQL  │     │     Redis     │
    │   (datos)    │     │  (cola/caché) │
    └──────────────┘     └───────────────┘
```

---

## Conceptos técnicos implementados

### Transacciones de base de datos
La compra de entradas ocurre dentro de una transacción PostgreSQL. Si cualquier paso falla (validación de stock, creación de tickets, actualización de stock), todo se revierte automáticamente. Esto garantiza consistencia en escenarios de alta concurrencia.

### Cola virtual con Redis y WebSockets
Cuando hay alta demanda simultánea, los usuarios entran a una cola virtual gestionada por Redis (sorted sets). El servidor notifica en tiempo real a cada cliente su posición y tiempo estimado de espera a través de WebSockets. El frontend incluye un simulador que permite generar hasta 1.000.000 de usuarios virtuales en cola para demostrar el comportamiento del sistema bajo carga.

### Sistema de pagos simulado
El módulo de pagos implementa el flujo completo de procesamiento: validación de orden, verificación de expiración, simulación de aprobación/rechazo con lógica determinista (tarjetas `0000*` siempre rechazadas) y aleatoria (10% de rechazo general). Los datos de tarjeta son ficticios — ningún cobro real es posible.

### Autenticación con JWT y Guards
Los endpoints protegidos usan Guards de NestJS con estrategia Passport JWT. El token se valida antes de que la request llegue al controller, siguiendo el patrón de separación de responsabilidades de NestJS.

### Expiración de órdenes
Cada orden tiene un TTL de 10 minutos. Si el usuario no completa el pago en ese tiempo, la orden expira automáticamente y el stock se libera.

### Asistente virtual IA
El proyecto incluye un asistente técnico potenciado por LLaMA 3.3 70B (Groq) que responde preguntas sobre la arquitectura, decisiones técnicas y funcionamiento del sistema. Está pensado para que reclutadores puedan explorar el proyecto interactivamente.

---

## Módulos del backend

```
src/modules/
├── auth/        → Registro, login, JWT strategy, Guards
├── event/       → CRUD de eventos con locaciones
├── location/    → Estadios y venues con capacidad
├── sector/      → Sectores por evento (VIP, Campo, Tribuna)
├── order/       → Órdenes con transacciones y expiración
├── payment/     → Simulador de procesamiento de pagos
├── queue/       → Cola virtual Redis + Gateway WebSocket
└── chat/        → Asistente IA con Groq
```

---

## Levantar el proyecto

### Requisitos
- Docker y Docker Compose instalados
- Node.js 20+ (solo para desarrollo local)

### Con Docker (recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/mondra73/ticket-platform.git
cd ticket-platform/backend

# Crear el archivo de variables de entorno
cp .env.example .env
# Editar .env y agregar GROQ_API_KEY

# Levantar todos los servicios
docker compose up --build

# En otra terminal, aplicar las migraciones
docker exec tickets_backend npx prisma migrate deploy

# Cargar datos de prueba
docker exec tickets_backend npx ts-node prisma/seed.ts
```

La API estará disponible en `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

### Variables de entorno

```env
DATABASE_URL=postgresql://postgres:root@localhost:5432/tickets_db?schema=public
JWT_SECRET=tu_clave_secreta
REDIS_URL=redis://localhost:6379
GROQ_API_KEY=tu_api_key_de_groq
```

---

## Endpoints principales

### Auth
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register` | Registro de usuario |
| POST | `/auth/login` | Login, devuelve JWT |

### Eventos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/events` | Lista todos los eventos |
| GET | `/sectors/event/:id` | Sectores de un evento |

### Compra
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/orders` | Crear orden de compra | ✓ |
| GET | `/orders/my-orders` | Historial del usuario | ✓ |
| POST | `/payments` | Procesar pago | ✓ |

### WebSocket events
| Evento (emit) | Descripción |
|--------------|-------------|
| `join_queue` | Unirse a la cola virtual |
| `leave_queue` | Salir de la cola |
| `simulate_load` | Simular N usuarios en cola |

| Evento (on) | Descripción |
|------------|-------------|
| `queue_position` | Tu posición actual en la cola |
| `queue_update` | Total de usuarios en cola |
| `simulation_done` | Simulación completada |

---

## Simulador de carga

El frontend incluye un panel donde podés simular hasta **1.000.000 de usuarios** intentando comprar entradas simultáneamente. Esto permite visualizar:

- El sistema de cola virtual en acción
- La distribución de posiciones en Redis
- Las actualizaciones en tiempo real via WebSocket
- El comportamiento del backend bajo alta demanda

---

## Decisiones de diseño

**¿Por qué NestJS y no Express puro?**
NestJS provee una arquitectura modular con inyección de dependencias, decoradores y separación clara entre controllers, services y modules. Esto facilita el testing, el mantenimiento y escala mejor en equipos.

**¿Por qué Redis para la cola y no una tabla en PostgreSQL?**
Redis opera en memoria con operaciones O(log N) en sorted sets, lo que lo hace ideal para gestionar posiciones en una cola con alta frecuencia de lectura/escritura. PostgreSQL hubiera generado contención de locks bajo alta carga.

**¿Por qué Prisma y no un ORM más tradicional?**
Prisma ofrece type-safety completo, migraciones declarativas y una DX superior. El cliente generado elimina una clase entera de errores de tipo en tiempo de compilación.

---

## Autor

Desarrollado por **Javier Espinosa** como proyecto de portfolio fullstack.

[![GitHub](https://img.shields.io/badge/GitHub-mondra73-black?style=flat&logo=github)](https://github.com/mondra73)