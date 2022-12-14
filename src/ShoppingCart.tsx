import { currencyFormat } from 'helpers';
import { ProductList } from 'components/ProductList/ProductList';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useCatalogContext } from 'contexts/CatalogContext';
import { useCartContext } from 'contexts/CartContext';
import { AnalogClock } from 'components/AnalogClock/AnalogClock';

export const ShoppingCart = () => {
    const [totalPrice, setTotalPrice] = useState(0);
    const { catalog, lastUpdated } = useCatalogContext();
    const { cart, updateCart } = useCartContext();
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
        if (!isMounted) {
            return;
        }

        // console.table(catalog);
        // const initialCart = new Map(
        //     catalog.map((value) => [value.id, value.productType === ProductType.WARRANTY ? 0 : 1]),
        // );
        // updateCart(initialCart);
    }, [catalog, isMounted]);

    useLayoutEffect(() => {
        if (!isMounted) {
            return;
        }
        const total = Number(
            Array.from(cart.keys())
                .reduce((total, key) => {
                    const product = catalog.find((value) => value.id === key);
                    const qty = cart.get(key);
                    return product && qty ? (total += product.price * qty) : total;
                }, 0)
                .toFixed(2),
        );
        console.log('calculate total', total);
        setTotalPrice(total);
    }, [cart, catalog, isMounted]);

    const lastUpdateDate = new Date(lastUpdated).toLocaleTimeString();
    return (
        <>
            <header className="App-header">
                {/*<img src={logo} className="App-logo" alt="logo"/>*/}
                <AnalogClock style={{ color: 'green' }} height={250} width={250} />
                <div>
                    <label>Catalog: {catalog.length}</label>
                    <label>Cart: {cart.size}</label>
                    <>Last Updated: {lastUpdateDate}</>
                </div>
                <div>Total: {currencyFormat(totalPrice)}</div>
                <ProductList catalog={catalog} cart={cart} setCart={updateCart} />
            </header>
        </>
    );
};
