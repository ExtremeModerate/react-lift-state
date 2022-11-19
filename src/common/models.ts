type ProductIdType = string;

export enum ProductType {
    CHAIR = 'CHAIR',
    TABLE = 'TABLE',
    WARRANTY = 'WARRANTY',
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

export const buildProducts = (howMany = 1): Product[] => {
    const prods = [];
    const typeKeys = Object.keys(ProductType);
    for (let i = 0; i < howMany; i++) {
        const id = `${i}.${Math.round(Math.random() * 100)}`;
        const idx = Math.trunc(Math.random() * typeKeys.length);
        const productType = ProductType[typeKeys[idx] as ProductTypeKeys];
        prods.push({
            id: id,
            name: `Product ${id}`,
            price: Number((Math.random() * 25).toFixed(2)),
            productType: productType,
        });
    }
    return prods;
};
