"use client";
import { useState } from "react";
import { supabase } from "@/supabase/client";
import { Cotizacion, CreateCotizacionInput } from "@/interfaces/Cotizacion";

export function useQuotes() {
    const [loading, setLoading] = useState(false);

    // CREATE
    const createQuote = async (formData: CreateCotizacionInput): Promise<Cotizacion> => {
        setLoading(true);
        try {
            // Si no viene un folio, podrías generar uno aleatorio corto aquí
            const payload = {
                ...formData
            };

            const { data, error } = await supabase
                .from("cotizaciones_wondermx")
                .insert([payload])
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

    // READ: Ahora busca por la columna FOLIO (el código que el usuario conoce)
    const getQuoteByFolio = async (folio: string): Promise<Cotizacion | null> => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("cotizaciones_wondermx")
                .select("*")
                .eq("folio", folio.trim().toUpperCase()) // Normalizamos a mayúsculas
                .single();

            if (error) return null; // Manejo silencioso si no existe
            return data;
        } catch (error) {
            console.error("Error al buscar folio:", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // UPDATE: Útil para cuando el usuario realiza un pago parcial
    const updateQuote = async (id: string, updates: any) => {
        const { data, error } = await supabase
            .from("cotizaciones_wondermx")
            .update(updates)
            .eq("id", id); // El update se sigue haciendo por ID por seguridad
        if (error) throw error;
        return data;
    };

    // READ (Para un panel admin futuro)
    const getQuote = async (id: string): Promise<Cotizacion | null> => {
        const { data, error } = await supabase
            .from("cotizaciones_wondermx")
            .select("*")
            .eq("id", id)
            .single();
        if (error) throw error;
        return data;
    };


    return { createQuote, getQuote, updateQuote, getQuoteByFolio, loading };
}