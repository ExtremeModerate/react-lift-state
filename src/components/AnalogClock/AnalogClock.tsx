import React, { HTMLAttributes, PropsWithChildren, useEffect, useState } from 'react';

export interface ClockProps extends PropsWithChildren {
    style?: HTMLAttributes<HTMLHeadingElement>;
    width: number;
    height: number;
}

export const AnalogClock = ({ style, width, height, children }: ClockProps) => {
    const [time, setTime] = useState<Date>(new Date());
    const [isMounted, setIsMounted] = useState(false);
    const canvasRef = React.createRef<HTMLCanvasElement>();
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

    const drawHand = (ctx: CanvasRenderingContext2D, pos: number, length: number, width: number) => {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    };

    const drawTime = (ctx: CanvasRenderingContext2D, radius: number) => {
        const now = new Date();
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();
        //hour
        hour = hour % 12;
        hour = (hour * Math.PI) / 6 + (minute * Math.PI) / (6 * 60) + (second * Math.PI) / (360 * 60);
        drawHand(ctx, hour, radius * 0.5, radius * 0.07);
        //minute
        minute = (minute * Math.PI) / 30 + (second * Math.PI) / (30 * 60);
        drawHand(ctx, minute, radius * 0.8, radius * 0.07);
        // second
        second = (second * Math.PI) / 30;
        drawHand(ctx, second, radius * 0.9, radius * 0.02);
    };

    const drawFace = (ctx: CanvasRenderingContext2D, radius: number) => {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();

        const grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
        grad.addColorStop(0, '#333');
        grad.addColorStop(0.5, 'white');
        grad.addColorStop(1, '#333');
        ctx.strokeStyle = grad;
        ctx.lineWidth = radius * 0.1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
    };

    const drawNumbers = (ctx: CanvasRenderingContext2D, radius: number) => {
        let ang;
        let num;
        ctx.font = radius * 0.15 + 'px arial';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        for (num = 1; num < 13; num++) {
            ang = (num * Math.PI) / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.85);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.85);
            ctx.rotate(-ang);
        }
    };

    const drawClock = (ctx: CanvasRenderingContext2D, radius: number) => {
        drawFace(ctx, radius);
        drawNumbers(ctx, radius);
        drawTime(ctx, radius);
    };

    useEffect(() => {
        console.log('Clock is mounted', isMounted);
        if (!isMounted) {
            setIsMounted(true);
            return;
        }

        // const canvas = document.getElementById('canvas');
        if (!canvasRef.current) {
            return;
        }
        const context = canvasRef.current.getContext('2d');
        if (!context) {
            return;
        }
        setCtx(context);
        const radius = context.canvas.height / 2;
        context.translate(radius, radius);

        const interval = setInterval(() => {
            setTime(new Date());
            drawClock(context, radius * 0.9);
        }, 1000);

        return () => {
            setIsMounted(false);
            clearInterval(interval);
        };
    }, [isMounted]);

    return (
        <>
            <canvas width={width} height={height} style={{ display: 'block' }} ref={canvasRef}></canvas>
        </>
    );
};
