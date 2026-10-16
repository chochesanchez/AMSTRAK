'use client'
import Image from 'next/image'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { useI18n } from '@/i18n/I18nProvider'

// The Amstrak arrow travels along the route as you scroll through the section; each step lights up as it passes.
export default function OrderFlow() {
  const { t } = useI18n()
  const FLOW = t.flow
  const ref = useRef<HTMLOListElement | null>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.55'] })
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 28 })
  const pos = useTransform(p, (v) => `${Math.min(100, Math.max(0, v * 100))}%`)
  const [reached, setReached] = useState(reduce ? FLOW.length : 0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduce) return
    setReached(Math.min(FLOW.length, Math.floor(v * (FLOW.length - 1) + 1.02)))
  })

  const marker = (
    <span className="grid place-items-center h-11 w-11 rounded-md bg-white shadow-lg">
      <Image src="/brand/amstrak-mark.png" alt="" width={33} height={28} className="h-7 w-auto" />
    </span>
  )

  return (
    <ol ref={ref} className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-8 pl-16 md:pl-0">
      {/* Route: vertical on phones, horizontal on desktop */}
      <span className="absolute left-[22px] top-0 bottom-0 w-1 md:hidden route-dashes-v" aria-hidden />
      <span className="hidden md:block absolute left-0 right-0 top-[22px] h-1 route-dashes" aria-hidden />
      {!reduce && (
        <>
          <motion.span className="md:hidden absolute left-[2px] z-20 -translate-y-1/2" style={{ top: pos }} aria-hidden>
            {marker}
          </motion.span>
          <motion.span className="hidden md:block absolute top-0 z-20 -translate-x-1/2" style={{ left: pos }} aria-hidden>
            {marker}
          </motion.span>
        </>
      )}
      {FLOW.map((f, i) => {
        const on = i < reached
        return (
          <li key={f.title} className="relative">
            <span
              className={`absolute -left-16 md:static z-10 grid place-items-center h-12 w-12 rounded-full font-display text-xl font-bold transition-colors duration-500 ${
                on ? 'bg-am-yellow text-am-ink' : 'bg-white/10 text-white/50'
              }`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className={`block md:mt-6 font-display text-xl font-bold transition-colors duration-500 ${on ? 'text-white' : 'text-white/50'}`}>{f.title}</span>
            <span className={`block mt-2 leading-relaxed transition-colors duration-500 ${on ? 'text-white/75' : 'text-white/40'}`}>{f.text}</span>
          </li>
        )
      })}
    </ol>
  )
}
