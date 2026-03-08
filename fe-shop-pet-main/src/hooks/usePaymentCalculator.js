import { useEffect, useState } from 'react';

export default function usePaymentCalculator(cart, promotion, deliveryFee) {
    const [totalBeforeDiscount, setTotalBeforeDiscount] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);

    useEffect(() => {
        const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        setTotalBeforeDiscount(total);
    }, [cart]);

    useEffect(() => {
        if (!promotion) {
            setDiscount(0);
            return;
        }

        let d = 0;

        if (promotion.type === 'PERCENT') {
            d = (totalBeforeDiscount * promotion.value) / 100;
        } else {
            d = promotion.value;
        }

        d = Math.min(d, promotion.maxDiscount);

        setDiscount(d);
    }, [promotion, totalBeforeDiscount]);

    useEffect(() => {
        const total = Math.max(0, totalBeforeDiscount - discount + deliveryFee);
        setFinalTotal(total);
    }, [discount, totalBeforeDiscount, deliveryFee]);

    return {
        totalBeforeDiscount,
        discount,
        finalTotal,
    };
}
