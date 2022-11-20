import logo from 'logo.svg';
import { currencyFormat } from 'helpers';
import { ProductList } from 'components/ProductList/ProductList';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { CartType, ProductType } from 'common/models';
import { useCatalogContext } from 'contexts/CatalogContext';

export const MyApp = () => {
    const [time, setTime] = useState<Date>(new Date());
    const [cart, setCart] = useState<CartType>(new Map());
    const [totalPrice, setTotalPrice] = useState(0);
    const { products, updateCatalog } = useCatalogContext();

    const [isMounted, setIsMounted] = useState(false);

    useLayoutEffect(() => {
        if (!isMounted) {
            setIsMounted(true);
        }
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => {
            setIsMounted(false);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (!isMounted || products.length) {
            return;
        }

        // fetchProducts(CATALOG_SIZE);
    }, [isMounted]);

    useEffect(() => {
        if (!isMounted) {
            return;
        }

        // console.table(products);
        console.log('Catalog size', products.length);
        const initialCart = new Map(
            products.map((value) => [value.id, value.productType === ProductType.WARRANTY ? 0 : 1]),
        );
        setCart(initialCart);
    }, [products]);

    useLayoutEffect(() => {
        if (!isMounted) {
            return;
        }
        const total = Number(
            Array.from(cart.keys())
                .reduce((total, key) => {
                    const product = products.find((value) => value.id === key);
                    const qty = cart.get(key);
                    return product && qty ? (total += product.price * qty) : total;
                }, 0)
                .toFixed(2),
        );
        console.log('calculate total', total);
        setTotalPrice(total);
    }, [cart, products]);

    return (
        <>
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <div>
                    <h1>{time.toLocaleTimeString()}</h1>
                </div>
                <div>Total: {currencyFormat(totalPrice)}</div>
                <ProductList products={products} cart={cart} setCart={setCart}></ProductList>
            </header>
        </>
    );
};
