export interface CartItem {
  experienceId: string; // 🔥 clave real
  title: string;
  destinationName: string;
  price: number;

  // opcional (si ya lo eligieron)
  fecha?: string;
  personas?: number;
}