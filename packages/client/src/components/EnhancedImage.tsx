import React, { useState, useEffect, useRef } from 'react'

interface EnhancedImageProps {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
  onLoad?: () => void
  onError?: () => void
  lazy?: boolean
}

const EnhancedImage: React.FC<EnhancedImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc,
  onLoad,
  onError,
  lazy = true
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [currentSrc, setCurrentSrc] = useState<string>(src)
  const [isInView, setIsInView] = useState(!lazy)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return

    // Fallback for browsers without Intersection Observer support
    if (!window.IntersectionObserver) {
      setIsInView(true)
      return
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observerRef.current?.disconnect()
          }
        })
      },
      {
        rootMargin: '50px'
      }
    )

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [lazy, isInView])

  // Handle image loading
  useEffect(() => {
    if (!isInView) return

    setImageState('loading')
    
    const img = new Image()
    img.onload = () => {
      setImageState('loaded')
      onLoad?.()
    }
    img.onerror = (error) => {
      console.warn('EnhancedImage: Failed to load image:', currentSrc, error)
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        console.log('EnhancedImage: Attempting fallback:', fallbackSrc)
        setCurrentSrc(fallbackSrc)
        setImageState('loading')
      } else {
        console.error('EnhancedImage: All image sources failed for:', alt)
        setImageState('error')
        onError?.()
      }
    }
    img.src = currentSrc
  }, [currentSrc, fallbackSrc, isInView, onLoad, onError])

  // Update src when prop changes
  useEffect(() => {
    if (src !== currentSrc) {
      setCurrentSrc(src)
      setImageState('loading')
    }
  }, [src, currentSrc])

  const getPlaceholderContent = () => {
    if (imageState === 'loading') {
      return (
        <div className="image-placeholder loading">
          <div className="loading-spinner"></div>
          <span>Loading...</span>
        </div>
      )
    }
    
    if (imageState === 'error') {
      return (
        <div className="image-placeholder error">
          <div className="error-icon">📷</div>
          <span>Image unavailable</span>
        </div>
      )
    }
    
    return null
  }

  return (
    <div className={`enhanced-image-container ${className}`}>
      <div 
        ref={imgRef}
        className={`image-wrapper ${imageState}`}
      >
        {imageState === 'loaded' && isInView && (
          <img
            src={currentSrc}
            alt={alt}
            className="enhanced-image"
            style={{ 
              opacity: imageState === 'loaded' ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          />
        )}
        {getPlaceholderContent()}
      </div>
    </div>
  )
}

export default EnhancedImage
