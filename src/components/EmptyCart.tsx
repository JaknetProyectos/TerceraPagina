"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShoppingBag, ArrowRight, Heart, Sparkles } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from 'next-intl';

export function EmptyCart() {
    const t = useTranslations('Cart');

    return (
        <div className="bg-white min-h-screen flex flex-col font-work-sans">
            <Header />
            
            <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-20 px-6">
                <div className="max-w-2xl w-full text-center space-y-12 animate-in fade-in zoom-in-95 duration-1000">
                    
                    {/* Visual Central Estilo Editorial */}
                    <div className="relative inline-block">
                        <div className="w-32 h-32 md:w-40 md:h-40 border-[0.5px] border-gray-100 rounded-full flex items-center justify-center bg-[#F9F9F9]">
                            <ShoppingBag size={48} className="text-gray-300 transition-transform duration-500 hover:scale-110" strokeWidth={0.75} />
                        </div>
                    </div>

                    {/* Tipografía SHEIN: Limpia, Espaciada, Minimal */}
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-light text-[#212121]">
                            {t('empty_title_part1')} <span className="font-bold">{t('empty_title_part2')}</span>
                        </h2>
                        <p className="text-md text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">
                            {t('empty_description')}
                        </p>
                    </div>

                    {/* Call to Action: Botones Estilizados */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/experiencias"
                            className="w-full rounded-xl md:w-64 bg-[#212121] text-white py-5 px-8 text-lg font-bold hover:bg-[#333] transition-all duration-300 flex items-center justify-center gap-3 ">
                            Explorar experiencias
                            <ArrowRight size={14} strokeWidth={3} />
                        </Link>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}