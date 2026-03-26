"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Destination {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  hero_image: string;
  card_image: string;
  highlights: string[];
  bg_color: string;
}

export default function DestinosAdminPage() {
  const [data, setData] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Destination | null>(null);

  const [form, setForm] = useState<Partial<Destination>>({
    highlights: [],
  });

  // 🔥 LOAD
  const load = async () => {
    const { data } = await supabase.from("destinations_wondermx").select("*");
    setData(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // 🔥 SAVE
  const handleSave = async () => {
    const payload = {
      ...form,
      highlights: form.highlights || [],
    };

    if (editing) {
      await supabase
        .from("destinations_wondermx")
        .update(payload)
        .eq("id", editing.id);
    } else {
      await supabase.from("destinations_wondermx").insert({
        ...payload,
        id: crypto.randomUUID(),
      });
    }

    setOpen(false);
    setEditing(null);
    setForm({ highlights: [] });
    load();
  };

  // 🔥 DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar destino?")) return;

    await supabase.from("destinations_wondermx").delete().eq("id", id);
    load();
  };

  // 🔥 EDIT
  const handleEdit = (d: Destination) => {
    setEditing(d);
    setForm(d);
    setOpen(true);
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-black text-white p-4 rounded-xl shadow-lg hover:scale-105 transition flex gap-2"
      >
        <Plus /> Agregar categoria
      </button>


      <div className="space-y-6">



        {/* LIST */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((d) => (
            <div key={d.id} className="border rounded-xl overflow-hidden bg-white">
              <img src={d.card_image} className="h-40 w-full object-cover" />

              <div className="p-4 space-y-2">
                <h3 className="font-bold">{d.name}</h3>
                <p className="text-sm text-gray-500">{d.short_description}</p>

                <div className="flex flex-wrap gap-1">
                  {d.highlights?.map((h) => (
                    <span key={h} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {h}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-3">
                  <button onClick={() => handleEdit(d)}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(d.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🔥 MODAL */}
        {open && (
          <div className="fixed inset-0 rounded-xl bg-black/50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-xl space-y-4">
              <div className="flex justify-between">
                <h2 className="font-bold">
                  {editing ? "Editar destino" : "Nuevo destino"}
                </h2>
                <button onClick={() => setOpen(false)}>
                  <X />
                </button>
              </div>

              {/* FORM */}
              <input
                placeholder="Nombre"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border p-2 rounded"
              />

              <input
                placeholder="Slug"
                value={form.slug || ""}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full border p-2 rounded"
              />

              <input
                placeholder="Short description"
                value={form.short_description || ""}
                onChange={(e) =>
                  setForm({ ...form, short_description: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <textarea
                placeholder="Descripción"
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                placeholder="Hero image URL"
                value={form.hero_image || ""}
                onChange={(e) =>
                  setForm({ ...form, hero_image: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                placeholder="Card image URL"
                value={form.card_image || ""}
                onChange={(e) =>
                  setForm({ ...form, card_image: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                placeholder="Color (hex)"
                value={form.bg_color || ""}
                onChange={(e) =>
                  setForm({ ...form, bg_color: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              {/* 🔥 highlights array */}
              <input
                placeholder="Highlights separados por coma"
                value={form.highlights?.join(",") || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    highlights: e.target.value.split(",").map((h) => h.trim()),
                  })
                }
                className="w-full border p-2 rounded"
              />

              <button
                onClick={handleSave}
                className="w-full bg-black rounded-xl text-white py-2"
              >
                Guardar
              </button>
            </div>
          </div>
        )}
      </div>

    </>
  );
}