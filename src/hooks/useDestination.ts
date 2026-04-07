"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/supabase/client";
import { Destination } from "@/interfaces/Destination";

export default function useDestination(slug: string) {
    const [data, setData] = useState<Destination | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const { data, error } = await supabase
                    .from("destinations_wondermx")
                    .select("*")
                    .eq("slug", slug)
                    .single();

                if (error) throw error;

                setData(data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchDestination();
    }, [slug]);

    return { data, loading, error };
}