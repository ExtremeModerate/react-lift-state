import { CartHeader, CartItem } from '../CartItem/CartItem';
import React, { FocusEvent, PropsWithChildren } from 'react';
import { CartType, Catalog, ProductType } from 'common/models';

export interface ProductListProps extends PropsWithChildren {
    catalog: Catalog;
    cart: CartType;
    setCart: (cart: CartType) => void;
}

export const ProductList = ({ catalog, cart, setCart, children }: ProductListProps) => {
    const onInputBlur = (event: FocusEvent<HTMLInputElement>) => {
        const product = catalog.find((value) => value.id === event.target.id);
        if (!product) {
            return;
        }
        let quantity = Number(event.target.value || 0);
        if (cart.get(product.id) === quantity) {
            return;
        }

        const newCart = new Map(cart);
        if (product.productType === ProductType.WARRANTY && quantity > 0) {
            // if this is a warranty, zero all the others and make this quantity only one
            catalog
                .filter((value) => value.productType === ProductType.WARRANTY)
                .forEach((value) => {
                    newCart.delete(value.id);
                });
            quantity = 1;
        }
        if (quantity > 0) {
            newCart.set(event.target.id, quantity);
        } else {
            newCart.delete(event.target.id);
        }
        setCart(newCart);
    };

    return (
        <>
            <CartHeader></CartHeader>
            {catalog.map((product) => {
                const cur = cart.get(product.id) || 0;
                return (
                    <CartItem
                        key={product.id}
                        product={product}
                        cart={cart}
                        initialQuantity={cur}
                        onBlur={onInputBlur}
                    />
                );
            })}
            {children}
        </>
    );
};
