"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useExperiences } from "@/hooks/useExperiences";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import Loading from "@/components/Loading";

export default function ExperiencesPage() {
    const params = useParams();
    const [page, setPage] = useState(1);

    const {
        data,
        loading,
        error,
        currentPage,
        totalPages,
        hasNextPage,
        hasPrevPage,
    } = useExperiences({
        page,
        pageSize: 9,
    });

    if (loading) {
        return <Loading/>
    }

    if (error) {
        return (
            <div className="p-10 text-center text-red-500">
                Error: {error.message}
            </div>
        );
    }

    return (
        <>
            <Header />
            <section className="min-h-screen bg-background pt-10">
                <div className="container mx-auto px-4 py-12">
                    {/* Título */}
                    <h1 className="text-3xl font-bold mb-8 capitalize">
                        Experiencias
                    </h1>

                    {/* Grid */}
                    <div className="grid md:grid-cols-2 rounded-xl lg:grid-cols-3 gap-6">
                        {data.map((exp) => (
                            <Link
                                key={exp.id}
                                href={`/experiencias/${exp.id}`}
                                className="border rounded-xl overflow-hidden transition"
                            >
                                <div className="rounded-md shadow-md">
                                    {/* Imagen */}
                                    <div
                                        className="min-h-64 max-h-80 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${exp.image})` }}
                                    />

                                    {/* Contenido */}
                                    <div className="p-4">
                                        <h2 className="text-lg font-semibold">{exp.title}</h2>

                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                            {exp.description}
                                        </p>

                                        <div className="flex flex-col py-4 items-center mt-3 text-sm">
                                            <p>
                                                <span className="font-semibold">
                                                    {exp.priceFormatted}
                                                </span> IVA (16%) incluido
                                            </p>
                                        </div>

                                        <button
                                            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition mb-3"
                                        >
                                            Reservar ahora
                                        </button>


                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Empty state */}
                    {data.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            No hay experiencias para este destino
                        </div>
                    )}

                    {/* Paginación (simple por ahora) */}
                    <div className="flex justify-center gap-4 mt-10">
                        <button
                            disabled={!hasPrevPage}
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                setPage((prev) => Math.max(prev - 1, 1))
                            }
                            }
                            className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
                        >
                            Anterior
                        </button>

                        <span className="text-sm text-gray-600">
                            Página {currentPage} de {totalPages}
                        </span>

                        <button
                            disabled={!hasNextPage}
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                setPage((prev) => prev + 1)
                            }
                            }
                            className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}