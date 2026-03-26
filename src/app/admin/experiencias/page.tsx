"use client";

import { useState } from "react";
import { useAdminExperiences } from "@/hooks/useAdminExperiences";
import { useAdminDestinations } from "@/hooks/useAdminDestinations";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import Loading from "@/components/Loading";

export default function Page() {
    const { data, loading, create, update, remove } =
        useAdminExperiences();

    const { data: destinations } = useAdminDestinations();

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [confirmId, setConfirmId] = useState<string | null>(null);

    // 🧠 helpers sólidos
    const safeString = (value: any) => {
        if (Array.isArray(value)) return value.join("\n");
        if (typeof value === "string") return value;
        return "";
    };

    const toArray = (value: any) => {
        if (!value) return [];
        if (Array.isArray(value)) return value;

        if (typeof value === "string") {
            return value
                .split("\n")
                .map((i) => i.trim())
                .filter(Boolean);
        }

        return [];
    };

    // 🧾 FORM (solo strings)
    const [form, setForm] = useState<any>({
        title: "",
        destination_slug: "",
        destination_name: "",
        description: "",
        duration: "",
        price: "",
        image: "",
        images: "",
        category: "",

        caracteristicas_servicio: "",
        itinerario: "",
        incluido: "",
        no_incluido: "",
        accesibilidad: "",
        reservaciones_antelacion: "",
    });

    const resetForm = () => {
        setForm({
            title: "",
            destination_slug: "",
            destination_name: "",
            description: "",
            duration: "",
            price: "",
            image: "",
            images: "",
            category: "",
            caracteristicas_servicio: "",
            incluido: "",
            no_incluido: "",
            accesibilidad: "",
            itinerario: "",
            reservaciones_antelacion: "",
        });
    };

    const handleCreate = () => {
        setEditing(null);
        resetForm();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditing(null);
        resetForm();
    };

    const isValid =
        form.title &&
        form.destination_slug &&
        form.description &&
        form.price;

    const handleSubmit = async () => {
        const price = Number(form.price);

        const payload = {
            id: editing?.id || crypto.randomUUID(),

            title: form.title,
            destination_slug: form.destination_slug,
            destination_name: form.destination_name,
            description: form.description,
            duration: form.duration,
            category: form.category,

            price,
            price_formatted: `$${price} MXN`,

            image: form.image,

            // 🔥 arrays limpios
            images: toArray(form.images),
            caracteristicas_servicio: toArray(form.caracteristicas_servicio),
            incluido: toArray(form.incluido),
            no_incluido: toArray(form.no_incluido),
            accesibilidad: toArray(form.accesibilidad),

            itinerario: form.itinerario || "",
            reservaciones_antelacion: form.reservaciones_antelacion || "",

            rating: 4.5,
            review_count: 0,
        };

        if (editing) {
            await update(editing.id, payload);
        } else {
            await create(payload);
        }

        handleClose();
    };

    if (loading) return <Loading />;

    return (
        <>
            {/* FAB */}
            <button
                onClick={handleCreate}
                className="fixed bottom-6 right-6 z-50 bg-black text-white p-4 rounded-xl shadow-lg hover:scale-105 transition flex gap-2"
            >
                <Plus /> Agregar experiencia
            </button>

            <div className="space-y-6">
                {/* LISTA */}
                <div className="bg-white rounded-xl shadow divide-y">
                    {data.map((exp) => (
                        <div
                            key={exp.id}
                            className="p-4 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-semibold">{exp.title}</p>
                                <p className="text-sm text-gray-500">
                                    {exp.destination_name}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setEditing(exp);

                                        setForm({
                                            title: exp.title || "",
                                            destination_slug: exp.destination_slug || "",
                                            destination_name: exp.destination_name || "",
                                            description: exp.description || "",
                                            duration: exp.duration || "",
                                            price: exp.price?.toString() || "",
                                            image: exp.image || "",
                                            category: exp.category || "",

                                            images: safeString(exp.images),
                                            caracteristicas_servicio: safeString(
                                                exp.caracteristicas_servicio
                                            ),
                                            incluido: safeString(exp.incluido),
                                            no_incluido: safeString(exp.no_incluido),
                                            accesibilidad: safeString(exp.accesibilidad),

                                            itinerario: exp.itinerario || "",
                                            reservaciones_antelacion:
                                                exp.reservaciones_antelacion || "",
                                        });

                                        setOpen(true);
                                    }}
                                >
                                    <Pencil size={20} />
                                </button>

                                <button onClick={() => setConfirmId(exp.id)}>
                                    <Trash2 size={20} className="text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* MODAL */}
                {open && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg max-h-[90vh] overflow-y-auto p-6 space-y-6">

                            {/* HEADER */}
                            <div className="flex justify-between">
                                <h3 className="text-lg font-semibold">
                                    {editing ? "Editar" : "Nueva"} experiencia
                                </h3>
                                <button onClick={handleClose}>
                                    <X />
                                </button>
                            </div>

                            {/* INFO */}
                            <input
                                placeholder="Título"
                                className="w-full border p-2 rounded"
                                value={form.title}
                                onChange={(e) =>
                                    setForm({ ...form, title: e.target.value })
                                }
                            />

                            <textarea
                                placeholder="Descripción"
                                className="w-full border p-2 rounded"
                                value={form.description}
                                onChange={(e) =>
                                    setForm({ ...form, description: e.target.value })
                                }
                            />

                            <input
                                placeholder="Duración"
                                className="w-full border p-2 rounded"
                                value={form.duration}
                                onChange={(e) =>
                                    setForm({ ...form, duration: e.target.value })
                                }
                            />

                            <input
                                type="number"
                                placeholder="Precio"
                                className="w-full border p-2 rounded"
                                value={form.price}
                                onChange={(e) =>
                                    setForm({ ...form, price: e.target.value })
                                }
                            />

                            <select
                                className="w-full border p-2 rounded"
                                value={form.destination_slug}
                                onChange={(e) => {
                                    const dest = destinations.find(
                                        (d) => d.slug === e.target.value
                                    );
                                    setForm({
                                        ...form,
                                        destination_slug: e.target.value,
                                        destination_name: dest?.name || "",
                                    });
                                }}
                            >
                                <option value="">Seleccionar destino</option>
                                {destinations?.map((d) => (
                                    <option key={d.slug} value={d.slug}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                placeholder="Imagen principal"
                                className="w-full border p-2 rounded"
                                value={form.image}
                                onChange={(e) =>
                                    setForm({ ...form, image: e.target.value })
                                }
                            />

                            <textarea
                                placeholder="Imágenes (1 por línea)"
                                className="w-full border p-2 rounded"
                                value={form.images}
                                onChange={(e) =>
                                    setForm({ ...form, images: e.target.value })
                                }
                            />

                            {/* ARRAYS */}
                            {[
                                ["caracteristicas_servicio", "Características"],
                                ["incluido", "Incluido"],
                                ["no_incluido", "No incluido"],
                                ["accesibilidad", "Accesibilidad"],
                            ].map(([field, label]) => (
                                <textarea
                                    key={field}
                                    placeholder={`${label} (1 por línea)`}
                                    className="w-full border p-2 rounded"
                                    value={form[field]}
                                    onChange={(e) =>
                                        setForm({ ...form, [field]: e.target.value })
                                    }
                                />
                            ))}

                            <textarea
                                placeholder="Itinerario"
                                className="w-full border p-2 rounded"
                                value={form.itinerario}
                                onChange={(e) =>
                                    setForm({ ...form, itinerario: e.target.value })
                                }
                            />

                            <input
                                placeholder="Reservación con anticipación"
                                className="w-full border p-2 rounded"
                                value={form.reservaciones_antelacion}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        reservaciones_antelacion: e.target.value,
                                    })
                                }
                            />

                            <button
                                disabled={!isValid}
                                onClick={handleSubmit}
                                className="w-full bg-black text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                            >
                                {editing ? "Actualizar" : "Crear"}
                            </button>
                        </div>
                    </div>
                )}

                {/* DELETE */}
                {confirmId && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-xl space-y-4">
                            <p>¿Eliminar experiencia?</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={async () => {
                                        await remove(confirmId);
                                        setConfirmId(null);
                                    }}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Eliminar
                                </button>

                                <button onClick={() => setConfirmId(null)}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}