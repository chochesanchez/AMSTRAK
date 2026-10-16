import type { Lang } from '../config'
import { en, type Dict } from './en'
import { es } from './es'

const DICTS: Record<Lang, Dict> = { en, es }

export const getDictionary = (lang: Lang): Dict => DICTS[lang]
export type { Dict }

/** Replaces {key} placeholders in a dictionary string. */
export function fmt(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ''))
}
