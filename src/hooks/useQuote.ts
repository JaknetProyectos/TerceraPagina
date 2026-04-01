"use client";
import { useState } from "react";
import { supabase } from "@/supabase/client";

export function useQuotes() {
    const [loading, setLoading] = useState(false);

    // CREATE
    const createQuote = async (rawForm: any) => {
        setLoading(true);
        try {
            // Mapeamos los datos del formulario Shein a las columnas de la tabla
            const dbData = {
                nombre: rawForm.nombre,
                email: rawForm.email,
                telefono: rawForm.telefono,
                personas: rawForm.personas.toString(),
                experiencia_slug: rawForm.motivo.toLowerCase().replace(/ /g, '-'),
                experience_title: rawForm.motivo,
                detalles: `Fecha Salida: ${rawForm.fechaSalida} | Regreso: ${rawForm.fechaRegreso} | Mensaje: ${rawForm.mensaje}`,
                estado: 'pendiente'
            };

            const { data, error } = await supabase
                .from("cotizaciones_wondermx")
                .insert([dbData])
                .select()
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            console.error("Error al crear cotización:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // READ (Para un panel admin futuro)
    const getQuote = async (id: string) => {
        const { data, error } = await supabase
            .from("cotizaciones_wondermx")
            .select("*")
            .eq("id", id)
            .single();
        if (error) throw error;
        return data;
    };

    // UPDATE
    const updateQuote = async (id: string, updates: any) => {
        const { data, error } = await supabase
            .from("cotizaciones_wondermx")
            .update(updates)
            .eq("id", id);
        if (error) throw error;
        return data;
    };

    // DELETE
    const deleteQuote = async (id: string) => {
        const { error } = await supabase
            .from("cotizaciones_wondermx")
            .delete()
            .eq("id", id);
        if (error) throw error;
    };

    return { createQuote, getQuote, updateQuote, deleteQuote, loading };
}