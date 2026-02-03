"use client"

import { Button } from "../../components/ui/button"
import { motion } from "framer-motion"
import { Home, HelpCircle, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../../components/theme-provider"
import { useState } from "react"

export default function FAQPage() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
      },
    }),
  }

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I schedule my first appointment?",
          answer: "You can schedule an appointment by using our online booking system on our website, calling our office at (905) 909-2400, or sending us an email at info@cemarcounseling.com. New clients will need to complete intake forms before their first session, which will be provided to you upon booking."
        },
        {
          question: "What should I expect during my first session?",
          answer: "Your first session is an opportunity for us to get to know you and understand your needs. We'll discuss your reasons for seeking counseling, your goals, and any concerns you may have. This session typically lasts 50 minutes and helps us create a personalized treatment plan together."
        },
        {
          question: "Do I need a referral to see a counselor?",
          answer: "No referral is needed to book an appointment with us. However, if you're planning to use insurance, some providers may require a referral from your primary care physician. We recommend checking with your insurance provider beforehand."
        }
      ]
    },
    {
      category: "Insurance & Payment",
      questions: [
        {
          question: "Do you accept insurance?",
          answer: "Yes, we accept many major insurance plans including OAP (Ontario Autism Program), extended health benefits, and various private insurance providers. Please contact our office with your insurance information to verify your coverage before your first appointment. We'll help you understand your benefits and any out-of-pocket costs."
        },
        {
          question: "What are your fees for services?",
          answer: "Our fees vary depending on the type of service. Individual therapy sessions are competitively priced, and we offer sliding scale options for those who qualify. Please contact us directly for detailed pricing information and to discuss payment options that work for your situation."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept various payment methods including credit cards, debit cards, e-transfer, and direct insurance billing where applicable. Payment is typically due at the time of service unless other arrangements have been made."
        }
      ]
    },
    {
      category: "Sessions & Scheduling",
      questions: [
        {
          question: "How long are therapy sessions?",
          answer: "Individual therapy sessions are typically 50 minutes, while group sessions are 90 minutes. The frequency of sessions will be determined based on your needs and treatment plan. Most clients start with weekly sessions and adjust as progress is made."
        },
        {
          question: "What is your cancellation policy?",
          answer: "We require 24 hours notice for cancellations or rescheduling. Late cancellations or no-shows may be subject to a cancellation fee. We understand that emergencies happen, so please contact us as soon as possible if you need to change your appointment."
        },
        {
          question: "Do you offer virtual/online sessions?",
          answer: "Yes, we offer secure online sessions via video conferencing for clients who prefer remote counseling or cannot attend in-person. Online sessions provide the same quality of care and confidentiality as in-person visits."
        },
        {
          question: "What are your office hours?",
          answer: "Our office is open Monday through Friday from 9:00 AM to 7:00 PM, and Saturdays from 10:00 AM to 4:00 PM. We are closed on Sundays. We offer flexible scheduling including evening and weekend appointments to accommodate your schedule."
        }
      ]
    },
    {
      category: "Services & Treatment",
      questions: [
        {
          question: "What types of counseling do you provide?",
          answer: "We offer a wide range of counseling services including individual therapy, couples counseling, family therapy, group counseling, and specialized programs for anxiety, depression, trauma, relationship issues, and life transitions. Our approach is tailored to meet your specific needs."
        },
        {
          question: "What age groups do you work with?",
          answer: "We provide services for children, adolescents, adults, and seniors. Our therapists are trained to work with different age groups and adapt their approach accordingly to ensure effective treatment for everyone."
        },
        {
          question: "How long will I need to be in therapy?",
          answer: "The duration of therapy varies greatly depending on individual needs and goals. Some clients find relief in a few sessions, while others benefit from longer-term support. We'll regularly assess your progress together and adjust the treatment plan as needed."
        },
        {
          question: "What therapeutic approaches do you use?",
          answer: "Our therapists are trained in various evidence-based approaches including Cognitive Behavioral Therapy (CBT), Dialectical Behavior Therapy (DBT), mindfulness-based therapy, solution-focused therapy, and trauma-informed care. We'll work with you to find the approach that best suits your needs."
        }
      ]
    },
    {
      category: "Privacy & Confidentiality",
      questions: [
        {
          question: "Is counseling confidential?",
          answer: "Yes, your privacy is our top priority. All information shared during counseling sessions is confidential and protected by law. However, there are legal exceptions where we may be required to break confidentiality, such as when there's a risk of harm to yourself or others, suspected child abuse, or court orders."
        },
        {
          question: "Will my family or employer find out I'm in counseling?",
          answer: "No, we do not share information about your counseling with anyone without your written consent. Your employer, family members, or others will not be notified unless you specifically authorize us to communicate with them."
        },
        {
          question: "How do you protect my personal information?",
          answer: "We follow strict privacy protocols and comply with all applicable privacy laws including PHIPA (Personal Health Information Protection Act). All records are stored securely, and our online platforms use encryption to protect your data."
        }
      ]
    },
    {
      category: "Emergency & Crisis",
      questions: [
        {
          question: "What should I do in a mental health emergency?",
          answer: "If you're experiencing a mental health crisis or emergency, please call 911 or go to your nearest emergency room immediately. You can also contact the Crisis Helpline at 1-866-531-2600 (available 24/7) or text TALK to 686868. Our counseling services are not designed for emergency situations."
        },
        {
          question: "Can I contact my therapist between sessions?",
          answer: "While we encourage you to bring concerns to your scheduled sessions, you may contact your therapist between sessions for brief check-ins or scheduling matters. Please note that between-session communication is not a substitute for therapy sessions and emergency matters should be directed to appropriate crisis services."
        }
      ]
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  let questionCounter = 0

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-[#30D5C8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              variants={fadeIn}
              custom={0}
              className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-black/10"
            >
              <HelpCircle className="w-10 h-10 text-black" />
            </motion.div>
            
            <motion.h1
              variants={fadeIn}
              custom={1}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-black"
            >
              Frequently Asked Questions
            </motion.h1>
            
            <motion.p
              variants={fadeIn}
              custom={2}
              className="text-xl md:text-2xl mb-8 text-black"
            >
              Find answers to common questions about our counseling services, scheduling, insurance, and more.
            </motion.p>

            <motion.div
              variants={fadeIn}
              custom={3}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="lg"
                className="gap-2 border-black text-black hover:bg-black/10"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Button>
              <Button
                onClick={() => navigate('/contact')}
                size="lg"
                className="bg-black text-white hover:bg-gray-800"
              >
                Contact Us
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {faqs.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="mb-12"
              >
                {/* Category Header */}
                <div className="mb-6">
                  <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {category.category}
                  </h2>
                  <div className="h-1 w-20 bg-[#008080] rounded-full"></div>
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const currentIndex = questionCounter++
                    const isOpen = openIndex === currentIndex

                    return (
                      <motion.div
                        key={faqIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: faqIndex * 0.05 }}
                        whileHover={{ 
                          scale: 1.01,
                          boxShadow: "0 4px 12px rgba(0, 128, 128, 0.1)",
                          transition: { duration: 0.2 }
                        }}
                        className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                          isOpen 
                            ? 'bg-white dark:bg-gray-800 border-[#008080] dark:border-[#30D5C8] shadow-lg' 
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#008080] dark:hover:border-[#30D5C8] hover:shadow-md'
                        }`}
                      >
                        <button
                          onClick={() => toggleFAQ(currentIndex)}
                          className="w-full px-6 py-5 text-left flex items-start justify-between gap-4"
                        >
                          <h3 className={`text-lg font-semibold transition-colors duration-200 ${
                            isOpen
                              ? 'text-[#008080] dark:text-[#30D5C8]'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {faq.question}
                          </h3>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex-shrink-0"
                          >
                            <ChevronDown className={`w-6 h-6 transition-colors ${
                              isOpen 
                                ? 'text-[#008080] dark:text-[#30D5C8]' 
                                : 'text-gray-400 dark:text-gray-500'
                            }`} />
                          </motion.div>
                        </button>

                        <motion.div
                          initial={false}
                          animate={{
                            height: isOpen ? 'auto' : 0,
                            opacity: isOpen ? 1 : 0
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5">
                            <p className={`text-base leading-relaxed ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#008080] to-[#30D5C8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              We're here to help! Contact us directly and our team will be happy to assist you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => navigate('/contact')}
                size="lg"
                className="bg-white text-[#008080] hover:bg-gray-100"
              >
                Contact Us
              </Button>
              <Button
                onClick={() => navigate('/booking')}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Book an Appointment
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
