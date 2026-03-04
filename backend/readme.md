                         ┌────────────────────┐
                         │      Frontend      │
                         │       (React)      │
                         └─────────┬──────────┘
                                   │ HTTP
                                   ▼
                    ┌────────────────────────────┐
                    │       Queue Service        │
                    │  (Virtual Waiting Room)    │
                    │                            │
                    │ - Controla acceso          │
                    │ - Tiempo estimado          │
                    │ - Slots simultáneos        │
                    │ - Expiración (10 min)      │
                    └─────────┬──────────────────┘
                              │ (si autorizado)
                              ▼
                    ┌────────────────────────────┐
                    │          NGINX             │
                    │       Load Balancer        │
                    │                            │
                    │ Distribuye tráfico entre   │
                    │ múltiples instancias       │
                    └─────────┬───────────┬──────┘
                              │           │
                              ▼           ▼
                    ┌──────────────┐ ┌──────────────┐
                    │  Backend #1  │ │  Backend #2  │
                    │   (NestJS)   │ │   (NestJS)   │
                    └──────┬───────┘ └──────┬───────┘
                           │                │
                           └────────┬───────┘
                                    ▼
                          ┌────────────────┐
                          │   PostgreSQL   │
                          │ (Fuente verdad)│
                          └────────────────┘


              (Infraestructura interna del Queue Service)
                          ┌────────────────┐
                          │     Redis      │
                          │ (estado cola)  │
                          └────────────────┘


🎟️ Queue Service

-Controla cuántos usuarios pueden comprar al mismo tiempo
-Mantiene lista de espera
-Calcula tiempo estimado
-Asigna slot de 10 minutos
-Expira sesiones
-Es stateless
-Redis es la fuente de verdad

⚖️ NGINX

-Balancea tráfico
-Permite múltiples instancias backend
-Simula infraestructura real

🧠 Backend (NestJS)

-Login
-Sectores
-Stock
-Límite por usuario
-Previene overselling
-Procesa pago simulado
-Confirma compra

🗄️ PostgreSQL

-Usuarios
-Sectores
-Tickets
-Compras

🔥 Flujo Real de Compra

1. Usuario entra
2. Front llama a Queue
3. Queue decide:
    -Espera
    -Acceso concedido
4. Si pasa:
    -Front habilita compra
5. Backend:
    -Reserva stock
    -Simula pago
    -Confirma
6. DB actualiza stock



Location
   └── Event
          └── Sector
                 └── OrderItem
                        └── Ticket