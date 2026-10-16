'use client'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

// Shows the real value in the server HTML; once on screen it counts up from 0 to it.
// Works with prefixes/suffixes and thousands separators ("240,000", "17+", "97.9%", "4.8/5").
export default function CountUp({ value, duration = 1.2 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(value)
  const started = useRef(false)

  useEffect(() => {
    const match = value.match(/^(\D*)([\d,]*\.?\d+)(.*)$/)
    if (!match || reduce || !inView || started.current) return
    started.current = true
    const [, prefix, num, suffix] = match
    const target = parseFloat(num.replace(/,/g, ''))
    const decimals = num.includes('.') ? num.split('.')[1].length : 0
    const commas = num.includes(',')
    const format = (v: number) => `${prefix}${commas ? Math.round(v).toLocaleString('en-US') : v.toFixed(decimals)}${suffix}`
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(format(v)),
      onComplete: () => setDisplay(value),
    })
    return () => {
      controls.stop()
      started.current = false
      setDisplay(value)
    }
  }, [inView, reduce, value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  )
}
