export default function MisionSection() {
  return (
    <section className="relative min-h-[60vh] bg-[#326240]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://ext.same-assets.com/619569696/3681039266.jpeg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50" />

      <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
        {/* Mission Title with Gradient */}
        <h2 className="font-anton text-7xl md:text-9xl lg:text-[12rem] text-gradient-mission opacity-80 mb-8">
          MISIÓN
        </h2>

        {/* Mission Text */}
        <p className="text-white text-lg md:text-xl lg:text-2xl max-w-4xl leading-relaxed font-light">
          Inspirar a cada viajero a descubrir la magia de México con seguridad, comodidad y un toque de aventura. Queremos que cada experiencia sea un puente entre tu curiosidad y la riqueza cultural y natural que nos rodea.
        </p>
      </div>
    </section>
  );
}
