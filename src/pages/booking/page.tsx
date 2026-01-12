"use client"

import { motion } from "framer-motion"

export default function BookingPage() {
  // map services to Calendly URLs
  const services = [
    { key: 'individual', title: 'Individual Counseling', description: 'Select this to schedule individual counseling.', url: 'https://calendly.com/cemarcounseling-info/30min' },
    { key: 'group', title: 'Group Counseling', description: 'Select this to schedule group counseling.', url: 'https://calendly.com/cemarcounseling-info/group-counseling' },
    { key: 'couples', title: 'Couples Counseling', description: 'Select this to schedule couples counseling.', url: 'https://calendly.com/cemarcounseling-info/couples-counseling' },
    { key: 'free15', title: 'Free 15-Min Consultation', description: 'Select this to schedule free 15-min consultation.', url: 'https://calendly.com/cemarcounseling-info/new-meeting' },
  ]

  const handleSelectService = (url: string) => {
    window.open(url, '_blank')
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {services.map((service) => (
                <motion.button
                  key={service.key}
                  onClick={() => handleSelectService(service.url)}
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
          </div>
        </div>
      </section>
    </div>
  )
}
