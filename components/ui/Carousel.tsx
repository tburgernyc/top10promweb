'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { DressImage } from '@/types/index'
import Image from 'next/image'

interface CarouselProps {
  images: DressImage[]
  alt: string
  aspectRatio?: 'portrait' | 'square'
}

export function Carousel({ images, alt, aspectRatio = 'portrait' }: CarouselProps) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const shouldReduce = useReducedMotion()

  const go = (next: number) => {
    setDirection(next > index ? 1 : -1)
    setIndex(next)
  }

  const prev = () => go(index === 0 ? images.length - 1 : index - 1)
  const next = () => go(index === images.length - 1 ? 0 : index + 1)

  const variants = {
    enter: (d: number) => ({ x: shouldReduce ? 0 : d * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: shouldReduce ? 0 : d * -60, opacity: 0 }),
  }

  const current = images[index]

  return (
    <div className={['relative overflow-hidden rounded-2xl bg-onyx', aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'].join(' ')}>
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute inset-0"
        >
          <Image
            src={current.url}
            alt={current.alt ?? alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass-heavy text-ivory hover:bg-black/80 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass-heavy text-ivory hover:bg-black/80 transition-colors"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Image ${i + 1}`}
                className={[
                  'rounded-full transition-all duration-200',
                  i === index ? 'w-4 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-white/40',
                ].join(' ')}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
