import { useEffect, useLayoutEffect, useState } from 'react';
import createTypeSafeContext from 'helpers/createTypeSafeContext';
import { Catalog, Product, ProductDTO, ProductType, ProductTypeKeys } from 'common/models';
import axios from 'axios';
import { CATALOG_SIZE } from 'common/constants';

export interface CatalogContextValue {
    products: Catalog;
    catalog: Catalog;
    updateCatalog: (value: Catalog) => void;
    fetchProducts: (howMany: number) => void;
}

export const [useCatalogContext, CatalogContext] = createTypeSafeContext<CatalogContextValue>();

export const CatalogContextProvider = ({ children }: any): JSX.Element => {
    // this is marginally useful, but any time we create an estimate from the design, it gets saved here
    const [catalog, setCatalog] = useState<Catalog>([]);
    const [lastUpdate, setLastUpdate] = useState<number>(Date.now);
    const [autoUpdate, setAutoUpdate] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useLayoutEffect(() => {
        if (!isMounted) {
            setIsMounted(true);
        }
        const autoTimer = setInterval(() => {
            setAutoUpdate(true);
        }, 10000);
        return () => {
            console.log('clearing autoTimer');
            setIsMounted(false);
            clearInterval(autoTimer);
        };
    }, []);

    useEffect(() => {
        if (!isMounted || !autoUpdate) {
            return;
        }
        console.log('autoUpdating Products');
        fetchProducts(CATALOG_SIZE);
        setAutoUpdate(false);
    }, [autoUpdate, isMounted]);

    const updateCatalog = setCatalog;

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
                updateCatalog(prods);
                return prods;
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                return [];
            });
    };

    const catalogContextValue: CatalogContextValue = {
        products: catalog,
        catalog,
        updateCatalog,
        fetchProducts,
    };

    return <CatalogContext.Provider value={catalogContextValue}>{children}</CatalogContext.Provider>;
};
