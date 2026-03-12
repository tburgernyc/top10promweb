'use client'

import { useState } from 'react'
import { Ruler } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { SizeChart } from '@/types/index'

interface SizeGuideProps {
  sizeChart: SizeChart | null
}

export function SizeGuide({ sizeChart }: SizeGuideProps) {
  const [open, setOpen] = useState(false)

  if (!sizeChart?.sizes?.length) return null

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <Ruler size={14} /> Size Guide
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Size Guide" size="lg">
        <p className="text-sm text-platinum/60 mb-4">
          All measurements are in inches. If between sizes, size up.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr>
                {['Size', 'Bust', 'Waist', 'Hips', 'Hollow to Hem'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 text-xs font-semibold text-gold border-b border-white/10"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizeChart.sizes.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                  <td className="px-3 py-2 font-semibold text-ivory">{row.label}</td>
                  <td className="px-3 py-2 text-platinum/80">{row.bust ?? '—'}</td>
                  <td className="px-3 py-2 text-platinum/80">{row.waist ?? '—'}</td>
                  <td className="px-3 py-2 text-platinum/80">{row.hips ?? '—'}</td>
                  <td className="px-3 py-2 text-platinum/80">{row.hollow_to_hem ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sizeChart.notes && (
          <p className="mt-4 text-xs text-platinum/50 border-t border-white/10 pt-4">
            {sizeChart.notes}
          </p>
        )}
      </Modal>
    </>
  )
}
