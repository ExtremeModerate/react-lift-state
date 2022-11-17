import React, {ChangeEvent, FocusEvent, useEffect, useLayoutEffect, useState} from 'react';
import logo from './logo.svg';
import './App.scss';
import {CartHeader, CartItem} from './components/CartItem/CartItem'
import {currencyFormat} from "./helpers/currencyFormat";
import axios from 'axios';


export const CATALOG_SIZE = 10;
type ProductIdType = string;

export enum ProductType {
    CHAIR = "CHAIR",
    TABLE = "TABLE",
    WARRANTY = "WARRANTY",
}

export type ProductTypeKeys = keyof typeof ProductType;

export type CartType = Map<ProductIdType, number>;

export interface Product {
    id: ProductIdType;
    name: string;
    price: number;
    productType: ProductType;
}

export interface ProductDTO {
    ProductId: number;
    Description: string;
}

const buildProducts = (howMany = 1): Product[] => {
    const prods = [];
    const typeKeys = Object.keys(ProductType);
    for (let i = 0; i < howMany; i++) {
        const id = `${i}.${Math.round(Math.random() * 100)}`
        const idx = Math.trunc(Math.random() * typeKeys.length);
        const productType = ProductType[typeKeys[idx] as ProductTypeKeys];
        prods.push({
            id: id,
            name: `Product ${id}`,
            price: Number((Math.random() * 25).toFixed(2)),
            productType: productType
        })
    }
    return prods;
}

const fetchProducts = (howMany = 1): Product[] => {
    const typeKeys = Object.keys(ProductType);
    const prods: Product[] = [];
    const x = axios.get<ProductDTO[]>('http://localhost:8090/api/products')
        .then(function (response) {
            // handle success
            console.log(response);
            response.data.forEach((item: ProductDTO) => {
                const idx = Math.trunc(Math.random() * typeKeys.length);
                const productType = ProductType[typeKeys[idx] as ProductTypeKeys];
                prods.push({
                    id: item.ProductId.toString(),
                    name: item.Description,
                    price: Number((Math.random() * 25).toFixed(2)),
                    productType: productType
                });
            })
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
        });
    return prods;
}

function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [time, setTime] = useState<Date>(new Date());
    const [cart, setCart] = useState<CartType>(new Map());
    const [totalPrice, setTotalPrice] = useState(0);
    const [didMount, setDidMount] = useState(false);

    useLayoutEffect(() => {
        if (!didMount) {
            setDidMount(true);
        }
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => {
            console.log('finishing useLayoutEffect')
            setDidMount(false);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (!didMount) {
            console.log('not mounted, try again')
            return;
        }
        if (products.length) {
            console.log('already done');
            return;
        }
        console.log('resetting products');
        setProducts(fetchProducts(100));
        // setProducts(buildProducts(CATALOG_SIZE));
    }, [didMount]);

    useEffect(() => {
        const total =
            Number(Array.from(cart.keys()).reduce((total, key) => {
                const product = products.find((value) => value.id === key);
                const qty = cart.get(key);
                return (product && qty) ? total += product.price * qty : total;
            }, 0).toFixed(2));
        setTotalPrice(total);
    }, [cart, products]);

    useEffect(() => {
        console.table(products);
        const initialCart = new Map(products.map((value) => [value.id, value.productType === ProductType.WARRANTY ? 0 : 0]));
        setCart(initialCart);
    }, [products]);


    const onInputBlur = (event: FocusEvent<HTMLInputElement>) => {
        const product = products.find((value) => value.id === event.target.id);
        if (!product) return;
        let quantity = Number(event.target.value || 0);
        const newCart = new Map(cart);
        // if this is a warranty, zero all the others and make this quantity only one
        if (product.productType === ProductType.WARRANTY && quantity > 0) {
            products.filter((value) => value.productType === ProductType.WARRANTY).forEach((value) => {
                newCart.set(value.id, 0);
            })
            quantity = 1;
        }
        newCart.set(event.target.id, quantity);
        setCart(newCart);
    }

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <div><h1>{time.toLocaleTimeString()}</h1></div>
                <div>Total: {currencyFormat(totalPrice)}</div>
                <CartHeader></CartHeader>
                {products.map((product) => {
                        const cur = cart.get(product.id) || 0;
                        return <CartItem key={product.id} product={product} cart={cart} initialQuantity={cur}
                                         onBlur={onInputBlur}/>
                    }
                )}

            </header>
        </div>
    );
}

export default App;
