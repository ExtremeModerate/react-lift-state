import { createElement, FC, PropsWithChildren, ReactNode } from 'react';
import { CatalogContextProvider } from 'contexts/CatalogContext';

interface ComposeProvidersProps {
    providers: FC[];
    children?: ReactNode;
}

const ComposeProviders = ({ providers, children }: ComposeProvidersProps) => (
    <>
        {providers.reduceRight((acc, ContextProvider) => {
            return createElement(ContextProvider, null, acc);
        }, children)}
    </>
);

export const ContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const providers: FC[] = [CatalogContextProvider];
    return <ComposeProviders providers={providers}>{children}</ComposeProviders>;
};
