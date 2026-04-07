import { supabase } from "@/supabase/client";
import { useState, useEffect } from "react";
import { Experience } from "@/interfaces/Experiences";

export function useExperience(id: string) {
    const [data, setData] = useState<Experience | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const { data, error } = await supabase
                    .from("experiences_wondermx")
                    .select("*")
                    .eq("id", id)
                    .maybeSingle();

                console.log(id)

                if (error) throw error;

                const mapped = {
                    id: data.id,
                    destinationSlug: data.destination_slug,
                    destinationName: data.destination_name,
                    title: data.title,
                    description: data.description,
                    duration: data.duration,
                    price: data.price,
                    priceFormatted: data.price_formatted,
                    image: data.image,
                    category: data.category,
                    images: data.images,
                    rating: data.rating,
                    reviewCount: data.review_count,
                    
                    caracteristicas_servicio: data?.caracteristicas_servicio || [],
                    itinerario: data?.itinerario || "",
                    incluido: data?.incluido || [],
                    no_incluido: data?.no_incluido || [],
                    accesibilidad: data?.accesibilidad || [],
                    reservaciones_antelacion: data?.reservaciones_antelacion || "",
                };

                setData(mapped);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperience();
    }, [id]);

    return { data, loading, error };
}