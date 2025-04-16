import React, { useEffect, useState } from 'react';

interface SpinnerProps {
    isVisible: boolean;
    scale?: number;
}

export const Spinner: React.FC<SpinnerProps> = ({ isVisible, scale = 0.6 }) => {
    const [_, setAnimating] = useState(false);

    useEffect(() => {
        setAnimating(isVisible);
    }, [isVisible]);

    const barWidth = 3 * scale;  // px
    const barHeight = 12 * scale; // px
    const spinnerSize = 40 * scale; // px
    const translateY = -(spinnerSize / 2) + barHeight / 2;

    const bars = Array.from({ length: 12 }, (_, index) => {
        const rotation = index * 30;
        const delay = `${index * 0.1}s`;

        return (
            <div
                key={index}
                className="absolute bg-accent-foreground rounded opacity-20 animate-spinnerFade"
                style={{
                    width: `${barWidth}px`,
                    height: `${barHeight}px`,
                    transform: `rotate(${rotation}deg) translateY(${translateY}px)`,
                    transformOrigin: 'center center',
                    animationDelay: delay,
                }}
            />
        );
    });

    return (
        <div
            className="relative"
            style={{
                width: `${spinnerSize}px`,
                height: `${spinnerSize}px`,
                display: isVisible ? 'block' : 'none',
            }}
        >
            {bars}
        </div>
    );
};
