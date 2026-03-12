import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Sparkles, MapPin, Star, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | Top 10 Prom',
  description:
    'Top 10 Prom is the largest group of prom dress retailers in the United States, specializing in Prom, Homecoming, Evening, and Pageant dresses.',
}

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'No-Duplicate Guarantee',
    body: 'Your dress is reserved exclusively for you at your school for prom night. No other student can book the same gown for the same event.',
  },
  {
    icon: Sparkles,
    title: 'Exclusive Designs',
    body: 'Hard-to-find, limited-edition dresses that can only be found at a Top 10 Prom store. Our designers create styles you won\'t see anywhere else.',
  },
  {
    icon: MapPin,
    title: '5+ Atlanta Boutiques',
    body: 'Multiple locations across the Atlanta metro area — Marietta, Alpharetta, Buckhead, Smyrna, and Kennesaw — so finding your dream dress is never far away.',
  },
  {
    icon: Star,
    title: 'Premium Designers',
    body: 'Carrying Johnathan Kayne, Ashley Lauren, Jessica Angel, Kate Parker, Chandalier, and 2Cute Homecoming — the top names in prom fashion.',
  },
  {
    icon: Users,
    title: 'Personal Styling',
    body: 'One-on-one appointments with expert stylists. No rushing, no crowds — just you and the perfect dress for your night.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-dvh pb-24">
      <div className="max-w-3xl mx-auto px-4 pt-10 space-y-16">

        {/* Hero */}
        <div className="space-y-4">
          <p className="text-[11px] text-gold font-semibold tracking-[0.22em] uppercase">About Us</p>
          <h1 className="text-4xl sm:text-5xl font-black text-ivory leading-tight">
            Where Style<br />
            <span className="text-gold">Meets Splendor.</span>
          </h1>
          <p className="text-platinum/70 text-base leading-relaxed max-w-2xl">
            Top 10 Prom is part of the largest network of prom dress retailers in the United States,
            specializing in Prom, Homecoming, Evening, and Pageant dresses. Our Atlanta boutiques
            bring you exclusive designs, outstanding customer service, and a guarantee no other
            store offers: your dress, your school, your night — no duplicates, ever.
          </p>
        </div>

        {/* Mission */}
        <div className="glass-light rounded-3xl p-8 sm:p-10 border border-gold/15 space-y-4"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, transparent 60%)' }}
        >
          <p className="text-[11px] text-gold font-semibold tracking-[0.22em] uppercase">Our Mission</p>
          <blockquote className="text-ivory text-xl sm:text-2xl font-bold leading-snug">
            &ldquo;To ensure every woman finds her dream dress for any special occasion — whether it&apos;s
            prom, homecoming, a sorority formal, winter gala, or charity ball.&rdquo;
          </blockquote>
          <p className="text-platinum/60 text-sm leading-relaxed">
            Our collection celebrates every style and size — from petite to plus, ball gowns to
            backless, sequined and lace to modern boho. Our talented designers create elegant evening
            gowns and chic styles with eye-catching couture, inspired by the latest red carpet trends.
          </p>
        </div>

        {/* Values grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-ivory">What Sets Us Apart</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="glass-light rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-gold" />
                </div>
                <div>
                  <h3 className="text-ivory font-semibold text-sm">{title}</h3>
                  <p className="text-platinum/55 text-xs mt-1 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Designers */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-ivory">Our Designer Labels</h2>
          <p className="text-platinum/60 text-sm leading-relaxed">
            Top 10 Prom carries an exclusive selection of designer collections. These labels are
            available only through authorized Top 10 Prom retailers — you won&apos;t find them at a
            department store.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {['Johnathan Kayne', 'Ashley Lauren', 'Jessica Angel', 'Kate Parker', 'Chandalier', '2Cute Homecoming'].map((d) => (
              <Link
                key={d}
                href={`/catalog?designer=${encodeURIComponent(d)}`}
                className="text-sm text-ivory bg-white/5 border border-white/10 hover:border-gold/30 hover:text-gold rounded-full px-4 py-1.5 transition-colors"
              >
                {d}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center font-semibold text-sm px-8 py-4 rounded-2xl bg-gold text-onyx hover:bg-[#c9a227] transition-all"
          >
            Shop the Collection
          </Link>
          <Link
            href="/book"
            className="inline-flex items-center justify-center font-medium text-sm px-8 py-4 rounded-2xl glass-light border border-white/10 text-ivory hover:bg-white/10 transition-all"
          >
            Book an Appointment
          </Link>
        </div>

      </div>
    </div>
  )
}
