"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function BookingPage() {
  useEffect(() => {
    // Load Calendly script
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      document.body.appendChild(script)

      // Cleanup
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
      }
    }
  }, [])

  // map services to Calendly URLs (update as you provide links)
  const serviceToUrl: Record<string, string> = {
    individual: 'https://calendly.com/cemarcounseling-info/30min',
    free15: 'https://calendly.com/cemarcounseling-info/new-meeting',
    // placeholders for future links
    group: 'https://calendly.com/cemarcounseling-info/30min',
    couples: 'https://calendly.com/cemarcounseling-info/30min',
  }

  // allow pre-selection via query param: ?calendly=free15 or ?calendly=individual
  const [selectedService, setSelectedService] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    const param = new URLSearchParams(window.location.search).get('calendly')
    return param && Object.keys(serviceToUrl).includes(param) ? param : null
  })

  const calendlyUrl = selectedService ? serviceToUrl[selectedService] : null
  return (
    <div className="pt-16">
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-4 text-black dark:text-white/90">Book an Appointment</h1>
              <p className="text-lg text-black/70 mb-8 dark:text-white/70">
                Select your preferred date and time from the calendar below. One of our therapists will confirm your appointment shortly.
              </p>
            </motion.div>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* If no service selected show choices; otherwise show Calendly widget for chosen service */}
            {!selectedService ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                {[
                  { key: 'individual', title: 'Individual Counseling' },
                  { key: 'group', title: 'Group Counseling' },
                  { key: 'couples', title: 'Couples Counseling' },
                  { key: 'free15', title: 'Free 15-Min Consultation' },
                ].map((opt) => (
                  <motion.button
                    key={opt.key}
                    onClick={() => setSelectedService(opt.key)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-left bg-card p-6 rounded-lg shadow hover:shadow-lg border border-[#30D5C8]/10"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{opt.title}</h3>
                        <p className="text-sm text-muted-foreground">Select this to schedule {opt.title.toLowerCase()}.</p>
                      </div>
                      <div className="ml-4">
                        <span className="inline-block rounded-full bg-[#30D5C8] text-black px-3 py-1 font-medium text-sm">
                          Select
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-gradient-to-br from-[#30D5C8]/5 to-[#008080]/5 rounded-lg p-6 border border-[#30D5C8]/20 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedService === 'free15' ? 'Free 15-Min Consultation' : selectedService === 'individual' ? 'Individual Counseling' : selectedService === 'group' ? 'Group Counseling' : 'Couples Counseling'}</h2>
                    <p className="text-sm text-muted-foreground">You will be directed to the scheduler to choose a date & time.</p>
                  </div>
                  <div>
                    <button onClick={() => setSelectedService(null)} className="text-sm text-[#008080] underline">Change selection</button>
                  </div>
                </div>

                <div className="mt-4">
                  <div
                    className="calendly-inline-widget"
                    data-url={calendlyUrl ?? ''}
                    style={{ minWidth: '320px', height: '800px', borderRadius: '8px', overflow: 'hidden' } as React.CSSProperties}
                  ></div>
                </div>
              </motion.div>
            )}
          </div>

            <style>{`
              /* Calendly styling to match CEMAR theme */
              .calendly-inline-widget {
                --cal-primary-color: #30D5C8;
                --cal-secondary-color: #008080;
              }
              
              /* Dark mode support */
              @media (prefers-color-scheme: dark) {
                .calendly-inline-widget {
                  --cal-text-color: #ffffff;
                  --cal-bg-color: #1a1a1a;
                }
              }
            `}</style>
        </div>
      </section>
    </div>
  )
}
