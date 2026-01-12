import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Link } from "react-router-dom"

export default function PrivacyPolicyPage() {
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
              <h1 className="text-4xl font-bold text-[white] mb-4">Privacy Policy</h1>
              <p className="text-lg text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
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
                  Cemar Counseling ("we," "our," or "us") is committed to protecting the privacy, confidentiality, and security of personal information entrusted to us. This Privacy Policy explains how we collect, use, disclose, store, and protect your information when you access our website, book appointments, or receive counseling services.
                </p>
                <p>
                  We handle personal information in accordance with applicable privacy laws, professional ethical standards, and best practices for counseling services.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
                <p>We may collect and store the following categories of information:</p>
                
                <div className="ml-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">a. Personal Information</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Full name</li>
                      <li>Email address</li>
                      <li>Phone number</li>
                      <li>Appointment and scheduling details</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">b. Counseling-Related Information</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Information voluntarily provided during intake or sessions</li>
                      <li>Session-related notes or administrative records (where applicable)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">c. Payment Information</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Payment details processed securely through third-party providers such as Stripe or PayPal</li>
                      <li>Billing history and transaction records</li>
                    </ul>
                    <p className="text-xs mt-2">Note: We do not store full credit card numbers on our servers.</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">d. Website & Technical Information</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>IP address</li>
                      <li>Browser type and device information</li>
                      <li>Website usage data and cookies</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
                <p>Your information is used for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide and manage counseling services</li>
                  <li>To schedule, confirm, and administer appointments</li>
                  <li>To process payments and maintain financial records</li>
                  <li>To communicate regarding services, policies, or updates</li>
                  <li>To improve website functionality and service quality</li>
                  <li>To comply with legal, ethical, and professional obligations</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">4. Confidentiality and Disclosure</h2>
                <p>
                  We respect the confidential nature of counseling services. Personal information will not be disclosed without your consent except where disclosure is required or permitted by law, including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Risk of serious harm to yourself or others</li>
                  <li>Suspected abuse or neglect of a child, elderly person, or vulnerable individual</li>
                  <li>Court orders, subpoenas, or other legal obligations</li>
                </ul>
                <p>
                  Only the minimum necessary information will be disclosed in such cases.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">5. Information Storage and Security</h2>
                <p>
                  We implement reasonable administrative, technical, and physical safeguards to protect your information, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Secure data storage systems</li>
                  <li>Encryption of sensitive information where appropriate</li>
                  <li>Restricted access to authorized personnel only</li>
                  <li>Regular review of security practices</li>
                </ul>
                <p className="text-sm italic">
                  While we take reasonable steps to protect your information, no system can be guaranteed to be 100% secure.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">6. Third-Party Services</h2>
                <p>
                  We may use trusted third-party service providers to support our operations, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Online scheduling platforms (e.g., Calendly)</li>
                  <li>Payment processors (e.g., Stripe, PayPal)</li>
                  <li>Secure communication and form tools</li>
                </ul>
                <p>
                  These providers have their own privacy policies and are responsible for safeguarding information processed through their systems.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">7. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Request access to your personal information</li>
                  <li>Request corrections to inaccurate or incomplete information</li>
                  <li>Request deletion of your information, subject to legal and professional obligations</li>
                  <li>Withdraw consent where applicable</li>
                  <li>File a complaint regarding privacy practices</li>
                </ul>
                <p className="text-sm">
                  Requests may be subject to verification and legal limitations.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">8. Retention of Information</h2>
                <p>
                  Personal information is retained only for as long as necessary to fulfill the purposes outlined in this policy or as required by law, professional regulations, or insurance requirements.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">9. Cookies and Website Analytics</h2>
                <p>
                  Our website may use cookies or similar technologies to improve functionality and user experience. You may adjust your browser settings to manage or disable cookies; however, this may affect site performance.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">10. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. Updates will be posted on our website with a revised "Last updated" date. Continued use of our services constitutes acceptance of the updated policy.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">11. Contact Information</h2>
                <p>
                  If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact:
                </p>
                <div className="bg-card p-4 rounded-lg border mt-4">
                  <p className="font-semibold">Cemar Counseling</p>
                  <p>📧 Email: info@cemarcounseling.com</p>
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