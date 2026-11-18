"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect, useMemo } from "react";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad"> {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  lazyBoundary?: string;
  className?: string;
  style?: React.CSSProperties;
  objectFit?: "cover" | "contain" | "fill";
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  quality = 90,
  priority = false,
  placeholder = "empty",
  blurDataURL,
  lazyBoundary = "200px",
  className,
  objectFit = "cover",
  style,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [supportsWebp, setSupportsWebp] = useState(false);
  const [supportsAvif, setSupportsAvif] = useState(false);

  // Check browser support for image formats
  useEffect(() => {
    // Check WebP support
    const checkWebpSupport = async () => {
      try {
        const webpData =
          "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=";
        const blob = await fetch(webpData).then((r) => r.blob());
        setSupportsWebp(blob.size > 0);
      } catch (e) {
        setSupportsWebp(false);
      }
    };

    // Check AVIF support
    const checkAvifSupport = async () => {
      try {
        const avifData =
          "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=";
        const blob = await fetch(avifData).then((r) => r.blob());
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
    // If there was an error loading the optimized image, fallback to original source
    if (hasError) {
      return src;
    }

    // If it's not a local image or it's the logo, use the original source
    if (src.includes("logo")) {
      return src;
    }

    // Extract the base filename
    let fileName;
    if (src.startsWith("/img/")) {
      const basePath = src.replace("/img/", "");
      fileName = basePath.split(".")[0];
    } else {
      // For other paths, just get the filename
      const basePath = src.split("/").pop() || "";
      fileName = basePath.split(".")[0];
    }

    // Determine the best format based on browser support
    let format = "jpg";
    if (supportsAvif) {
      format = "avif";
    } else if (supportsWebp) {
      format = "webp";
    }

    // Use a more conservative size selection to ensure files exist
    // For clean10 (480px original), only use 320px
    // For other images, use appropriate sizes
    let size = 320; // Default to smallest size

    if (fileName === "clean10") {
      // clean10 is only 480px wide, so only 320px version exists
      size = 320;
    } else {
      // For other images, use normal size selection
      if (width > 320) size = 640;
      if (width > 640) size = 1024;
      if (width > 1024) size = 1920;
    }

    return `/optimized-img/${fileName}-${size}.${format}`;
  }, [src, width, supportsWebp, supportsAvif, hasError]);

  // Generate blur placeholder URL
  const placeholderUrl = useMemo(() => {
    if (src.includes("logo")) {
      return undefined;
    }

    let fileName;
    if (src.startsWith("/img/")) {
      const basePath = src.replace("/img/", "");
      fileName = basePath.split(".")[0];
    } else {
      const basePath = src.split("/").pop() || "";
      fileName = basePath.split(".")[0];
    }
    return `/optimized-img/${fileName}-placeholder.jpg`;
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full ${className || ""}`}
      style={style}
      data-oid="l937wfe"
    >
      <Image
        src={getOptimizedSrc} // Use optimized src when available
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          console.warn(`Failed to load image: ${getOptimizedSrc}`);
        }}
        className={`
          transition-opacity duration-500
          w-full h-full
          ${isLoaded ? "opacity-100" : "opacity-0"}
        `}
        style={{
          objectFit,
          zIndex: 2,
          objectPosition: "center",
          position: "relative",
        }}
        sizes={sizes}
        quality={quality}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL || placeholderUrl}
        {...props}
        data-oid="f-jjegv"
      />
    </div>
  );
}
