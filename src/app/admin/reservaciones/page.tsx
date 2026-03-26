"use client";

import { useState } from "react";
import {
  Search,
  MoreVertical,
  Eye,
  Trash2,
  Users,
  X,
  Mail,
  Phone,
  Calendar,
  MapPin,
} from "lucide-react";

import { useReservations, type Reservation } from "@/hooks/useReservations";
import {
  updateReservationStatus,
  deleteReservation,
} from "@/lib/reservations";
import Loading from "@/components/Loading";

export default function ReservacionesPage() {
  const { data: reservations, loading, refetch } = useReservations();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // 🔍 Filtros
  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.activityTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 🎨 UI helpers
  const getStatusColor = (status: Reservation["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: Reservation["status"]) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "confirmed":
        return "Confirmada";
      case "completed":
        return "Completada";
      case "cancelled":
        return "Cancelada";
      default:
        return status;
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-MX");

  // 🔄 Acciones
  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar reservación?")) {
      await deleteReservation(id);
      refetch();
    }
  };

  const handleStatusChange = async (
    id: string,
    status: Reservation["status"]
  ) => {
    await updateReservationStatus(id, status);
    refetch();
    setActionMenuId(null);
  };

  // ⏳ Loading
  if (loading) {
    return <Loading />
  }

  return (
    <div className="space-y-6 pb-10">

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl border flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 rounded-lg"
        >
          <option value="all">Todos</option>
          <option value="pending">Pendientes</option>
          <option value="confirmed">Confirmadas</option>
          <option value="completed">Completadas</option>
          <option value="cancelled">Canceladas</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="p-4 text-left">Cliente</th>
              <th className="p-4 text-left">Actividad</th>
              <th className="p-4 text-left">Fecha</th>
              <th className="p-4 text-left">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filteredReservations.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <div>
                    <p className="font-semibold">{r.nombre}</p>
                    <p className="text-xs text-gray-400">{r.email}</p>
                  </div>
                </td>

                <td className="p-4">
                  <p>{r.activityTitle}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {r.destinationName}
                  </p>
                </td>

                <td className="p-4">{formatDate(r.fecha)}</td>

                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-xs rounded ${getStatusColor(
                      r.status
                    )}`}
                  >
                    {getStatusLabel(r.status)}
                  </span>
                </td>

                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setSelectedReservation(r)}>
                      <Eye className="w-5 h-5" />
                    </button>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setActionMenuId(
                            actionMenuId === r.id ? null : r.id
                          )
                        }
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {actionMenuId === r.id && (
                        <div className="absolute right-0 mt-2 bg-white border rounded shadow-md z-10">
                          <button
                            onClick={() =>
                              handleStatusChange(r.id, "confirmed")
                            }
                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(r.id, "cancelled")
                            }
                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}

            {filteredReservations.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-400">
                  No hay reservaciones
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal detalle */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4 relative">
            <button
              onClick={() => setSelectedReservation(null)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <h3 className="text-lg font-bold">Detalle</h3>

            <div className="space-y-2 text-sm">
              <p>
                <Users className="inline w-4 h-4 mr-2" />
                {selectedReservation.nombre}
              </p>
              <p>
                <Mail className="inline w-4 h-4 mr-2" />
                {selectedReservation.email}
              </p>
              <p>
                <Phone className="inline w-4 h-4 mr-2" />
                {selectedReservation.telefono}
              </p>
              <p>
                <Calendar className="inline w-4 h-4 mr-2" />
                {formatDate(selectedReservation.fecha)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}