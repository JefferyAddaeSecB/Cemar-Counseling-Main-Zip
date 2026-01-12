"use client"

import { useEffect } from "react"
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
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-[#30D5C8]/5 to-[#008080]/5 rounded-lg p-8 border border-[#30D5C8]/20 shadow-sm"
            >
              <div 
                className="calendly-inline-widget" 
                data-url="https://calendly.com/cemarcounseling-info/30min" 
                style={{
                  minWidth: '320px',
                  height: '800px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                } as React.CSSProperties}
              ></div>
            </motion.div>

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
        </div>
      </section>
    </div>
  )
}

}

