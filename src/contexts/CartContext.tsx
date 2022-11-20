import { useEffect, useLayoutEffect, useState } from 'react';
import createTypeSafeContext from 'helpers/createTypeSafeContext';
import { CartType } from 'common/models';

export interface CartContextValue {
    cart: CartType;
    updateCart: (value: CartType) => void;
}

export const [useCartContext, CartContext] = createTypeSafeContext<CartContextValue>();

export const CartContextProvider = ({ children }: any): JSX.Element => {
    const [cart, setCart] = useState<CartType>(new Map());
    const [isMounted, setIsMounted] = useState(false);

    useLayoutEffect(() => {
        if (!isMounted) {
            setIsMounted(true);
        }
        return () => {
            setIsMounted(false);
        };
    }, []);

    useEffect(() => {
        console.log(`Cart ${isMounted ? 'is' : 'is not'} mounted`);
        if (!isMounted) {
            return;
        }
    }, [isMounted]);

    const updateCart = setCart;

    const cartContextValue: CartContextValue = {
        cart,
        updateCart,
    };

    return <CartContext.Provider value={cartContextValue}>{children}</CartContext.Provider>;
};
