"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      
      <div className="flex flex-col items-center gap-4">
        
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />

        {/* Texto */}
        <p className="text-sm text-gray-600 font-medium tracking-wide">
          Cargando...
        </p>

      </div>
    </div>
  );
}