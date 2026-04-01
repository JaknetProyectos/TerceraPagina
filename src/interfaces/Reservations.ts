export interface Reservation {
  id: string;
  fecha: string;
  personas: string;
  nombre: string;
  email: string;
  telefono: string;
  comentarios: string;
  activityTitle: string;
  destinationName: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  price: string;
  activity_title?: string;
}