"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useExperiences } from "@/hooks/useExperiences";
import { Clock, Star, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

function ExperienceCardSkeleton() {
  return (
    <div className="md-card animate-pulse">
      <div className="h-40 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export default function ExperiencesStore() {
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const {
    data: experiences,
    loading,
    totalPages,
    currentPage,
    hasNextPage,
    hasPrevPage,
    totalCount
  } = useExperiences({ page, pageSize });

  const goToPage = (newPage: number) => {
    setPage(newPage);
    // Scroll to section
    document.getElementById("experiencias")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="experiencias" className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-[var(--md-on-surface)]">
            Experiencias
          </h2>
          <p className="text-[var(--md-on-surface-medium)] mt-1">
            {totalCount} experiencias disponibles
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              {Array.from({ length: pageSize }).map((_, i) => (
                <ExperienceCardSkeleton key={i} />
              ))}
            </>
          ) : (
            experiences.map((exp) => (
              <Link
                key={exp.id}
                href={`/destinos/${exp.destinationSlug}`}
                className="md-card group transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="h-40 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${exp.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs px-2 py-1 bg-white/90 text-[var(--md-on-surface)] rounded font-medium">
                      {exp.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-sm">
                    <MapPin className="w-3 h-3" />
                    <span>{exp.destinationName}</span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-[var(--md-on-surface)] group-hover:text-[var(--md-primary)] transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-sm text-[var(--md-on-surface-medium)] mt-1 line-clamp-2">
                    {exp.description}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1 text-[var(--md-on-surface-medium)]">
                      <Clock className="w-4 h-4" />
                      <span>{exp.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <span className="text-lg font-medium text-[var(--md-primary)]">
                      {exp.priceFormatted}
                    </span>
                    <span className="text-sm text-[var(--md-primary)] font-medium">
                      Ver detalles
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={!hasPrevPage}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[var(--md-on-surface-medium)]" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === currentPage;

              // Show first, last, current and neighbors
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                Math.abs(pageNum - currentPage) <= 1
              ) {
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => goToPage(pageNum)}
                    className={`w-10 h-10 rounded-full font-medium text-sm transition-colors ${
                      isActive
                        ? "bg-[var(--md-primary)] text-white"
                        : "text-[var(--md-on-surface-medium)] hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }

              // Show ellipsis
              if (
                (pageNum === 2 && currentPage > 3) ||
                (pageNum === totalPages - 1 && currentPage < totalPages - 2)
              ) {
                return (
                  <span key={pageNum} className="px-1 text-[var(--md-on-surface-disabled)]">
                    ...
                  </span>
                );
              }

              return null;
            })}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={!hasNextPage}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[var(--md-on-surface-medium)]" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
