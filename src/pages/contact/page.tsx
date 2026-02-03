"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Phone, CheckCircle } from "lucide-react"
import { LazyImage } from "../../components/ui/lazy-image"
import { useTheme } from "../../components/theme-provider"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { theme } = useTheme()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormState({ name: "", email: "", message: "" })
    }, 1500)
  }

  const handleSendAnother = () => {
    setIsSubmitted(false)
    setFormState({ name: "", email: "", message: "" })
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 50,
      },
    }),
  }

  const formVariants = {
    hidden: { 
        opacity: 0, 
        y: 50,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15,
            staggerChildren: 0.1
        }
    }
  }

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15
        }
    },
    focus: {
        scale: 1.02,
        boxShadow: '0 0 0 2px rgba(48, 213, 200, 0.2)',
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 10
        }
    }
  }

  const faqVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15
        }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15
        }
    },
    hover: {
        y: -5,
        scale: 1.02,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 10
        }
    }
  }

  return (
    <div className="pt-16">
      {/* Contact Header */}
      <section className='relative h-[60vh] flex items-center overflow-hidden'>
        {/* Background Image */}
        <motion.div
          className='absolute inset-0 z-0'
          initial={{scale: 1, rotate: 0}}
          animate={{
            scale: [1, 1.2, 1.1, 1.3, 1],
            rotate: [0, 1, -1, 2, 0],
            filter: [
              'brightness(0.7) saturate(1)',
              'brightness(0.8) saturate(1.2)',
              'brightness(0.7) saturate(1.1)',
              'brightness(0.9) saturate(1.3)',
              'brightness(0.7) saturate(1)',
            ],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'reverse',
            ease: 'easeInOut',
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        >
          <LazyImage
            src='/images/communication-connection.jpg'
            alt='Communication and connection'
            className='w-full h-full object-cover'
          />
          <motion.div
            className='absolute inset-0'
            animate={{
              backgroundColor: [
                'rgba(0, 0, 0, 0.4)',
                'rgba(0, 0, 0, 0.5)',
                'rgba(0, 0, 0, 0.3)',
                'rgba(0, 0, 0, 0.6)',
                'rgba(0, 0, 0, 0.4)',
              ],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1 variants={fadeIn} custom={0} className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Contact{' '}
              <span className='text-[#30D5C8]'>
                Us
              </span>
            </motion.h1>
            <motion.p variants={fadeIn} custom={1} className="text-xl text-white/90">
              Have questions about our services? Reach out to us and our team will get back to you soon.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background relative overflow-hidden">
        {/* 3D Background Elements */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{
            x: [50, 100, 50],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeIn}
              custom={0}
              className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}
            >
              Get in Touch
            </motion.h2>
            <motion.p
              variants={fadeIn}
              custom={1}
              className={`text-xl ${theme === 'dark' ? 'text-white/80' : 'text-black/80'} max-w-2xl mx-auto`}
            >
              Have questions about our services? Reach out to us and our team will get back to you soon.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={formVariants}
              className="bg-card p-8 rounded-lg shadow-md border relative overflow-hidden"
            >
              <motion.div
                className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 45, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />

              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="flex flex-col items-center justify-center h-full text-center py-12 relative z-10"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                    >
                      <CheckCircle className="h-16 w-16 text-primary mb-4" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl font-semibold mb-2"
                    >
                      Thank You!
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-muted-foreground"
                    >
                      Your message has been sent successfully. We will get back to you soon.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-6"
                    >
                      <Button
                        variant="outline"
                        onClick={handleSendAnother}
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={formVariants}
                    className="space-y-6 relative z-10"
                    onSubmit={handleSubmit}
                  >
                    <motion.div variants={inputVariants}>
                      <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                        Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30D5C8] ${theme === 'dark' ? 'placeholder:text-white/70 text-white bg-transparent' : 'placeholder:text-black/70 text-black'}`}
                      />
                    </motion.div>

                    <motion.div variants={inputVariants}>
                      <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                        className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30D5C8] ${theme === 'dark' ? 'placeholder:text-white/70 text-white bg-transparent' : 'placeholder:text-black/70 text-black'}`}
                      />
                    </motion.div>

                    <motion.div variants={inputVariants}>
                      <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="Your message"
                        required
                        className={`min-h-[150px] w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30D5C8] ${theme === 'dark' ? 'placeholder:text-white/70 text-white bg-transparent' : 'placeholder:text-black/70 text-black'}`}
                      />
                    </motion.div>

                    <motion.div variants={inputVariants}>
                      <Button
                        type="submit"
                        className="w-full bg-[#30D5C8] hover:bg-[#30D5C8]/90 text-black"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Contact Information */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <motion.h2
                  variants={fadeIn}
                  custom={0}
                  className={`text-2xl md:text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                >
                  Other Ways to Reach Us
                </motion.h2>
                <motion.div
                  variants={fadeIn}
                  custom={1}
                  className="max-w-2xl mx-auto space-y-6"
                >
                  <div className="flex flex-col items-center">
                    <motion.div
                      className="bg-[#008080]/10 p-3 rounded-full mb-4"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(0, 128, 128, 0.2)",
                      }}
                    >
                      <Phone className="h-6 w-6 text-[#008080]" />
                    </motion.div>
                    <div className="text-center">
                      <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Phone</h3>
                      <p>
                        <a href="tel:+19059092400" className={`${theme === 'dark' ? 'text-white hover:text-[#30D5C8]' : 'text-black hover:text-[#008080]'} transition-colors`}>
                          (905) 909-2400
                        </a>
                      </p>
                      <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-white/80' : 'text-black/80'}`}>Monday-Friday, 9am-5pm</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <motion.div
                      className="bg-[#008080]/10 p-3 rounded-full mb-4"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(0, 128, 128, 0.2)",
                      }}
                    >
                      <Mail className="h-6 w-6 text-[#008080]" />
                    </motion.div>
                    <div className="text-center">
                      <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Email</h3>
                      <p>
                        <a href="mailto:info@cemarcounseling.com" className={`${theme === 'dark' ? 'text-white hover:text-[#30D5C8]' : 'text-black hover:text-[#008080]'} transition-colors`}>
                          info@cemarcounseling.com
                        </a>
                      </p>
                      <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-white/80' : 'text-black/80'}`}>We'll respond within 24 hours</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeIn} custom={2} className="bg-[#008080] p-6 rounded-lg mt-8">
                <h3 className="font-medium mb-2 text-white">Office Hours</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-white">
                  <div>Monday - Friday</div>
                  <div>9:00 AM - 7:00 PM</div>
                  <div>Saturday</div>
                  <div>10:00 AM - 4:00 PM</div>
                  <div>Sunday</div>
                  <div>Closed</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeIn}
              custom={0}
              className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              variants={fadeIn}
              custom={1}
              className={`text-xl ${theme === 'dark' ? 'text-white/80' : 'text-black/80'} max-w-2xl mx-auto`}
            >
              Find answers to common questions about our services
            </motion.p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-card p-6 rounded-lg border"
            >
              <h3 className="font-semibold mb-2">How do I schedule my first appointment?</h3>
              <p className="text-muted-foreground">
                You can schedule an appointment by using our online booking system, calling our office, or sending us an
                email. New clients will need to complete intake forms before their first session.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-card p-6 rounded-lg border"
            >
              <h3 className="font-semibold mb-2">Do you accept insurance?</h3>
              <p className="text-muted-foreground">
                Yes, we accept many major insurance plans including OAP (Ontario Autism Program), extended health benefits, 
                and various private insurance providers. Please contact our office with your insurance information to
                verify your coverage before your first appointment.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-card p-6 rounded-lg border"
            >
              <h3 className="font-semibold mb-2">How long are therapy sessions?</h3>
              <p className="text-muted-foreground">
                Individual therapy sessions are typically 50 minutes, while group sessions are 90 minutes. The frequency
                of sessions will be determined based on your needs and treatment plan.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-card p-6 rounded-lg border"
            >
              <h3 className="font-semibold mb-2">What is your cancellation policy?</h3>
              <p className="text-muted-foreground">
                We require 24 hours notice for cancellations. Late cancellations or no-shows are non refundable.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Share Feedback Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Share Your Feedback
            </h2>
            <p className={`text-lg mb-6 ${
              theme === 'dark' ? 'text-white/80' : 'text-black/80'
            }`}>
              If you'd like to share your experience, you can leave a review (optional).
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-6 text-lg"
              >
                <a
                  href="https://g.page/r/CcGpGsA10-8QEAE/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    // Track analytics if available
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                      (window as any).gtag('event', 'review_link_click', {
                        source: 'contact_page'
                      });
                    }
                  }}
                >
                  Leave a Review
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

