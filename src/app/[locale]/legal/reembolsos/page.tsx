"use client";

import { useLocale } from "next-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function LegalEs() {
    return (
        <div className="legal-container">
            <style dangerouslySetInnerHTML={{
                __html: `
        .legal-container {
          color: #1a1a1a;
          line-height: 1.6;
          font-family: sans-serif;
        }
        .legal-container h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 2rem; border-bottom: 2px solid #eee; padding-bottom: 1rem; }
        .legal-container h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2.5rem; margin-bottom: 1rem; color: #3048ab; }
        .legal-container h3 { font-size: 1.1rem; font-weight: 700; margin-top: 1.5rem; }
        .legal-container p { margin-bottom: 1.2rem; text-align: justify; }
        .legal-container ul { margin-bottom: 1.2rem; padding-left: 1.5rem; list-style-type: disc; }
        .legal-container li { margin-bottom: 0.5rem; }
        .legal-container section { margin-bottom: 3rem; }
      `}} />

            <section>
                <h1 id="pol-tica-de-devoluciones-y-reembolsos">Política de devoluciones y reembolsos</h1>
                <p><strong>¿Qué pasa con su dinero?</strong><br />Wonder Mxcoordina experiencias con proveedores reales que operan con disponibilidad limitada. Cuando una reserva se cancela, ese lugar casi nunca puede recuperarse ni reasignarse. Por eso lo que ocurre con su dinero depende directamente de cuándo decide cancelar, no de por qué. Esto es lo que corresponde en cada momento.<br /><strong>1. Cancelaciones con suficiente anticipación</strong><br />Si cancela con más de 7 días naturales de anticipación a la fecha de inicio de su experiencia:  </p>
                <ul>
                    <li>Para una experiencia del catálogo, el reembolso es de hasta el 90% del monto pagado. El 10% restante corresponde a gastos de gestión y comisiones no recuperables del procesador de pagos.  </li>
                    <li>Si lo que cancela es un itinerario personalizado ya cotizado y pagado, el reembolso es de hasta el 80%, porque en ese punto Wonder Mx  ya invirtió tiempo en el diseño del itinerario y en gestiones con proveedores que no pueden deshacerse sin costo.<br />Lo anterior se entiende sin perjuicio del derecho de revocación dentro de los cinco días hábiles siguientes a la compra en servicios contratados por medios electrónicos, conforme a la Ley Federal de Protección al Consumidor, siempre que la experiencia no haya comenzado ni esté dentro de una excepción legal.<br /><strong>2. Cancelaciones en ventana media</strong><br />Si cancela entre 3 y 7 días naturales antes del inicio:  </li>
                    <li>Para una experiencia del catálogo, el reembolso es de hasta el 50% del monto pagado.  </li>
                    <li>Para un itinerario personalizado, el reembolso es de hasta el 30%, y los costos que los proveedores cobren a Wonder Mx por la cancelación —cuando no tienen política de devolución— se descuentan directamente del monto a reembolsar. Wonder Mx presentará el detalle de esos cargos por escrito antes de procesar cualquier descuento.<br /><strong>3. Cancelaciones con poca anticipación</strong><br />Si cancela con menos de 3 días naturales de anticipación, o cuando falten 48 horas o menos antes del inicio:  </li>
                    <li>Para una experiencia del catálogo, en la mayoría de los casos el servicio se considera no reembolsable, dado que la mayor parte de las reservas ya está confirmada y los servicios suelen haberse pagado a los proveedores en términos no reembolsables.  </li>
                    <li>Para un itinerario personalizado, normalmente no procede reembolso. Wonder Mxevaluará caso por caso, documentará por escrito los costos irrecuperables y, si existe algún saldo reembolsable, lo tramitará en los plazos establecidos en esta política.<br /><strong>4. Cancelaciones de último momento, no show y abandono</strong><br />Si cancela con menos de 72 horas de anticipación, si llega tarde e impide el inicio de la actividad, o si abandona la experiencia una vez que ha comenzado, no procede reembolso bajo ninguna circunstancia, ya que los recursos fueron comprometidos en su totalidad.<br />La única excepción a considerar, no como reembolso sino como reprogramación, es una emergencia médica documentada. En ese caso, Wonder Mx evaluará la posibilidad de reagendar la experiencia sin costo adicional de gestión, sujeto a disponibilidad y a las políticas de los proveedores involucrados.<br /><strong>5. Si quien cancela es </strong> <strong>Wonder Mx </strong>  </li>
                    <li>Si la cancelación se debe a causas imputables a Wonder Mx , usted recibe el 100% del monto pagado en un plazo máximo de quince días hábiles.  </li>
                    <li>Si la cancelación ocurre por fuerza mayor (clima extremo, cierre de sitios por autoridad, condiciones de seguridad en el destino u otros eventos similares), Wonder Mx le ofrecerá primero la reprogramación. Si no es posible o usted no la acepta, se reembolsará el monto pagado menos los costos irrecuperables ya comprometidos con proveedores, con detalle por escrito.<br /><strong>6. Cambios de fecha en lugar de cancelación</strong><br />Si lo que busca es un cambio de fecha en lugar de una cancelación:  </li>
                    <li>Wonder Mx lo gestionará sin cargo adicional de gestión cuando la solicitud llegue con más de 7 días naturales de anticipación y haya disponibilidad.  </li>
                    <li>Si la solicitud llega con menos tiempo, pueden existir costos adicionales según las políticas del proveedor correspondiente (por ejemplo, diferencias de tarifa o cargos de cambio); Wonder Mx se los comunicará antes de confirmar cualquier modificación.<br /><strong>7. Cómo iniciar un reembolso o un cambio</strong><br />Para iniciar cualquier solicitud de reembolso o cambio, escríbanos a contacto@ournextrip.com.mx con:  </li>
                    <li>Nombre o folio de su reserva.  </li>
                    <li>Fecha de la experiencia.  </li>
                    <li>Monto pagado.  </li>
                    <li>Motivo de la solicitud.<br />Acusamos recibo en un máximo de 48 horas hábiles y emitimos resolución en un plazo de hasta siete días hábiles. Los reembolsos aprobados se procesan en un máximo de quince días hábiles desde la resolución, al mismo método de pago utilizado en la compra, salvo que por causas ajenas a Wonder Mx ello no sea posible y se acuerde un medio alternativo.  </li>
                </ul>


            </section>
        </div>
    );
}

function LegalEn() {
    return (
        <div className="legal-container">
            <style dangerouslySetInnerHTML={{
                __html: `
        .legal-container {
          color: #1a1a1a;
          line-height: 1.6;
          font-family: sans-serif;
        }
        .legal-container h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 2rem; border-bottom: 2px solid #eee; padding-bottom: 1rem; }
        .legal-container h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2.5rem; margin-bottom: 1rem; color: #3048ab; }
        .legal-container h3 { font-size: 1.1rem; font-weight: 700; margin-top: 1.5rem; }
        .legal-container p { margin-bottom: 1.2rem; text-align: justify; }
        .legal-container ul { margin-bottom: 1.2rem; padding-left: 1.5rem; list-style-type: disc; }
        .legal-container li { margin-bottom: 0.5rem; }
      `}} />

            <section>
                <h1 id="pol-tica-de-devoluciones-y-reembolsos">Returns and Refund Policy</h1>
                <p><strong>What happens to your money?</strong><br />Wonder Mx coordinates experiences with real providers that operate with limited availability. When a reservation is canceled, that spot can almost never be recovered or reassigned. Therefore, what happens to your money depends directly on when you decide to cancel, not why. This is what applies in each case.<br /><strong>1. Cancellations with sufficient notice</strong><br />If you cancel more than 7 calendar days before the start date of your experience: </p>
                <ul>
                    <li>For a catalog experience, the refund is up to 90% of the amount paid. The remaining 10% corresponds to management costs and non-recoverable payment processor fees. </li>
                    <li>If what you cancel is a personalized itinerary that has already been quoted and paid, the refund is up to 80%, because at that point Wonder Mx has already invested time in designing the itinerary and coordinating with providers, which cannot be undone without cost.<br />The above is understood without prejudice to the right of withdrawal within five business days following the purchase of services contracted by electronic means, in accordance with the Federal Consumer Protection Law, provided that the experience has not started and does not fall within a legal exception.<br /><strong>2. Cancellations within the mid window</strong><br />If you cancel between 3 and 7 calendar days before the start: </li>
                    <li>For a catalog experience, the refund is up to 50% of the amount paid. </li>
                    <li>For a personalized itinerary, the refund is up to 30%, and any costs charged to Wonder Mx by providers due to cancellation —when they have no refund policy— will be deducted directly from the refundable amount. Wonder Mx will provide a written breakdown of those charges before applying any deduction.<br /><strong>3. Cancellations with short notice</strong><br />If you cancel less than 3 calendar days in advance, or within 48 hours or less before the start: </li>
                    <li>For a catalog experience, in most cases the service is considered non-refundable, as most reservations are already confirmed and services are typically paid to providers under non-refundable terms. </li>
                    <li>For a personalized itinerary, refunds generally do not apply. Wonder Mx will evaluate each case individually, document unrecoverable costs in writing, and, if any refundable balance exists, process it within the timeframes established in this policy.<br /><strong>4. Last-minute cancellations, no-show, and abandonment</strong><br />If you cancel with less than 72 hours’ notice, arrive late preventing the activity from starting, or abandon the experience once it has begun, no refund will be granted under any circumstances, as resources have been fully committed.<br />The only exception to consider, not as a refund but as a rescheduling, is a documented medical emergency. In such case, Wonder Mx will evaluate the possibility of rescheduling the experience without additional management fees, subject to availability and the policies of the involved providers.<br /><strong>5. If the cancellation is made by </strong> <strong>Wonder Mx </strong> </li>
                    <li>If the cancellation is due to reasons attributable to Wonder Mx, you will receive 100% of the amount paid within a maximum of fifteen business days. </li>
                    <li>If the cancellation occurs due to force majeure (extreme weather, site closures by authorities, safety conditions at the destination, or similar events), Wonder Mx will first offer rescheduling. If this is not possible or you do not accept it, the amount paid will be refunded minus any unrecoverable costs already committed to providers, with a written breakdown.<br /><strong>6. Date changes instead of cancellation</strong><br />If you are seeking a date change instead of a cancellation: </li>
                    <li>Wonder Mx will manage it without additional management fees when the request is made more than 7 calendar days in advance and there is availability. </li>
                    <li>If the request is made with less notice, additional costs may apply according to the policies of the corresponding provider (for example, fare differences or change fees); Wonder Mx will inform you before confirming any modification.<br /><strong>7. How to initiate a refund or change</strong><br />To initiate any refund or change request, write to us at contacto@ournextrip.com.mx with: </li>
                    <li>Name or reservation reference number. </li>
                    <li>Date of the experience. </li>
                    <li>Amount paid. </li>
                    <li>Reason for the request.<br />We acknowledge receipt within a maximum of 48 business hours and issue a resolution within up to seven business days. Approved refunds are processed within a maximum of fifteen business days from the resolution, using the same payment method used for the purchase, unless due to circumstances beyond Wonder Mx’s control this is not possible and an alternative method is agreed upon. </li>
                </ul>
            </section>
        </div>
    );
}

export default function LegalPage() {
    const locale = useLocale();

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-grow container mx-auto px-6 py-20 max-w-4xl">
                {locale === "es" ? <LegalEs /> : <LegalEn />}
            </main>
            <Footer />
        </div>
    );
}