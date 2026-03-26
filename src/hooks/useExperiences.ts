"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/supabase/client";
import { Experience } from "@/interfaces/Experiences";

interface UseExperiencesOptions {
  destinationSlug?: string;
  page?: number;
  pageSize?: number;
}

interface UseExperiencesResult {
  data: Experience[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function useExperiences(options: UseExperiencesOptions = {}) {
  const { destinationSlug, page = 1, pageSize = 6 } = options;

  const [data, setData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);

      try {
        let query = supabase
          .from("experiences_wondermx")
          .select("*", { count: "exact" });

        // filtro
        if (destinationSlug) {
          query = query.eq("destination_slug", destinationSlug);
        }

        // paginación
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, error, count } = await query.range(from, to);

        if (error) throw error;

        // map snake_case → camelCase
        const mapped = (data || []).map((e) => ({
          id: e.id,
          destinationSlug: e.destination_slug,
          destinationName: e.destination_name,
          title: e.title,
          description: e.description,
          duration: e.duration,
          price: e.price,
          images: e.images || [e.image],
          priceFormatted: e.price_formatted,
          image: e.image,
          category: e.category,
          rating: e.rating,
          reviewCount: e.review_count,

          caracteristicas_servicio: e?.caracteristicas_servicio || [],
          itinerario: e?.itinerario || "",
          incluido: e?.incluido || [],
          no_incluido: e?.no_incluido || [],
          accesibilidad: e?.accesibilidad || [],
          reservaciones_antelacion: e?.reservaciones_antelacion || "",
        }));

        setData(mapped);
        setTotalCount(count || 0);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [destinationSlug, page, pageSize]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data,
    loading,
    error,
    totalCount,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}