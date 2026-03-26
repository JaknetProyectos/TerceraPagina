import { useEffect, useState } from "react";
import { getCart } from "@/lib/cart";

export function useCartCount() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        setCount(getCart().length);
    }, []);

    return count;
}