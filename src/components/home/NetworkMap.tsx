'use client'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { MAP_W, MAP_H, MEXICO_PATH, USA_PATH, PLACES, type MapPoint } from './mexicoMap'
import { useI18n } from '@/i18n/I18nProvider'

type Pt = { x: number; y: number }

function curve(a: Pt, b: Pt, bend = 0.16) {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  return `M${a.x},${a.y} Q${mx - dy * bend},${my + dx * bend} ${b.x},${b.y}`
}

const P = PLACES
// Off-map lane ends
const USA = { x: 612, y: 52 }
const CENTRAL_AMERICA = { x: 858, y: 612 }
const ASIA = { x: 30, y: 575 }
const EUROPE = { x: 968, y: 292 }

const LAND: [Pt, Pt, number][] = [
  [P.queretaro, P.monterrey, 0.1],
  [P.queretaro, P.cdmx, -0.2],
  [P.monterrey, P.torreon, 0.14],
  [P.queretaro, P.manzanillo, 0.12],
  [P.queretaro, P.lazaro, -0.1],
  [P.cdmx, P.veracruz, 0.14],
  [P.monterrey, P.altamira, -0.14],
  [P.monterrey, USA, 0.06],
  [P.cdmx, CENTRAL_AMERICA, -0.12],
]
const OCEAN: [Pt, Pt, number][] = [
  [P.manzanillo, ASIA, 0.12],
  [P.lazaro, ASIA, 0.08],
  [P.veracruz, EUROPE, -0.14],
  [P.altamira, EUROPE, -0.1],
]

const OFFICES: MapPoint[] = [P.cdmx, P.monterrey]
const WAREHOUSES: MapPoint[] = [P.monterrey, P.queretaro, P.torreon, P.manzanillo]
const PORTS: MapPoint[] = [P.lazaro, P.veracruz, P.altamira]
// Label placement: [dx, dy, anchor]
const LABEL: Record<string, [number, number, 'start' | 'end']> = {
  Monterrey: [26, -10, 'start'],
  CDMX: [-12, 20, 'end'],
  Torreón: [-14, 5, 'end'],
  Manzanillo: [-14, 5, 'end'],
  'Lázaro Cárdenas': [-12, 18, 'end'],
  Veracruz: [12, 5, 'start'],
  Altamira: [12, 5, 'start'],
}

export default function NetworkMap() {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })
  const reduce = useReducedMotion()
  const land = LAND.map(([a, b, bend]) => curve(a, b, bend))
  const ocean = OCEAN.map(([a, b, bend]) => curve(a, b, bend))
  const draw = (i: number, base: number) => ({
    initial: reduce ? false : { pathLength: 0, opacity: 0 },
    animate: inView ? { pathLength: 1, opacity: 1 } : undefined,
    transition: { duration: 1.1, delay: base + i * 0.1, ease: [0.6, 0.05, 0.3, 1] as const },
  })
  const label = (p: MapPoint) => {
    const [dx, dy, anchor] = LABEL[p.label] ?? [12, 5, 'start']
    return (
      <text x={p.x + dx} y={p.y + dy} textAnchor={anchor} fill="#D7DEEA" fontSize="14" className="map-label">
        {p.label}
      </text>
    )
  }

  return (
    <div ref={ref}>
      <svg viewBox={`10 -24 ${MAP_W - 30} ${MAP_H + 14}`} className="w-full h-auto" role="img" aria-labelledby="network-map-title">
        <title id="network-map-title">{t.map.title}</title>
        <path d={USA_PATH} fill="#152E52" />
        <path d={MEXICO_PATH} fill="#1C3A66" stroke="#34588C" strokeWidth="1.2" strokeLinejoin="round" />

        {ocean.map((d, i) => (
          // Fade in rather than draw: pathLength animation would override the dotted pattern.
          <motion.path
            key={`o-${i}`}
            d={d}
            fill="none"
            stroke="#8FB8E8"
            strokeWidth={2.2}
            strokeDasharray="1 7"
            strokeLinecap="round"
            initial={reduce ? false : { opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.8, delay: 1.4 + i * 0.15 }}
          />
        ))}
        {land.map((d, i) => (
          <motion.path key={`l-${i}`} d={d} fill="none" stroke="#FBB505" strokeWidth={2.4} strokeLinecap="round" {...draw(i, 0.3)} />
        ))}

        {inView &&
          !reduce &&
          [...land, ...ocean].map((d, i) => (
            <circle key={`dot-${i}`} r="4" fill="#FFFFFF" opacity="0">
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur={`${3 + (i % 4) * 0.5}s`} begin={`${1.8 + i * 0.15}s`} repeatCount="indefinite" />
              <animateMotion dur={`${3 + (i % 4) * 0.5}s`} begin={`${1.8 + i * 0.15}s`} repeatCount="indefinite" path={d} />
            </circle>
          ))}

        {/* Off-map destinations */}
        <text x={USA.x + 12} y={USA.y + 4} fill="#FFFFFF" fontSize="15" fontWeight="700" letterSpacing="1" className="map-label">{t.map.usa}</text>
        <text x={CENTRAL_AMERICA.x - 8} y={CENTRAL_AMERICA.y - 2} textAnchor="end" fill="#FFFFFF" fontSize="15" fontWeight="700" className="map-label">{t.map.centralAmerica}</text>
        <text x={ASIA.x + 4} y={ASIA.y - 12} fill="#8FB8E8" fontSize="15" fontWeight="700" letterSpacing="1" className="map-label">{t.map.asia}</text>
        <text x={EUROPE.x - 4} y={EUROPE.y - 12} textAnchor="end" fill="#8FB8E8" fontSize="15" fontWeight="700" letterSpacing="1" className="map-label">{t.map.europe}</text>

        {PORTS.map((p) => (
          <g key={p.label} className="map-label-minor">
            <circle cx={p.x} cy={p.y} r="4.5" fill="#8FB8E8" />
            {label(p)}
          </g>
        ))}
        {WAREHOUSES.map((p) => (
          <g key={`w-${p.label}`}>
            <rect x={p.x - 6} y={p.y - 6} width="12" height="12" rx="2" fill="#FBB505" stroke="#0B1D3A" strokeWidth="2" />
            {p !== P.queretaro && label(p)}
          </g>
        ))}
        {OFFICES.map((p) => (
          <circle key={`of-${p.label}`} cx={p.x} cy={p.y} r="5" fill="#FFFFFF" stroke="#0B1D3A" strokeWidth="2" transform={p === P.monterrey ? 'translate(13 0)' : undefined} />
        ))}
        {label(P.cdmx)}

        {/* Headquarters */}
        <circle cx={P.queretaro.x} cy={P.queretaro.y} r="30" fill="#F18606" opacity="0.18" />
        <circle cx={P.queretaro.x} cy={P.queretaro.y} r="9" fill="#F18606" stroke="#FFFFFF" strokeWidth="2.5" />
        <text x={P.queretaro.x - 16} y={P.queretaro.y - 14} textAnchor="end" fill="#FFFFFF" fontSize="17" fontWeight="700" className="map-label-strong">
          {t.map.hq}
        </text>
      </svg>
      <div className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-white/75">
        <span className="flex items-center gap-2.5"><span className="h-3 w-3 shrink-0 rounded-full bg-white ring-2 ring-am-ink" /> {t.map.legendOffice}</span>
        <span className="flex items-center gap-2.5"><span className="h-3 w-3 shrink-0 rounded-sm bg-am-yellow" /> {t.map.legendWarehouse}</span>
        <span className="flex items-center gap-2.5"><span className="h-0.5 w-5 shrink-0 bg-am-yellow" /> {t.map.legendLand}</span>
        <span className="flex items-center gap-2.5"><span className="w-5 shrink-0 border-t-2 border-dotted border-[#8FB8E8]" /> {t.map.legendOcean}</span>
      </div>
    </div>
  )
}
