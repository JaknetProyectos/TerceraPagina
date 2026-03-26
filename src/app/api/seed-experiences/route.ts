import { Experience } from "@/interfaces/Experiences";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
    try {
        const { data: existing, error: selectError } = await supabase
            .from("experiences_wondermx")
            .select("*");

        if (selectError) {
            console.error(selectError);
            return Response.json({ error: selectError.message }, { status: 500 });
        }

        if (!existing || existing.length === 0) {
            const { error: insertError } = await supabase
                .from("experiences_wondermx")
                .insert([
                    {
                        id: "vasconcelos-library",
                        title: "Architecture and Silence: Experience in the Vasconcelos Library",
                        description: "Explore one of the most iconic libraries in Mexico City through an immersive architectural and cultural experience.",
                        duration: "2-3 hours",
                        price: 980,
                        price_formatted: "$980.00 MXN",
                        images: [
                            "https://ournexttrip.com.mx/wp-content/uploads/2026/02/Vasconcelos-1-300x300.jpg"
                        ],
                        image: "https://ournexttrip.com.mx/wp-content/uploads/2026/02/Vasconcelos-1-300x300.jpg",
                        category: "cdmx",
                        caracteristicas_servicio: ["Guía especializado", "Entrada incluida", "Experiencia cultural"],
                        itinerario: "Recorrido guiado por la biblioteca, explicación arquitectónica y tiempo libre para explorar.",
                        incluido: ["Guía", "Acceso"],
                        no_incluido: ["Transporte", "Alimentos"],
                        accesibilidad: ["Acceso para silla de ruedas"],
                        reservaciones_antelacion: "24 horas",
                        review_count: 12
                    },
                    {
                        id: "africam-safari",
                        title: "Wild Adventure: Private Experience in Africam Safari",
                        description: "Private safari experience with close encounters with wildlife in Puebla.",
                        duration: "5-6 hours",
                        price: 6200,
                        price_formatted: "$6,200.00 MXN",
                        images: [
                            "https://ournexttrip.com.mx/wp-content/uploads/2026/02/africam-2-300x300.jpg"
                        ],
                        image: "https://ournexttrip.com.mx/wp-content/uploads/2026/02/africam-2-300x300.jpg",
                        category: "puebla",
                        caracteristicas_servicio: ["Experiencia privada", "Safari guiado"],
                        itinerario: "Recorrido en vehículo por el safari con guía especializado.",
                        incluido: ["Entrada", "Guía"],
                        no_incluido: ["Comida"],
                        accesibilidad: ["No accesible"],
                        reservaciones_antelacion: "48 horas",
                        review_count: 30
                    },
                    {
                        id: "azcapotzalco-food",
                        title: "Secret Azcapotzalco: A Journey to the Roots of the Taste",
                        description: "Discover hidden culinary gems in one of Mexico City's most authentic neighborhoods.",
                        duration: "3-4 hours",
                        price: 3450,
                        price_formatted: "$3,450.00 MXN",
                        images: [
                            "https://ournexttrip.com.mx/wp-content/uploads/2026/02/5-1-300x300.png"
                        ],
                        image: "https://ournexttrip.com.mx/wp-content/uploads/2026/02/5-1-300x300.png",
                        category: "cdmx",
                        caracteristicas_servicio: ["Tour gastronómico", "Degustaciones"],
                        itinerario: "Visita a mercados locales y restaurantes tradicionales.",
                        incluido: ["Degustaciones", "Guía"],
                        no_incluido: ["Bebidas extra"],
                        accesibilidad: ["Limitada"],
                        reservaciones_antelacion: "24 horas",
                        review_count: 18
                    },
                    {
                        id: "ballet-bellas-artes",
                        title: "Folkloric Ballet in Fine Arts",
                        description: "Experience Mexico's rich cultural heritage through a live folkloric ballet performance.",
                        duration: "2 hours",
                        price: 3690,
                        price_formatted: "$3,690.00 MXN",
                        images: [
                            "https://ournexttrip.com.mx/wp-content/uploads/2026/02/Bellas-artes-3-300x300.jpg"
                        ],
                        image: "https://ournexttrip.com.mx/wp-content/uploads/2026/02/Bellas-artes-3-300x300.jpg",
                        category: "cdmx",
                        caracteristicas_servicio: ["Entrada al espectáculo"],
                        itinerario: "Asistencia al espectáculo en Bellas Artes.",
                        incluido: ["Boletos"],
                        no_incluido: ["Transporte"],
                        accesibilidad: ["Accesible"],
                        reservaciones_antelacion: "72 horas",
                        review_count: 25
                    },
                    {
                        id: "cabo-whales",
                        title: "Cape: Whales and Luxury",
                        description: "Luxury experience in Los Cabos including whale watching.",
                        duration: "Full day",
                        price: 6850,
                        price_formatted: "$6,850.00 MXN",
                        images: [
                            "https://ournexttrip.com.mx/wp-content/uploads/2026/02/Ballenas-cabo-300x300.jpg"
                        ],
                        image: "https://ournexttrip.com.mx/wp-content/uploads/2026/02/Ballenas-cabo-300x300.jpg",
                        category: "baja-california-sur",
                        caracteristicas_servicio: ["Tour premium", "Avistamiento de ballenas"],
                        itinerario: "Salida en barco, avistamiento y comida.",
                        incluido: ["Transporte", "Guía", "Snacks"],
                        no_incluido: ["Propinas"],
                        accesibilidad: ["Limitada"],
                        reservaciones_antelacion: "72 horas",
                        review_count: 40
                    },
                    {
                        id: "cancun-air",
                        title: "Cancun: Relax from the Air",
                        description: "Enjoy breathtaking aerial views of Cancun.",
                        duration: "1 hour",
                        price: 960,
                        price_formatted: "$960.00 MXN",
                        images: [
                            "https://ournexttrip.com.mx/wp-content/uploads/2026/02/Cancun-2-300x300.jpg"
                        ],
                        image: "https://ournexttrip.com.mx/wp-content/uploads/2026/02/Cancun-2-300x300.jpg",
                        category: "quintana-roo",
                        caracteristicas_servicio: ["Vista aérea"],
                        itinerario: "Vuelo panorámico sobre Cancún.",
                        incluido: ["Vuelo"],
                        no_incluido: ["Transporte"],
                        accesibilidad: ["No accesible"],
                        reservaciones_antelacion: "48 horas",
                        review_count: 10
                    },
                    {
                        id: "salsa-bachata",
                        title: "Salsa and Bachata classes",
                        description: "Learn to dance salsa and bachata with professional instructors.",
                        duration: "2 hours",
                        price: 1300,
                        price_formatted: "$1,300.00 MXN",
                        images: [
                            "https://ournexttrip.com.mx/wp-content/uploads/2026/02/Baile3-300x300.jpg"
                        ],
                        image: "https://ournexttrip.com.mx/wp-content/uploads/2026/02/Baile3-300x300.jpg",
                        category: "cdmx",
                        caracteristicas_servicio: ["Clases prácticas"],
                        itinerario: "Sesión guiada con instructor.",
                        incluido: ["Instructor"],
                        no_incluido: ["Bebidas"],
                        accesibilidad: ["Accesible"],
                        reservaciones_antelacion: "24 horas",
                        review_count: 8
                    },
                    {
                        id: "cozumel-catamaran",
                        title: "Cozumel: Catamaran and Turtles",
                        description: "Sail through Cozumel and swim with turtles in crystal-clear waters.",
                        duration: "Half day",
                        price: 4900,
                        price_formatted: "$4,900.00 MXN",
                        images: [
                            "https://ournexttrip.com.mx/wp-content/uploads/2026/02/Cozumel-2-300x300.jpg"
                        ],
                        image: "https://ournexttrip.com.mx/wp-content/uploads/2026/02/Cozumel-2-300x300.jpg",
                        category: "quintana-roo",
                        caracteristicas_servicio: ["Snorkel", "Catamarán"],
                        itinerario: "Tour en catamarán + snorkel.",
                        incluido: ["Equipo snorkel", "Guía"],
                        no_incluido: ["Fotos"],
                        accesibilidad: ["Limitada"],
                        reservaciones_antelacion: "48 horas",
                        review_count: 22
                    },
                    {
                        id: "luciernagas",
                        title: "Shouts in the Forest: Magic Experience in the Sanctuary of Luciernagas",
                        description: "Witness the magical glow of fireflies in a unique natural sanctuary.",
                        duration: "Evening experience",
                        price: 4900,
                        price_formatted: "$4,900.00 MXN",
                        images: [
                            "https://ournexttrip.com.mx/wp-content/uploads/2026/02/Luciernagas-2-300x300.jpg"
                        ],
                        image: "https://ournexttrip.com.mx/wp-content/uploads/2026/02/Luciernagas-2-300x300.jpg",
                        category: "puebla",
                        caracteristicas_servicio: ["Experiencia nocturna"],
                        itinerario: "Caminata guiada en bosque.",
                        incluido: ["Guía", "Entrada"],
                        no_incluido: ["Transporte"],
                        accesibilidad: ["No accesible"],
                        reservaciones_antelacion: "72 horas",
                        review_count: 35
                    }
                ]);

            if (insertError) {
                console.error(insertError);
                return Response.json(
                    { error: insertError.message },
                    { status: 500 }
                );
            }
        }

        return Response.json({ ok: true });
    } catch (err) {
        console.error(err);
        return Response.json({ error: "Unexpected error" }, { status: 500 });
    }
}