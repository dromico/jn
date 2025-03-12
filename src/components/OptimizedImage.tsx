'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect, useMemo } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  lazyBoundary?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  quality = 90,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  lazyBoundary = '200px',
  className,
  style,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [supportsWebp, setSupportsWebp] = useState(false);
  const [supportsAvif, setSupportsAvif] = useState(false);

  // Check browser support for image formats
  useEffect(() => {
    // Check WebP support
    const checkWebpSupport = async () => {
      try {
        const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
        const blob = await fetch(webpData).then(r => r.blob());
        setSupportsWebp(blob.size > 0);
      } catch (e) {
        setSupportsWebp(false);
      }
    };

    // Check AVIF support
    const checkAvifSupport = async () => {
      try {
        const avifData = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        const blob = await fetch(avifData).then(r => r.blob());
        setSupportsAvif(blob.size > 0);
      } catch (e) {
        setSupportsAvif(false);
      }
    };

    checkWebpSupport();
    checkAvifSupport();
  }, []);

  // Generate optimized image path
  const getOptimizedSrc = useMemo(() => {
    /* If it's not a local image or it's the logo, use the original source
    if (!src.includes('/app/img/') || src.includes('logo')) {
      return src;
    }

    // Extract the base filename
    const basePath = src.replace('/app/img/', '');
    const fileName = basePath.split('.')[0];

    // Determine the best format based on browser support
    let format = 'jpg';
    if (supportsAvif) {
      format = 'avif';
    } else if (supportsWebp) {
      format = 'webp';
    }

    // For now, use a fixed size - in a real implementation, this would be responsive
    // based on the container width and device pixel ratio
    const size = width <= 640 ? 640 : width <= 1024 ? 1024 : 1920;

    return `/optimized-img/${fileName}-${size}.${format}`;
    */
    return src;
  }, [src, width, supportsWebp, supportsAvif]);

  // Generate blur placeholder URL
  const placeholderUrl = useMemo(() => {
    /* if (!src.includes('/img/') || src.includes('logo')) {
      return undefined;
    }

    
    const basePath = src.replace('/app/img/', '');
    const fileName = basePath.split('.')[0];
    return `/optimized-img/${fileName}-placeholder.jpg`;
    */
    return undefined;
  }, [src]);

  return (
    <div 
      className={`relative overflow-hidden ${className || ''}`} 
      style={style}
    >
      <Image
        src={src} // Keep original src for Next.js image optimization
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setIsLoaded(true)}
        className={`
          transition-opacity duration-500 
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        style={{ 
          objectFit: 'cover',
          zIndex: 2,
          position: 'relative'
        }}
        sizes={sizes}
        quality={quality}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL || placeholderUrl}
        {...props}
      />
    </div>
  );
}