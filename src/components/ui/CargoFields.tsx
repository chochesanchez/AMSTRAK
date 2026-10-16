'use client'

import { CARGO_TYPES, DIM_UNITS, WEIGHT_UNITS } from '@/lib/cargo'
import { useI18n } from '@/i18n/I18nProvider'

// Optional cargo details shared by the contact form and the quote form: type, weight and dimensions.
export default function CargoFields({ idPrefix }: { idPrefix: string }) {
  const { t } = useI18n()
  const c = t.cargo
  const f = t.form
  const id = (k: string) => `${idPrefix}-${k}`
  const unit = 'h-12 shrink-0 rounded-md border border-am-line bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-am-yellow'

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor={id('cargoType')} className="block text-sm font-medium text-gray-700 mb-1">{f.cargoType}</label>
        <select id={id('cargoType')} name="cargoType" defaultValue="" className="input-field">
          <option value="">{c.choose}</option>
          {CARGO_TYPES.map((k) => (
            <option key={k} value={k}>{c.types[k]}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={id('weight')} className="block text-sm font-medium text-gray-700 mb-1">{f.weight}</label>
        <div className="flex gap-2">
          <input id={id('weight')} name="weight" type="number" inputMode="decimal" min="0" step="any" className="input-field flex-1 min-w-0" />
          <select name="weightUnit" aria-label={`${f.weight} (${WEIGHT_UNITS.join(' / ')})`} defaultValue="kg" className={unit}>
            {WEIGHT_UNITS.map((u) => <option key={u} value={u}>{c.weightUnits[u]}</option>)}
          </select>
        </div>
      </div>
      <fieldset className="sm:col-span-2">
        <legend className="block text-sm font-medium text-gray-700 mb-1">{f.dimensions}</legend>
        <div className="flex gap-2">
          {(['dimL', 'dimW', 'dimH'] as const).map((k, i) => (
            <input
              key={k}
              name={k}
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              aria-label={[c.length, c.width, c.height][i]}
              placeholder={[c.length, c.width, c.height][i]}
              className="input-field flex-1 min-w-0"
            />
          ))}
          <select name="dimUnit" aria-label={`${f.dimensions} (${DIM_UNITS.join(' / ')})`} defaultValue="cm" className={unit}>
            {DIM_UNITS.map((u) => <option key={u} value={u}>{c.dimUnits[u]}</option>)}
          </select>
        </div>
      </fieldset>
    </div>
  )
}
