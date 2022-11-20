import { createContext, useContext } from 'react';

/**
 * Provides a way to create typesafe contexts without having to check for null
 * initial values all of the time.
 * @see https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/
 */
export function createTypeSafeContext<A extends unknown | null>(): readonly [
    () => A & (unknown | null),
    React.Context<A | undefined>,
] {
    const ctx = createContext<A | undefined>(undefined);

    function useCtx() {
        const c = useContext(ctx);
        if (c === undefined) {
            throw new Error('useCtx must be inside a Provider with a value');
        }
        return c;
    }

    return [useCtx, ctx] as const; // 'as const' makes TypeScript infer a tuple
}

export default createTypeSafeContext;
