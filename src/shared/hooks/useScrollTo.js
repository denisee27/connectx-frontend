import { useCallback, useState } from 'react';

export const useScrollTo = () => {
    const [isScrolling, setIsScrolling] = useState(false);

    const scrollToElement = useCallback((elementId, options = {}) => {
        const { offset = 0, duration = 500 } = options;

        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`Element with id "${elementId}" not found.`);
            return;
        }

        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
            else {
                setIsScrolling(false);
            }
        };

        const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        setIsScrolling(true);
        requestAnimationFrame(animation);
    }, []);

    return { scrollToElement, isScrolling };
};
