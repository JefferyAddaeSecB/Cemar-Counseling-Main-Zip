"use client"

import { Button } from "../../components/ui/button"
import { motion } from "framer-motion"
import { Download, Home } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function InformedConsentPage() {
  const navigate = useNavigate()

  const handlePrintPDF = () => {
    window.print()
  }

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

  const sections = [
    {
      number: "1",
      title: "Purpose of Counseling",
      content: `Counseling at Cemar Counseling is a professional service intended to support personal growth, emotional well-being, and coping strategies for life challenges. Counseling may involve discussion of personal issues, emotions, behaviors, relationships, and past experiences.

While counseling can be highly beneficial, outcomes cannot be guaranteed. Progress depends on many factors, including client participation, honesty, and commitment to the process.`
    },
    {
      number: "2",
      title: "Nature of Counseling Services",
      content: `Counseling services may include, but are not limited to:

• Individual counseling sessions
• Emotional and psychological support
• Goal setting and problem-solving strategies
• Psychoeducation and coping skills

Counseling is not a substitute for medical care, psychiatric treatment, or emergency services.`
    },
    {
      number: "3",
      title: "Not a Medical or Emergency Service",
      content: `Cemar Counseling does not provide:

• Emergency mental health services
• Crisis intervention
• Medical diagnosis or treatment

If you are experiencing thoughts of self-harm, harm to others, or are in immediate danger, do not book an appointment. Instead, contact your local emergency number or a crisis hotline immediately.`
    },
    {
      number: "4",
      title: "Client Responsibilities",
      content: `As a client, you agree to:

• Provide accurate and truthful information
• Participate actively and respectfully in sessions
• Communicate openly about concerns, expectations, or discomfort
• Take responsibility for your own decisions, actions, and outcomes

You understand that counseling involves personal effort and that progress may take time.`
    },
    {
      number: "5",
      title: "Risks and Benefits of Counseling",
      content: `Potential Benefits:
• Increased self-awareness
• Improved coping skills
• Emotional relief
• Better communication and relationships

Potential Risks:
• Emotional discomfort
• Temporary increase in distress when discussing difficult topics
• Unresolved issues may surface during the process

You acknowledge that these risks are a normal part of counseling.`
    },
    {
      number: "6",
      title: "Confidentiality",
      content: `Your privacy is taken seriously. Information shared during counseling is treated as confidential and will not be disclosed without your consent, except where disclosure is required or permitted by law, including but not limited to:

• Risk of serious harm to yourself or others
• Suspected abuse or neglect of a child, elderly person, or vulnerable individual
• Court orders or legal requirements

Electronic communication and online services carry inherent risks, and absolute confidentiality cannot be guaranteed.`
    },
    {
      number: "7",
      title: "Records and Documentation",
      content: `Cemar Counseling may maintain limited records related to scheduling, billing, and administrative purposes. Clinical notes, if kept, are stored securely and accessed only by authorized personnel.

You have the right to request information about records in accordance with applicable laws.`
    },
    {
      number: "8",
      title: "Fees and Payment Policy",
      content: `• Payment is required in full prior to confirming an appointment unless otherwise stated
• Accepted payment methods include Stripe and PayPal
• Fees will be clearly displayed at the time of booking
• Failure to complete payment will result in the appointment not being confirmed.`
    },
    {
      number: "9",
      title: "Cancellation, Rescheduling, and No-Show Policy",
      content: `• Appointments must be canceled or rescheduled at least 24 hours in advance
• Late cancellations or no-shows may be charged the full session fee
• Exceptions may be made at the discretion of Cemar Counseling

This policy respects the counselor's time and availability.`
    },
    {
      number: "10",
      title: "Technology and Virtual Sessions",
      content: `If sessions are conducted virtually:

• You are responsible for ensuring a private, secure environment
• Technical issues may occasionally occur
• Cemar Counseling is not responsible for interruptions beyond its control`
    },
    {
      number: "11",
      title: "Professional Boundaries",
      content: `Counseling sessions are strictly professional. Dual relationships, inappropriate contact, or communication outside agreed professional channels are not permitted.`
    },
    {
      number: "12",
      title: "Consent to Services",
      content: `By booking an appointment and checking the consent box, you confirm that:

• You are at least 18 years of age (or have legal guardian consent)
• You understand the nature and limits of counseling services
• You voluntarily consent to receive counseling services from Cemar Counseling`
    },
  ]

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-[#30D5C8]/10 to-[#008080]/10 border-b border-[#30D5C8]/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2">
                Informed Consent & Policies
              </h1>
              <p className="text-base text-black/70 dark:text-white/70">
                Cemar Counseling – Professional Counseling Services
              </p>
              <p className="text-sm text-black/60 dark:text-white/60 mt-2">
                Effective Date: January 2026 | Last Updated: January 2026
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-2"
            >
              <Button
                onClick={handlePrintPDF}
                className="bg-[#30D5C8] text-black hover:bg-[#30D5C8]/90 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Print / Save as PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-black dark:text-white"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-yellow-50 dark:bg-yellow-900/20 border-y border-yellow-200 dark:border-yellow-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-lg p-6 border-l-4 border-yellow-500"
          >
            <p className="text-base font-semibold text-black dark:text-white mb-2">
              ⚠️ Important Notice
            </p>
            <p className="text-sm text-black/80 dark:text-white/80 leading-relaxed">
              By booking an appointment with Cemar Counseling, you acknowledge that you have read, understood, and agree to all terms outlined in this document. Please read this document carefully before proceeding with your appointment booking.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Emergency Notice */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
            className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 mb-12 border border-red-200 dark:border-red-800"
          >
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-3">
              🚨 Crisis & Emergency Disclaimer
            </h2>
            <p className="text-sm text-red-900 dark:text-red-200 leading-relaxed mb-3">
              If you are experiencing thoughts of self-harm, suicidal ideation, or harm to others, or if you are in immediate danger, please do NOT use this service. Instead:
            </p>
            <ul className="text-sm text-red-900 dark:text-red-200 space-y-2 ml-4 list-disc">
              <li>Call your local emergency number (911 in the US)</li>
              <li>Contact the National Suicide Prevention Lifeline: 988 (call or text)</li>
              <li>Go to your nearest emergency room</li>
              <li>Contact the Crisis Text Line: Text HOME to 741741</li>
            </ul>
          </motion.div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section, index) => (
              <motion.div
                key={section.number}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                custom={index + 1}
                className="print:page-break-inside-avoid"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#30D5C8] text-black font-bold text-lg">
                      {section.number}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                      {section.title}
                    </h2>
                    <p className="text-base text-black/80 dark:text-white/80 leading-relaxed whitespace-pre-wrap">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Final Acknowledgment */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
            custom={sections.length + 1}
            className="mt-16 bg-[#30D5C8]/10 rounded-lg p-8 border-2 border-[#30D5C8]/30 print:page-break-inside-avoid"
          >
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
              Final Acknowledgment
            </h2>
            <div className="space-y-4 text-base text-black/80 dark:text-white/80 leading-relaxed">
              <p>
                By proceeding with booking an appointment with Cemar Counseling, you acknowledge that:
              </p>
              <ul className="space-y-3 ml-6 list-disc">
                <li>You have read this informed consent document in full</li>
                <li>You understand its contents and implications</li>
                <li>You voluntarily agree to abide by all policies described</li>
                <li>You understand the risks and benefits of counseling</li>
                <li>You are not in crisis or experiencing an emergency</li>
                <li>You will seek appropriate emergency services if needed</li>
              </ul>
              <p className="mt-6 font-semibold text-black dark:text-white">
                If you have any questions or concerns about this document or our services, please contact Cemar Counseling before booking your appointment.
              </p>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={sections.length + 2}
            className="mt-12 text-center text-sm text-black/60 dark:text-white/60 border-t border-black/10 dark:border-white/10 pt-8"
          >
            <p className="font-semibold text-black dark:text-white mb-2">
              Cemar Counseling
            </p>
            <p>Professional Counseling Services</p>
            <p className="mt-3">
              Phone: <a href="tel:+19059092400" className="text-[#30D5C8] hover:underline">(905) 909-2400</a>
            </p>
            <p className="mt-6 text-xs text-black/50 dark:text-white/50">
              © 2026 Cemar Counseling. All rights reserved.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
            color: black;
          }

          .no-print {
            display: none !important;
          }

          section {
            page-break-inside: avoid;
            margin: 0;
            padding: 0.5in;
          }

          h1, h2, h3 {
            page-break-after: avoid;
            page-break-inside: avoid;
          }

          p {
            page-break-inside: avoid;
            orphans: 3;
            widows: 3;
          }

          a {
            text-decoration: none;
            color: #333;
          }

          .print\\:page-break-inside-avoid {
            page-break-inside: avoid;
          }

          /* Hide buttons and interactive elements when printing */
          button {
            display: none !important;
          }

          /* Ensure proper margins */
          @page {
            margin: 0.75in;
          }
        }
      `}</style>
    </div>
  )
}
