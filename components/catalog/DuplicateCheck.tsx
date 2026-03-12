'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { ShieldCheck, AlertTriangle, Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { duplicateCheckSchema, type DuplicateCheckValues } from '@/lib/schemas'

interface DuplicateCheckProps {
  dressId: string
  dressName: string
}

type CheckResult = 'available' | 'taken' | null

export function DuplicateCheck({ dressId, dressName }: DuplicateCheckProps) {
  const shouldReduce = useReducedMotion()
  const [result, setResult] = useState<CheckResult>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DuplicateCheckValues>({
    resolver: zodResolver(duplicateCheckSchema),
    defaultValues: { dress_id: dressId },
  })

  const onSubmit = async (data: DuplicateCheckValues) => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/duplicate-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      setResult(json.is_available ? 'available' : 'taken')
    } catch {
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl glass-light p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} className="text-gold shrink-0" />
        <div>
          <h3 className="text-sm font-semibold text-ivory">No-Duplicate Guarantee</h3>
          <p className="text-xs text-platinum/60">Check if this dress is available for your school&apos;s prom</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <input type="hidden" {...register('dress_id')} />

        <Input
          label="Your School Name"
          placeholder="e.g. Westside High School"
          error={errors.school_name?.message}
          required
          {...register('school_name')}
        />

        <Input
          label="Your Prom Date"
          type="date"
          error={errors.event_date?.message}
          required
          {...register('event_date')}
        />

        <Button type="submit" loading={loading} fullWidth size="sm">
          <Search size={14} />
          Check Availability
        </Button>
      </form>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result}
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className={[
              'rounded-xl p-4 flex items-start gap-3',
              result === 'available'
                ? 'bg-green-500/10 border border-green-500/20'
                : 'bg-red-500/10 border border-red-500/20',
            ].join(' ')}
          >
            {result === 'available' ? (
              <>
                <ShieldCheck size={18} className="text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-400">
                    {dressName} is available!
                  </p>
                  <p className="text-xs text-green-400/70 mt-0.5">
                    No one from your school has reserved this dress. Book now to claim it.
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-400">
                    Already reserved for your school
                  </p>
                  <p className="text-xs text-red-400/70 mt-0.5">
                    Someone from your school has already reserved {dressName}. Browse other stunning options!
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
