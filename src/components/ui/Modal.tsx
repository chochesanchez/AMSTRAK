'use client'

import React, { useEffect, useRef } from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

interface ModalProps {
  open: boolean
  title?: string
  children?: React.ReactNode
  onClose: () => void
  closeLabel?: string
}

export default function Modal({ open, title, children, onClose, closeLabel = 'Close' }: ModalProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4">
      <div className="absolute inset-0 bg-am-ink/60" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="am-modal-title" className="relative bg-white rounded-lg shadow-2xl max-w-md w-full p-7">
        <CheckCircleIcon className="h-9 w-9 text-am-ink" aria-hidden />
        {title && <h2 id="am-modal-title" className="mt-4 font-display text-3xl font-bold">{title}</h2>}
        <div className="mt-2 text-am-muted leading-relaxed">{children}</div>
        <button ref={closeRef} onClick={onClose} className="mt-6 btn-primary">{closeLabel}</button>
      </div>
    </div>
  )
}
