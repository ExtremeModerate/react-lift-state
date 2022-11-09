import React, {ChangeEvent, FocusEvent, useEffect, useState} from "react";
import {CartType, Product, ProductType} from "../../App";
import {currencyFormat} from "../../helpers/currencyFormat";
import "./CartItem.scss";

export interface CartItemProps {
    product: Product;
    cart: CartType;
    initialQuantity: number;
    onBlur: (event: FocusEvent<HTMLInputElement>) => void;
}

export const CartItem = ({product, cart, initialQuantity, onBlur}: CartItemProps) => {
    const [qty, setQty] = useState(initialQuantity);

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQty(Number(event.target.value));
    }

    useEffect(() => {
        setQty(cart.get(product.id) || initialQuantity)
    }, [cart, initialQuantity, product.id]);

    const isActiveWarranty = (product: Product): boolean => {
        const hasQty = (cart.get(product.id) || 0) > 0;
        return hasQty && isWarranty(product);
    }

    const isWarranty = (product: Product): boolean => {
        return product.productType === ProductType.WARRANTY;
    }

    return (<div className={'CartItem'}>
            <div className={'CartItem__Cell'}>
                <p className={'CartItem__Name'}>{product.name}</p>
                <p className={`CartItem__Name ${isWarranty(product) ? 'Warranty' : 'Other'} ${isActiveWarranty(product) ? 'Active' : 'Inactive'}`}>{product.productType}</p>
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

export const CartHeader = () => {
    return (<div className={'CartItem'}>
            <div className={'CartItem__Cell'}>
                <h3>Name</h3>
            </div>
            <div className={'CartItem__Cell'}>
                <h3>Price each</h3>
            </div>
            <div className={'CartItem__Cell'}>
                <h3>Quantity</h3>
            </div>
            <div className={'CartItem__Cell'}>
                <h3>Price</h3>
            </div>
        </div>
    );

}
