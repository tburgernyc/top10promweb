'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface FAQItem {
  question: string
  answer: string
}

const FAQ_SECTIONS: { heading: string; items: FAQItem[] }[] = [
  {
    heading: 'Shopping & Catalog',
    items: [
      {
        question: 'How does the "one dress per school" guarantee work?',
        answer:
          'When you reserve a dress at your local Top 10 Prom boutique, that specific style and color is locked exclusively for your school — no other student from your school can purchase the same look. This guarantee applies within each boutique location.',
      },
      {
        question: 'Can I browse dresses online before visiting the boutique?',
        answer:
          'Absolutely. Our digital catalog lets you browse, wishlist, and add dresses to your Fitting Room from any device. You can even do a virtual side-by-side try-on by uploading a photo of yourself. Bring your shortlist to your in-store appointment and we\'ll have your picks ready.',
      },
      {
        question: 'How many dresses can I add to my Fitting Room?',
        answer:
          'There\'s no limit — add as many dresses as you like. Your Fitting Room saves automatically across sessions so you can come back anytime.',
      },
      {
        question: 'Are all catalog dresses available in-store?',
        answer:
          'Most catalog styles are stocked at one or more of our locations. Availability varies by boutique and size. During your appointment our stylists can also order styles not currently on the floor.',
      },
    ],
  },
  {
    heading: 'Appointments & Booking',
    items: [
      {
        question: 'Do I need an appointment to visit?',
        answer:
          'Walk-ins are welcome, but we strongly recommend booking a private styling appointment — especially during peak prom season (January–April). Appointments guarantee dedicated one-on-one time with a stylist and priority access to the fitting rooms.',
      },
      {
        question: 'How long is a styling appointment?',
        answer:
          'Appointments are typically 60–90 minutes. If you\'re coming with a group or have a large Fitting Room shortlist, let us know when booking and we\'ll schedule extra time.',
      },
      {
        question: 'Can I bring family or friends?',
        answer:
          'Yes! We encourage it. Each appointment can accommodate up to 4 guests in addition to the shopper. For larger parties please call your boutique directly.',
      },
      {
        question: 'What if I need to cancel or reschedule?',
        answer:
          'You can cancel or reschedule up to 24 hours before your appointment at no charge. Contact your boutique location directly or email us and we\'ll take care of it.',
      },
      {
        question: 'Is a deposit required to book?',
        answer:
          'No deposit is required to book a styling appointment. A deposit may be requested at the time of dress reservation, which varies by boutique.',
      },
    ],
  },
  {
    heading: 'Dresses & Sizing',
    items: [
      {
        question: 'What size range do you carry?',
        answer:
          'We carry sizes 00 through 30, and most of our designers offer custom sizing. Our stylists are trained in formal wear fit and will help you find the right size and any alterations needed.',
      },
      {
        question: 'Do you offer alterations?',
        answer:
          'Yes. Each boutique works with experienced local seamstresses. Alteration pricing varies; your stylist will walk you through options during your appointment.',
      },
      {
        question: 'How far in advance should I shop for prom?',
        answer:
          'We recommend shopping at least 3–4 months before your prom date. Special-order dresses can take 8–14 weeks to arrive, and alterations typically need 4–6 weeks.',
      },
      {
        question: 'Can I return or exchange a dress?',
        answer:
          'Because each dress is reserved exclusively for your school, all sales are final once the school lock is applied. We encourage you to try on multiple options and take your time during your appointment before committing.',
      },
    ],
  },
  {
    heading: 'Your Account',
    items: [
      {
        question: 'Do I need an account to browse?',
        answer:
          'No — browsing and virtual try-on are fully available without an account. An account lets you save your Fitting Room and Wishlist across devices, and receive booking confirmations by email.',
      },
      {
        question: 'How do I share my picks with my parent or guardian?',
        answer:
          'Inside your Fitting Room, tap "Share with Parent" and enter their email address. They\'ll receive a link showing your dress selection with an option to approve and book an appointment.',
      },
      {
        question: 'Is my personal information kept private?',
        answer:
          'Yes. We never sell your data. Your information is used only to manage your appointments and send booking confirmations. See our Privacy Policy for full details.',
      },
    ],
  },
  {
    heading: 'Locations',
    items: [
      {
        question: 'Where are your stores located?',
        answer:
          'Top 10 Prom has 5 owned boutiques in the Atlanta metro area (Marietta, Alpharetta, Buckhead, Kennesaw, and Smyrna) plus a nationwide network of authorized retailers. Use the boutique finder to locate the store nearest you.',
      },
      {
        question: 'Can I book at any location?',
        answer:
          'Yes — you can book an appointment at any of our locations. Your school exclusivity guarantee applies per boutique location, so it\'s possible for the same dress to be available at a different store in our network.',
      },
    ],
  },
]

function FAQAccordion({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false)
  const shouldReduce = useReducedMotion()

  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
        aria-expanded={open}
      >
        <span className="text-ivory font-medium text-sm sm:text-base">{item.question}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={shouldReduce ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
          className="shrink-0 text-gold"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={shouldReduce ? { duration: 0 } : { type: 'spring', stiffness: 340, damping: 32 }}
            className="overflow-hidden"
          >
            <p className="text-platinum/70 text-sm leading-relaxed pb-5 pr-6">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQPage() {
  const shouldReduce = useReducedMotion()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">

      {/* Header */}
      <motion.div
        initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="space-y-3"
      >
        <p className="text-gold text-xs font-semibold tracking-widest uppercase">Help Center</p>
        <h1 className="text-4xl font-bold text-ivory">Frequently Asked Questions</h1>
        <p className="text-platinum/60 text-base max-w-xl">
          Everything you need to know about shopping, appointments, and your Top 10 Prom experience.
          Can&apos;t find your answer?{' '}
          <Link href="/book" className="text-gold hover:underline">Book an appointment</Link>{' '}
          and ask your stylist directly.
        </p>
      </motion.div>

      {/* Sections */}
      {FAQ_SECTIONS.map((section, si) => (
        <motion.section
          key={section.heading}
          initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 30, delay: si * 0.06 }}
        >
          <h2 className="text-lg font-semibold text-gold mb-4 tracking-wide">{section.heading}</h2>
          <div className="glass-light rounded-2xl px-6 divide-y divide-white/10">
            {section.items.map((item) => (
              <FAQAccordion key={item.question} item={item} />
            ))}
          </div>
        </motion.section>
      ))}

      {/* CTA */}
      <motion.div
        initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30, delay: 0.3 }}
        className="glass-heavy rounded-2xl p-8 text-center space-y-4"
      >
        <p className="text-ivory font-semibold text-lg">Still have questions?</p>
        <p className="text-platinum/60 text-sm">
          Our stylists are here to help. Book a free styling appointment at your nearest location.
        </p>
        <Link
          href="/book"
          className="inline-block bg-gold text-onyx font-semibold text-sm px-8 py-3 rounded-full hover:bg-[#c9a227] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ivory"
        >
          Book an Appointment
        </Link>
      </motion.div>
    </div>
  )
}
