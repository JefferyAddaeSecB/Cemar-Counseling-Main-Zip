import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Link } from "react-router-dom"

export default function TermsPage() {
  return (
    <div className="pt-16">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-card p-8 rounded-lg shadow-md border"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold text-[white] mb-4">Terms and Conditions</h1>
              <p className="text-lg text-muted-foreground">
                Last updated: January 12, 2026
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-6 text-muted-foreground"
            >
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
                <p>
                  Welcome to Cemar Counseling ("we," "our," or "us"). These Terms and Conditions govern your access to and use of our website, booking systems, and counseling services.
                </p>
                <p>
                  By accessing our website, booking an appointment, or using our services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">2. Description of Services</h2>
                <p>
                  Cemar Counseling provides professional counseling services intended to support emotional well-being, personal development, and coping strategies for life challenges.
                </p>
                <p>
                  Our services may include individual counseling sessions delivered in person or virtually, depending on availability. While counseling can be beneficial, no specific outcomes or results are guaranteed, as progress depends on individual circumstances and engagement.
                </p>
                <p className="text-sm italic">
                  Cemar Counseling does not provide medical treatment, psychiatric services, or emergency care.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">3. Eligibility and Use of Services</h2>
                <p>By using our services, you confirm that:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You are at least 18 years of age, or have appropriate parental or legal guardian consent</li>
                  <li>You are using our services for lawful and personal purposes only</li>
                  <li>You understand the nature and limits of counseling services</li>
                </ul>
                <p>
                  We reserve the right to refuse or discontinue services where appropriate, including in cases of non-compliance with these Terms.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">4. Client Responsibilities</h2>
                <p>Clients agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, complete, and truthful information</li>
                  <li>Maintain the confidentiality of any account or booking credentials</li>
                  <li>Notify us promptly of unauthorized use or security concerns</li>
                  <li>Attend appointments on time and prepared</li>
                  <li>Provide at least 24 hours' notice for cancellations or rescheduling</li>
                  <li>Communicate respectfully with counselors and staff</li>
                </ul>
                <p>
                  Failure to comply with these responsibilities may result in service limitations or termination.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">5. Booking, Payments, and Fees</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payment is required in full at the time of booking, unless otherwise stated</li>
                  <li>Payments are processed securely through third-party providers (e.g., Stripe, PayPal)</li>
                  <li>Prices and session fees are clearly displayed prior to booking</li>
                </ul>
                <p className="text-sm">
                  Cemar Counseling does not store full payment card details on its servers.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">6. Cancellation, Rescheduling, and No-Shows</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Appointments must be canceled or rescheduled at least 24 hours in advance</li>
                  <li>Late cancellations or missed appointments ("no-shows") may be charged the full session fee</li>
                  <li>Refunds, if applicable, are provided at the discretion of Cemar Counseling</li>
                </ul>
                <p>
                  This policy ensures fairness and respects the counselor's time.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">7. Confidentiality</h2>
                <p>
                  All counseling services are provided in accordance with professional confidentiality standards. Information shared during sessions is treated as confidential, except where disclosure is required or permitted by law, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Risk of serious harm to yourself or others</li>
                  <li>Suspected abuse or neglect of a child, elderly person, or vulnerable individual</li>
                  <li>Court orders or other legal obligations</li>
                  <li>Client's written consent</li>
                </ul>
                <p>
                  Further details are outlined in our Privacy Policy and Informed Consent documents.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">8. Emergency and Crisis Situations</h2>
                <p>
                  Cemar Counseling services are not intended for emergencies or crisis intervention.
                </p>
                <p>
                  If you are experiencing a mental health emergency, you should immediately:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Call your local emergency number</li>
                  <li>Visit the nearest emergency department</li>
                  <li>Contact a crisis hotline or support service</li>
                </ul>
                <p className="font-semibold">
                  Do not rely on scheduled counseling sessions for urgent care.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">9. Technology and Online Services</h2>
                <p>When services are provided virtually:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Clients are responsible for ensuring a private and secure environment</li>
                  <li>Technical disruptions may occur</li>
                  <li>We are not liable for interruptions beyond our reasonable control</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">10. Limitation of Liability</h2>
                <p>
                  To the fullest extent permitted by law, Cemar Counseling shall not be liable for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Actions taken or decisions made by clients based on counseling sessions</li>
                  <li>Technical issues affecting online services</li>
                  <li>Indirect, incidental, or consequential losses</li>
                  <li>Events outside our reasonable control</li>
                </ul>
                <p>
                  Counseling is a collaborative process, and clients retain responsibility for their own choices and actions.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">11. Intellectual Property and Website Use</h2>
                <p>
                  All website content, materials, and branding belong to Cemar Counseling and may not be reproduced, distributed, or misused without written permission.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">12. Changes to These Terms</h2>
                <p>
                  We reserve the right to update or modify these Terms and Conditions at any time. Updates will be posted on our website with a revised "Last updated" date. Continued use of our services constitutes acceptance of the updated terms.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">13. Contact Information</h2>
                <p>
                  If you have questions regarding these Terms and Conditions, please contact:
                </p>
                <div className="bg-card p-4 rounded-lg border mt-4">
                  <p className="font-semibold">Cemar Counseling</p>
                  <p>📧 Email: support@cemarcounseling.com</p>
                  <p>📞 Phone: (905) 909-2400</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 text-center"
            >
              <Button
                asChild
                className="bg-[#30D5C8] text-black hover:bg-[#30D5C8]/90"
              >
                <Link to="/">Back to Home</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
