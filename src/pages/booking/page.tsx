"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function BookingPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)

  // map services to Calendly URLs
  const services = [
    { key: 'individual', title: 'Individual Counseling', description: 'Select this to schedule individual counseling.', url: 'https://calendly.com/cemarcounseling-info/30min?hide_event_type_details=1&hide_gdpr_banner=1' },
    { key: 'group', title: 'Group Counseling', description: 'Select this to schedule group counseling.', url: 'https://calendly.com/cemarcounseling-info/group-counseling?hide_event_type_details=1&hide_gdpr_banner=1' },
    { key: 'couples', title: 'Couples Counseling', description: 'Select this to schedule couples counseling.', url: 'https://calendly.com/cemarcounseling-info/couples-counseling?hide_event_type_details=1&hide_gdpr_banner=1' },
    { key: 'free15', title: 'Free 15-Min Consultation', description: 'Select this to schedule free 15-min consultation.', url: 'https://calendly.com/cemarcounseling-info/new-meeting?hide_event_type_details=1&hide_gdpr_banner=1' },
  ]

  const selectedUrl = selectedService ? services.find(s => s.key === selectedService)?.url : null

  // Reinitialize Calendly widget when URL changes
  useEffect(() => {
    if (selectedUrl && typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initInlineWidgets()
    }
  }, [selectedUrl])

  const handleSelectService = (serviceKey: string) => {
    setSelectedService(serviceKey)
  }

  const handleChangeSelection = () => {
    setSelectedService(null)
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
              <h1 id="booking-top" className="text-4xl font-bold mb-4 text-black dark:text-white/90">Book an Appointment</h1>
              <p className="text-lg text-black/70 mb-8 dark:text-white/70">
                Choose the counseling service that best fits your needs, then select your preferred date and time to get started on your wellness journey.
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
                className="bg-gradient-to-br from-[#30D5C8] to-[#008080] rounded-lg p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-black">
                      {services.find(s => s.key === selectedService)?.title}
                    </h2>
                    <p className="text-base text-black font-medium mt-2">
                      Complete your booking by selecting an available time slot below.
                    </p>
                  </div>
                  <div>
                    <button onClick={handleChangeSelection} className="text-sm text-white hover:text-white/80 underline font-medium">
                      Change service
                    </button>
                  </div>
                </div>

                {/* Calendly Inline Widget */}
                {selectedUrl && (
                  <div className="mt-6 bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-[#30D5C8]/20">
                    <iframe
                      src={selectedUrl}
                      width="100%"
                      height="750"
                      frameBorder="0"
                      title="Schedule appointment"
                    ></iframe>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
