import { motion } from "framer-motion"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
}

const sectionVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      type: "spring",
      stiffness: 100
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 400
    }
  }
}

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      type: "spring",
      stiffness: 200
    }
  }
}

export default function TermsPage() {
  return (
    <div className="pt-16">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="py-20 relative overflow-hidden min-h-screen"
        style={{
          backgroundImage: "url('/images/hero-1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Semi-transparent overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-[#008080]/10 backdrop-blur-[2px]" 
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={fadeIn}
            className="max-w-4xl mx-auto bg-[#008080] p-8 rounded-lg shadow-lg border-2 border-white/20"
          >
            <motion.h1
              variants={fadeIn}
              className="text-3xl font-bold mb-6 text-white"
            >
              Terms and Conditions
            </motion.h1>
            
            <motion.p
              variants={fadeIn}
              className="text-white/90 mb-8"
            >
              Last updated: 4/10/2025
            </motion.p>

            <div className="space-y-8">
              <motion.section
                variants={sectionVariants}
                whileHover="hover"
                className="bg-[#008080] rounded-lg p-8 shadow-lg border-2 border-white/20 relative overflow-hidden"
              >
                <motion.h2 
                  variants={fadeIn}
                  className="text-2xl font-semibold mb-4 text-white"
                >
                  1. Introduction
                </motion.h2>
                <div className="prose prose-lg max-w-none">
                  <motion.p 
                    variants={fadeIn}
                    className="mb-4 text-white/90"
                  >
                    Welcome to CEMAR Counselling. These terms and conditions outline the rules and regulations for the use of our counselling services and website.
                  </motion.p>
                  <motion.p 
                    variants={fadeIn}
                    className="text-white/90"
                  >
                    By accessing our website and using our services, you accept these terms and conditions in full. If you disagree with these terms and conditions or any part of these terms and conditions, you must not use our services.
                  </motion.p>
                </div>
              </motion.section>

              <motion.section
                variants={sectionVariants}
                whileHover="hover"
                className="bg-[#008080] rounded-lg p-8 shadow-lg border-2 border-white/20 relative overflow-hidden"
              >
                <motion.h2 
                  variants={fadeIn}
                  className="text-2xl font-semibold mb-4 text-white"
                >
                  2. Service Description
                </motion.h2>
                <div className="prose prose-lg max-w-none">
                  <motion.p 
                    variants={fadeIn}
                    className="mb-4 text-white/90"
                  >
                    CEMAR Counselling provides mental health counselling services. Our platform facilitates the booking of counselling sessions between clients and qualified mental health professionals.
                  </motion.p>
                  <motion.p 
                    variants={fadeIn}
                    className="text-white/90"
                  >
                    While we strive to provide the highest quality of care, we do not guarantee specific outcomes from counselling sessions. Results may vary depending on individual circumstances and engagement with the therapeutic process.
                  </motion.p>
                </div>
              </motion.section>

              <motion.section
                variants={sectionVariants}
                whileHover="hover"
                className="bg-[#008080] rounded-lg p-8 shadow-lg border-2 border-white/20 relative overflow-hidden"
              >
                <motion.h2 
                  variants={fadeIn}
                  className="text-2xl font-semibold mb-4 text-white"
                >
                  3. User Responsibilities
                </motion.h2>
                <div className="prose prose-lg max-w-none">
                  <motion.p 
                    variants={fadeIn}
                    className="mb-4 text-white/90"
                  >
                    Users must:
                  </motion.p>
                  <ul className="list-none space-y-3">
                    {[
                      "Provide accurate and complete information during registration",
                      "Maintain the confidentiality of their account credentials",
                      "Notify us immediately of any unauthorized use of their account",
                      "Arrive punctually for scheduled appointments",
                      "Provide at least 24 hours notice for appointment cancellations",
                      "Engage respectfully with counsellors and staff"
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        variants={listItemVariants}
                        className="flex items-center text-white/90"
                      >
                        <motion.span 
                          className="text-white mr-2"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          •
                        </motion.span>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.section>

              <motion.section
                variants={sectionVariants}
                whileHover="hover"
                className="bg-[#008080] rounded-lg p-8 shadow-lg border-2 border-white/20 relative overflow-hidden"
              >
                <motion.h2 
                  variants={fadeIn}
                  className="text-2xl font-semibold mb-4 text-white"
                >
                  4. Privacy and Confidentiality
                </motion.h2>
                <div className="prose prose-lg max-w-none">
                  <motion.p 
                    variants={fadeIn}
                    className="mb-4 text-white/90"
                  >
                    We are committed to protecting your privacy and maintaining the confidentiality of your personal information. All counselling sessions and client information are kept strictly confidential, except in cases where:
                  </motion.p>
                  <ul className="list-none space-y-3">
                    {[
                      "There is a risk of harm to self or others",
                      "There is suspected abuse of children or vulnerable adults",
                      "There is a court order requiring disclosure",
                      "The client provides written consent for disclosure"
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        variants={listItemVariants}
                        className="flex items-center text-white/90"
                      >
                        <motion.span 
                          className="text-white mr-2"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          •
                        </motion.span>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.section>

              <motion.section
                variants={sectionVariants}
                whileHover="hover"
                className="bg-[#008080] rounded-lg p-8 shadow-lg border-2 border-white/20 relative overflow-hidden"
              >
                <motion.h2 
                  variants={fadeIn}
                  className="text-2xl font-semibold mb-4 text-white"
                >
                  5. Payment and Cancellation
                </motion.h2>
                <div className="prose prose-lg max-w-none">
                  <motion.p 
                    variants={fadeIn}
                    className="mb-4 text-white/90"
                  >
                    Payment is required at the time of booking. We accept major credit cards and other specified payment methods. Our cancellation policy requires:
                  </motion.p>
                  <ul className="list-none space-y-3">
                    {[
                      "24 hours notice for appointment cancellations",
                      "Late cancellations or no-shows may be charged the full session fee",
                      "Refunds are provided at our discretion"
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        variants={listItemVariants}
                        className="flex items-center text-white/90"
                      >
                        <motion.span 
                          className="text-white mr-2"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          •
                        </motion.span>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.section>

              <motion.section
                variants={sectionVariants}
                whileHover="hover"
                className="bg-[#008080] rounded-lg p-8 shadow-lg border-2 border-white/20 relative overflow-hidden"
              >
                <motion.h2 
                  variants={fadeIn}
                  className="text-2xl font-semibold mb-4 text-white"
                >
                  6. Emergency Services
                </motion.h2>
                <div className="prose prose-lg max-w-none">
                  <motion.p 
                    variants={fadeIn}
                    className="mb-4 text-white/90"
                  >
                    Our services are not intended for emergencies. If you are experiencing a mental health emergency, please:
                  </motion.p>
                  <ul className="list-none space-y-3">
                    {[
                      "Call your local emergency services",
                      "Visit your nearest emergency room",
                      "Contact a crisis helpline"
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        variants={listItemVariants}
                        className="flex items-center text-white/90"
                      >
                        <motion.span 
                          className="text-white mr-2"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          •
                        </motion.span>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.section>

              <motion.section
                variants={sectionVariants}
                whileHover="hover"
                className="bg-[#008080] rounded-lg p-8 shadow-lg border-2 border-white/20 relative overflow-hidden"
              >
                <motion.h2 
                  variants={fadeIn}
                  className="text-2xl font-semibold mb-4 text-white"
                >
                  7. Limitation of Liability
                </motion.h2>
                <div className="prose prose-lg max-w-none">
                  <motion.p 
                    variants={fadeIn}
                    className="mb-4 text-white/90"
                  >
                    While we strive to provide quality services, we cannot be held liable for:
                  </motion.p>
                  <ul className="list-none space-y-3">
                    {[
                      "Technical issues affecting online sessions",
                      "Actions taken based on counselling advice",
                      "Indirect or consequential losses",
                      "Circumstances beyond our reasonable control"
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        variants={listItemVariants}
                        className="flex items-center text-white/90"
                      >
                        <motion.span 
                          className="text-white mr-2"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          •
                        </motion.span>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.section>

              <motion.section
                variants={sectionVariants}
                whileHover="hover"
                className="bg-[#008080] rounded-lg p-8 shadow-lg border-2 border-white/20 relative overflow-hidden"
              >
                <motion.h2 
                  variants={fadeIn}
                  className="text-2xl font-semibold mb-4 text-white"
                >
                  8. Changes to Terms
                </motion.h2>
                <div className="prose prose-lg max-w-none">
                  <motion.p 
                    variants={fadeIn}
                    className="mb-4 text-white/90"
                  >
                    We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. Continued use of our services after changes constitutes acceptance of the modified terms.
                  </motion.p>
                </div>
              </motion.section>
            </div>

            <motion.p
              variants={fadeIn}
              className="text-white/90 mt-8"
            >
              For any questions about these terms, please contact us at{" "}
              <motion.a 
                href="mailto:info@cemarcounseling.com" 
                className="text-white hover:underline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                support@cemarcounselling.com
              </motion.a>
            </motion.p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
