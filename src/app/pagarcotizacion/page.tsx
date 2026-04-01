import { Suspense } from "react";
import PaymentContent from "./PaymentContent";
import Loading from "@/components/Loading";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PayQuotePage() {
    return (
        <>
            <Suspense fallback={<Loading />}>
                <PaymentContent />
            </Suspense>
        </>
    );
}