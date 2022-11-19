import React, { useEffect, useLayoutEffect, useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import { currencyFormat } from './helpers/currencyFormat';
import axios from 'axios';
import { ProductList } from './components/ProductList/ProductList';
import { CartType, Product, ProductDTO, ProductType, ProductTypeKeys } from './common/models';
import { CATALOG_SIZE } from './common/constants';

function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [time, setTime] = useState<Date>(new Date());
    const [cart, setCart] = useState<CartType>(new Map());
    const [totalPrice, setTotalPrice] = useState(0);
    const [appMounted, setAppMounted] = useState(false);

    useLayoutEffect(() => {
        if (!appMounted) {
            setAppMounted(true);
        }
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => {
            setAppMounted(false);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (!appMounted || products.length) {
            return;
        }

        const fetchProducts = async (howMany = 1): Promise<Product[]> => {
            const typeKeys = Object.keys(ProductType);
            return axios
                .get<ProductDTO[]>('http://localhost:8090/api/products')
                .then(function (response) {
                    // handle success
                    console.log(response);
                    const prods: Product[] = response.data.slice(0, howMany).map((item: ProductDTO) => {
                        const idx = Math.trunc(Math.random() * typeKeys.length);
                        const productType = ProductType[typeKeys[idx] as ProductTypeKeys];
                        return {
                            id: item.ProductId.toString(),
                            name: item.Description,
                            price: Number((Math.random() * 25).toFixed(2)),
                            productType: productType,
                        } as Product;
                    });
                    setProducts(prods);
                    return prods;
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                    return [];
                });
        };

        fetchProducts(CATALOG_SIZE);
    }, [appMounted]);

    useEffect(() => {
        if (!appMounted) {
            return;
        }

        // console.table(products);
        console.log('Catalog size', products.length);
        const initialCart = new Map(
            products.map((value) => [value.id, value.productType === ProductType.WARRANTY ? 0 : 0]),
        );
        setCart(initialCart);
    }, [products]);

    useLayoutEffect(() => {
        if (!appMounted) {
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
        <div className="App">
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
        </div>
    );
}

export default App;
