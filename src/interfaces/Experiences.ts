export interface Experience {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  priceFormatted?: string;
  images: string[];
  image: string;
  category: string;
  caracteristicas_servicio?: string[];
  itinerario?: string;
  incluido?: string[];
  no_incluido?: string[];
  accesibilidad?: string[];
  reservaciones_antelacion?: string;

  // Propiedades sin uso
  rating?: number;
  destinationSlug?: string;
  destinationName?: string;
  reviewCount: number;
}