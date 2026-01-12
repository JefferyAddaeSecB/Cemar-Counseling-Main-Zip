"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function BookingPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [calendlyUrl, setCalendlyUrl] = useState<string | null>(null)

  // map services to Calendly URLs
  const services = [
    { key: 'individual', title: 'Individual Counseling', description: 'Select this to schedule individual counseling.', url: 'https://calendly.com/cemarcounseling-info/30min' },
    { key: 'group', title: 'Group Counseling', description: 'Select this to schedule group counseling.', url: 'https://calendly.com/cemarcounseling-info/group-counseling' },
    { key: 'couples', title: 'Couples Counseling', description: 'Select this to schedule couples counseling.', url: 'https://calendly.com/cemarcounseling-info/couples-counseling' },
    { key: 'free15', title: 'Free 15-Min Consultation', description: 'Select this to schedule free 15-min consultation.', url: 'https://calendly.com/cemarcounseling-info/new-meeting' },
  ]

  // Load Calendly script once on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  // When user selects a service, set the URL and reinitialize widget
  useEffect(() => {
    if (selectedService && typeof window !== 'undefined' && (window as any).Calendly) {
      const serviceUrl = services.find(s => s.key === selectedService)?.url
      setCalendlyUrl(serviceUrl || null)
      
      // Reinitialize Calendly widget with new URL
      setTimeout(() => {
        (window as any).Calendly.initInlineWidgets()
      }, 100)
    }
  }, [selectedService])

  const handleSelectService = (serviceKey: string) => {
    setSelectedService(serviceKey)
  }

  const handleChangeSelection = () => {
    setSelectedService(null)
    setCalendlyUrl(null)
  }


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
            {!selectedService ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                {services.map((service) => (
                  <motion.button
                    key={service.key}
                    onClick={() => handleSelectService(service.key)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-left bg-card p-6 rounded-lg shadow hover:shadow-lg border border-[#30D5C8]/10"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
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
                    <h2 className="text-xl font-semibold">
                      {services.find(s => s.key === selectedService)?.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Select your preferred date and time from the calendar below.
                    </p>
                  </div>
                  <div>
                    <button onClick={handleChangeSelection} className="text-sm text-[#008080] hover:text-[#008080]/80 underline">
                      Change selection
                    </button>
                  </div>
                </div>

                {/* Calendly Inline Widget */}
                <div className="mt-6 bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-[#30D5C8]/20">
                  <div
                    className="calendly-inline-widget"
                    data-url={calendlyUrl}
                    style={{ minHeight: '750px' } as React.CSSProperties}
                  ></div>
                </div>
              </motion.div>
            )}
          </div>

          <style>{`
            .calendly-inline-widget {
              --cal-primary-color: #30D5C8;
              --cal-secondary-color: #008080;
            }
          `}</style>
        </div>
      </section>
    </div>
  )
}
