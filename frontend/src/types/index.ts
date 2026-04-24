export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  username: string;
  createdAt: string;
  lastLogin: string | null;
}

export interface AuthResponse {
  access_token: string;
}

export interface Location {
  id: number;
  name: string;
  address: string;
  maxCapacity: number;
}

export interface Sector {
  id: number;
  name: string;
  price: number;
  totalStock: number;
  soldStock: number;
  eventId: number;
}

export interface Event {
  id: number;
  name: string;
  startDate: string;
  createdAt: string;
  locationId: number;
  location: Location;
  sectors: Sector[];
}

export interface Ticket {
  id: number;
  qrCode: string;
  validated: boolean;
  createdAt: string;
  orderItemId: number;
}

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  sectorId: number;
  sector: Sector & { event: Event };
  tickets: Ticket[];
}

export interface Order {
  id: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';
  totalAmount: number;
  expiresAt: string;
  createdAt: string;
  userId: number;
  items: OrderItem[];
}

export interface PaymentResult {
  success: boolean;
  message: string;
  order?: Order;
}

export interface QueuePosition {
  position: number;
  estimatedWait: number;
}