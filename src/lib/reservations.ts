import { supabase } from "@/supabase/client";

import { Reservation } from "@/hooks/useReservations";

const sampleReservations: Reservation[] = [
  {
    id: "RES-001-DEMO",
    fecha: "2024-03-15",
    personas: 4,
    nombre: "Juan Pérez",
    email: "juan@email.com",
    telefono: "+52 55 1234 5678",
    comentarios: "Celebramos un cumpleaños",
    activityTitle: "Ruta del Vino",
    destinationName: "Querétaro",
    status: "confirmed",
    createdAt: "2024-03-01T10:30:00Z",
    price: "$1,500 MXN",
  },
  {
    id: "RES-002-DEMO",
    fecha: "2024-03-18",
    personas: 2,
    nombre: "María García",
    email: "maria@email.com",
    telefono: "+52 55 9876 5432",
    comentarios: "",
    activityTitle: "Paseo en Trajinera",
    destinationName: "Xochimilco",
    status: "pending",
    createdAt: "2024-03-05T14:20:00Z",
    price: "$600 MXN",
  },
  {
    id: "RES-003-DEMO",
    fecha: "2024-03-20",
    personas: 6,
    nombre: "Carlos López",
    email: "carlos@email.com",
    telefono: "+52 55 5555 1234",
    comentarios: "Grupo de amigos, preferimos tour en español",
    activityTitle: "Monte Albán",
    destinationName: "Oaxaca",
    status: "pending",
    createdAt: "2024-03-08T09:15:00Z",
    price: "$950 MXN",
  },
  {
    id: "RES-004-DEMO",
    fecha: "2024-02-28",
    personas: 2,
    nombre: "Ana Martínez",
    email: "ana@email.com",
    telefono: "+52 55 4321 8765",
    comentarios: "",
    activityTitle: "Ruta del Mezcal",
    destinationName: "Oaxaca",
    status: "completed",
    createdAt: "2024-02-15T16:45:00Z",
    price: "$1,300 MXN",
  }
];



// /lib/reservations.ts
export async function saveReservation(reservation: any) {
  const { data, error } = await supabase
    .from("reservations_wondermx")
    .insert({
      activity_title: reservation.activityTitle,
      destination_name: reservation.destinationName,
      fecha: reservation.fecha,
      personas: Number(reservation.personas),
      nombre: reservation.nombre,
      email: reservation.email,
      telefono: reservation.telefono,
      price: reservation.price,
      comentarios: reservation.comentarios || "",
      status: "pending",
    })
    .select()
    .single(); // 🔥 importante

  if (error) {
    console.error(error);
    throw error;
  }

  return data; // 👈 ahora tienes ID y todo
}

export async function updateReservationStatus(id: string, status: string) {
  return await supabase
    .from("reservations_wondermx")
    .update({ status })
    .eq("id", id);
}

export async function deleteReservation(id: string) {
  return await supabase
    .from("reservations_wondermx")
    .delete()
    .eq("id", id);
}
