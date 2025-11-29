import React, {useState, useEffect} from 'react';
import {cn} from '../../lib/utils';
import {Skeleton} from './skeleton';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    onLoad?: () => void;
    priority?: boolean;
}

export function LazyImage({
    src,
    alt,
    className,
    onLoad,
    priority = false,
    ...props
}: LazyImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [imageSrc, setImageSrc] = useState<string>('');

    useEffect(() => {
        setIsLoading(true);
        setError(false);

        const img = new Image();

        if (priority) {
            img.fetchPriority = 'high';
        }

        img.src = src;

        const handleLoad = () => {
            setImageSrc(src);
            setIsLoading(false);
            onLoad?.();
        };

        const handleError = () => {
            setError(true);
            setIsLoading(false);
            console.error(`Failed to load image: ${src}`);
        };

        img.onload = handleLoad;
        img.onerror = handleError;

        // Clean up
        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src, onLoad, priority]);

    if (error) {
        return (
            <div
                className={cn(
                    'bg-muted flex items-center justify-center',
                    className,
                )}
            >
                <span className='text-muted-foreground'>
                    Failed to load image
                </span>
            </div>
        );
    }

    return (
        <>
            {isLoading && <Skeleton className={cn('rounded-md', className)} />}
            <img
                src={imageSrc || src}
                alt={alt}
                loading={priority ? 'eager' : 'lazy'}
                className={cn(
                    'transition-all duration-700',
                    isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100',
                    className,
                )}
                {...props}
            />
        </>
    );
}
