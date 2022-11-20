import { createElement, FC, PropsWithChildren } from 'react';
import { CatalogContextProvider } from 'contexts/CatalogContext';
import { CartContextProvider } from 'contexts/CartContext';

interface ComposeProvidersProps extends PropsWithChildren {
    providers: FC[];
}

const ComposeProviders = ({ providers, children }: ComposeProvidersProps) => (
    <>
        {providers.reduceRight((acc, ContextProvider) => {
            return createElement(ContextProvider, null, acc);
        }, children)}
    </>
);

export const ContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const providers: FC[] = [CatalogContextProvider, CartContextProvider];
    return <ComposeProviders providers={providers}>{children}</ComposeProviders>;
};
