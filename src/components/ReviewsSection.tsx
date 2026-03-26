"use client";

import { Star } from "lucide-react";

interface Review {
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  activity: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
  destinationName: string;
}

export default function ReviewsSection({ reviews, destinationName }: ReviewsSectionProps) {
  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <section className="bg-gradient-to-b from-[#2a3677] to-[#1f1e58] py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-anton text-[#e8e0c6] text-4xl md:text-5xl mb-4">
            Reseñas de Viajeros
          </h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-white/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-white font-semibold text-xl">{averageRating.toFixed(1)}</span>
          </div>
          <p className="text-white/60">
            Basado en {reviews.length} reseñas de viajeros a {destinationName}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={`${review.name}-${index}`}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#ae4e68] flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                  {review.avatar ? (
                    <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                  ) : (
                    review.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{review.name}</h4>
                  <p className="text-white/50 text-sm">{review.date}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-white/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[#ae4e68] text-sm font-medium">{review.activity}</span>
              </div>

              {/* Comment */}
              <p className="text-white/80 leading-relaxed">
                "{review.comment}"
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-white/60 mb-4">¿Ya visitaste {destinationName}?</p>
          <button
            type="button"
            className="border-2 border-[#ae4e68] text-[#ae4e68] hover:bg-[#ae4e68] hover:text-white px-8 py-3 rounded-full font-semibold transition-colors"
          >
            Deja tu Reseña
          </button>
        </div>
      </div>
    </section>
  );
}
