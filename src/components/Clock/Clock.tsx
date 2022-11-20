import React, { HTMLAttributes, PropsWithChildren, useEffect, useState } from 'react';

export interface ClockProps extends PropsWithChildren {
    style?: HTMLAttributes<HTMLHeadingElement>;
}

export const Clock = ({ style, children }: ClockProps) => {
    const [time, setTime] = useState<Date>(new Date());
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        console.log('Clock is mounted', isMounted);
        if (!isMounted) {
            setIsMounted(true);
            return;
        }
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => {
            setIsMounted(false);
            clearInterval(interval);
        };
    }, [isMounted]);

    return (
        <>
            <h1 style={{ ...style }}>{time.toLocaleTimeString()}</h1>
            {children}
        </>
    );
};
