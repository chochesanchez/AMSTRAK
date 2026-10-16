import type { Dict } from '@/i18n/dictionaries'

export const CARGO_TYPES = ['general', 'hazardous', 'refrigerated', 'oversized', 'fragile', 'high-value', 'other'] as const
export const WEIGHT_UNITS = ['kg', 'lb'] as const
export const DIM_UNITS = ['cm', 'in', 'm'] as const

type CargoType = (typeof CARGO_TYPES)[number]

/** Reads the optional cargo fields rendered by <CargoFields> into readable strings for the email. */
export function cargoFromForm(fd: FormData, c: Dict['cargo']) {
  const get = (k: string) => String(fd.get(k) || '').trim()
  const type = get('cargoType') as CargoType | ''
  const weight = get('weight')
  const dims = [get('dimL'), get('dimW'), get('dimH')]
  return {
    cargoType: type ? c.types[type] : undefined,
    weight: weight ? `${weight} ${get('weightUnit') || 'kg'}` : undefined,
    dimensions: dims.some(Boolean) ? `${dims.map((d) => d || '?').join(' × ')} ${get('dimUnit') || 'cm'}` : undefined,
  }
}
