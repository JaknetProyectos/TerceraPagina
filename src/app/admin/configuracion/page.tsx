"use client";

import { useState } from "react";
import { Save, RefreshCw, Trash2 } from "lucide-react";

export default function ConfiguracionPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "Adventure Trip",
    email: "support@adventuretrip.com.mx",
    phone: "+52 55 1234 1234",
    address: "Av. México, Ciudad de México",
    currency: "MXN",
    timezone: "America/Mexico_City",
  });

  const handleSave = () => {
    // In a real app, this would save to a database
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClearReservations = () => {
    if (confirm("¿Estás seguro de eliminar TODAS las reservaciones? Esta acción no se puede deshacer.")) {
      localStorage.removeItem("adventure_trip_reservations");
      alert("Todas las reservaciones han sido eliminadas.");
      window.location.reload();
    }
  };

  const handleResetDemo = () => {
    if (confirm("¿Quieres restaurar los datos de demostración?")) {
      localStorage.removeItem("adventure_trip_reservations");
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* General Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Información General</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Sitio
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ae4e68]/20 focus:border-[#ae4e68]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email de Contacto
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ae4e68]/20 focus:border-[#ae4e68]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ae4e68]/20 focus:border-[#ae4e68]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ae4e68]/20 focus:border-[#ae4e68]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moneda
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ae4e68]/20 focus:border-[#ae4e68] bg-white"
              >
                <option value="MXN">MXN - Peso Mexicano</option>
                <option value="USD">USD - Dólar Americano</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zona Horaria
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ae4e68]/20 focus:border-[#ae4e68] bg-white"
              >
                <option value="America/Mexico_City">Ciudad de México</option>
                <option value="America/Cancun">Cancún</option>
                <option value="America/Tijuana">Tijuana</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#ae4e68] hover:bg-[#8a3d53] text-white px-6 py-2 rounded-xl font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
          {saved && (
            <span className="text-green-600 text-sm">Cambios guardados</span>
          )}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Gestión de Datos</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Restaurar Datos de Demo</p>
              <p className="text-sm text-gray-500">Elimina las reservaciones actuales y carga datos de ejemplo</p>
            </div>
            <button
              type="button"
              onClick={handleResetDemo}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Restaurar
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <p className="font-medium text-red-900">Eliminar Todas las Reservaciones</p>
              <p className="text-sm text-red-600">Esta acción no se puede deshacer</p>
            </div>
            <button
              type="button"
              onClick={handleClearReservations}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar Todo
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Nota</h3>
        <p className="text-blue-700 text-sm">
          Este panel de administración utiliza localStorage para almacenar las reservaciones.
          En una aplicación de producción, los datos se almacenarían en una base de datos segura.
        </p>
      </div>
    </div>
  );
}
