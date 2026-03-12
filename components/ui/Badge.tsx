type BadgeVariant = 'gold' | 'platinum' | 'green' | 'red' | 'blue' | 'ghost'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  gold: 'bg-gold/20 text-gold border-gold/30',
  platinum: 'bg-platinum/10 text-platinum border-platinum/20',
  green: 'bg-green-500/15 text-green-400 border-green-500/25',
  red: 'bg-red-500/15 text-red-400 border-red-500/25',
  blue: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
  ghost: 'bg-white/5 text-ivory/60 border-white/10',
}

export function Badge({ variant = 'ghost', children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
