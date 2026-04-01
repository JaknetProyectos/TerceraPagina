export interface Cotizacion {
  id: string;               // uuid (Primary Key)
  created_at: string;       // timestamptz
  nombre: string;           // text
  email: string;            // text
  telefono: string;         // text
  personas: string;         // text
  detalles: string | null;  // text (Opcional)
  folio: string | null;     // text (El identificador amigable)
  
  // Datos de la Experiencia
  experiencia_slug: string | null;  // slug para rutas
  experiencia_title: string | null; // Título visible para emails
  
  // Gestión de Venta
  price: number | null;     // double precision
  estado: 'pendiente' | 'confirmado' | 'pagado' | 'cancelado' | string; // text
}

// Tipo útil para la creación de nuevas cotizaciones (omite campos automáticos)
export type CreateCotizacionInput = Omit<Cotizacion, 'id' | 'created_at' | 'folio' | 'price' | 'estado'> & {
    folio?: string | null;
    price?: number | null;
    estado?: string | null;
};