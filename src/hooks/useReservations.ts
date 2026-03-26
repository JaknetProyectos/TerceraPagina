import { supabase } from "@/supabase/client";
import { useEffect, useState } from "react";

export type Reservation = {
  id: string;
  activityTitle: string;
  destinationName: string;
  fecha: string;
  personas: number;
  nombre: string;
  email: string;
  telefono: string;
  price: string;
  comentarios?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
};

export function useReservations() {
  const [data, setData] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("reservations_wondermx")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const mapped = data.map((r) => ({
      id: r.id,
      activityTitle: r.activity_title,
      destinationName: r.destination_name,
      fecha: r.fecha,
      personas: r.personas,
      nombre: r.nombre,
      email: r.email,
      telefono: r.telefono,
      price: r.price,
      comentarios: r.comentarios,
      status: r.status,
      createdAt: r.created_at,
    }));

    setData(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return { data, loading, refetch: fetchReservations };
}