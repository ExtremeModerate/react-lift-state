import React, {ChangeEvent, FocusEvent, useEffect, useState} from "react";
import {CartType, Product} from "../App";
import {currencyFormat} from "../helpers/currencyFormat";
import "./CartItem.scss";

export interface CartItemProps {
    product: Product;
    cart: CartType;
    initialQuantity: number;
    onBlur: (event: FocusEvent<HTMLInputElement>) => void;
}

export function CartItem({product, cart, initialQuantity, onBlur}: CartItemProps) {
    const [qty, setQty] = useState(initialQuantity);

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQty(Number(event.target.value));
    }

    useEffect(() => {
        setQty(cart.get(product.id) || initialQuantity)
    }, [cart, initialQuantity, product.id]);

    return (<div className={'CartItem'}>
            <div className={'CartItem__Cell'}>
                <p className={'CartItem__Name'}>{product.name}</p>
                <p className={'CartItem__Name'}>{product.productType}</p>
            </div>
            <div className={'CartItem__Cell'}>
                <label className={'CartItem__Price'}>{currencyFormat(product.price)}</label>
            </div>
            <div className={'CartItem__Cell'}>
                <input className={'CartItem__Quantity'} id={product.id} type={'text'}
                       value={qty}
                       onChange={onInputChange} onBlur={onBlur}/>
            </div>
            <div className={'CartItem__Cell'}>
                <label className={'CartItem__Total'}>{currencyFormat(qty * product.price)}</label>
            </div>
        </div>
    );
}
