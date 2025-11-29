import { useEffect, useState } from 'react';

export function useLazyBackground(src: string) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
    };
  }, [src]);

  return isLoaded;
}
