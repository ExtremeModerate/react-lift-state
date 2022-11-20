import { CartHeader, CartItem } from '../CartItem/CartItem';
import React, { FocusEvent } from 'react';
import { CartType, Product, ProductType } from 'common/models';

export interface ProductListProps {
    products: Product[];
    cart: CartType;
    setCart: (cart: CartType) => void;
}

export const ProductList = ({ products, cart, setCart }: ProductListProps) => {
    const onInputBlur = (event: FocusEvent<HTMLInputElement>) => {
        const product = products.find((value) => value.id === event.target.id);
        if (!product) {
            return;
        }
        let quantity = Number(event.target.value || 0);
        if (cart.get(product.id) === quantity) {
            return;
        }

        const newCart = new Map(cart);
        // if this is a warranty, zero all the others and make this quantity only one
        if (product.productType === ProductType.WARRANTY && quantity > 0) {
            products
                .filter((value) => value.productType === ProductType.WARRANTY)
                .forEach((value) => {
                    newCart.set(value.id, 0);
                });
            quantity = 1;
        }
        newCart.set(event.target.id, quantity);
        setCart(newCart);
    };

    return (
        <>
            <CartHeader></CartHeader>
            {products.map((product) => {
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
        </>
    );
};
