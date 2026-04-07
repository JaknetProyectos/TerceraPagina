"use client";

import { useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useExperiences } from "@/hooks/useExperiences";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import Loading from "@/components/Loading";
import { formatPriceWithDecimals } from "@/lib/price";
import { useTranslations } from "next-intl";

export default function ExperiencesPage() {
    const t = useTranslations("ExperiencesPage");
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
        return <Loading />
    }

    if (error) {
        return (
            <div className="p-10 text-center text-red-500">
                {t("error")}: {error.message}
            </div>
        );
    }

    return (
        <>
            <Header />
            <section className="min-h-screen bg-background pt-10">
                <div className="container mx-auto px-4 py-12">
                    {/* Título */}
                    <h1 className="text-5xl py-6 mt-10 text-center font-bold mb-8 capitalize">
                        {t("main_title")}
                    </h1>

                    {/* Grid */}
                    <div className="grid md:grid-cols-2 rounded-xl lg:grid-cols-3 gap-6">
                        {data.map((exp) => (
                            <Link
                                key={exp.id}
                                href={`/experiencias/${exp.id}`}
                                className="border rounded-xl overflow-hidden transition hover:shadow-lg"
                            >
                                <div className="rounded-md">
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
                                                    MXN $ {formatPriceWithDecimals(exp.price)}
                                                </span> {t("tax_included")}
                                            </p>
                                        </div>

                                        <div className="w-full bg-black text-white py-3 rounded-xl font-semibold text-center hover:opacity-90 transition mb-3">
                                            {t("book_now")}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Empty state */}
                    {data.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            {t("no_results")}
                        </div>
                    )}

                    {/* Paginación */}
                    <div className="flex justify-center gap-4 mt-10 items-center">
                        <button
                            disabled={!hasPrevPage}
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                setPage((prev) => Math.max(prev - 1, 1))
                            }}
                            className="px-4 py-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100 transition"
                        >
                            {t("pagination.prev")}
                        </button>

                        <span className="text-sm text-gray-600">
                            {t("pagination.page")} {currentPage} {t("pagination.of")} {totalPages}
                        </span>

                        <button
                            disabled={!hasNextPage}
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                setPage((prev) => prev + 1)
                            }}
                            className="px-4 py-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100 transition"
                        >
                            {t("pagination.next")}
                        </button>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}