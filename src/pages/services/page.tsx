"use client"

import { Button } from "../../components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { UserPlus, Users, Video, Brain, Heart, Sparkles, Check } from "lucide-react"
import { checkIsLoggedIn } from "../../lib/auth-helpers"
import { LazyImage } from "../../components/ui/lazy-image"
import { useTheme } from "../../components/theme-provider"

export default function ServicesPage() {
  const { theme } = useTheme()

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  const services = [
    {
      title: "One-on-One Therapy",
      description:
        "Personalized therapy sessions tailored to your specific needs. Our therapists use evidence-based approaches to help you navigate challenges, develop coping strategies, and achieve your mental health goals.",
      icon: <UserPlus className="h-10 w-10 text-[#30D5C8]" />,
      features: [
        "50-minute individual sessions",
        "Personalized treatment plans",
        "Available in-person or online",
        "Flexible scheduling options",
      ],
    },
    {
      title: "Group Counseling",
      description:
        "Connect with others facing similar challenges in a supportive environment. Our group sessions foster community, shared learning, and mutual support under the guidance of experienced facilitators.",
      icon: <Users className="h-10 w-10 text-[#30D5C8]" />,
      features: [
        "Small groups of 6-8 participants",
        "Topic-focused sessions",
        "Affordable care option",
        "Build community and connection",
      ],
    },
    {
      title: "Online Sessions",
      description:
        "Access quality therapy from the comfort of your home. Our secure telehealth platform makes it easy to connect with your therapist regardless of location, while maintaining the same standard of care.",
      icon: <Video className="h-10 w-10 text-[#30D5C8]" />,
      features: [
        "Secure, HIPAA-compliant platform",
        "No commute or waiting room time",
        "Same quality care as in-person",
        "Technical support available",
      ],
    },
    {
      title: "Cognitive Behavioral Therapy",
      description:
        "CBT helps identify and change negative thought patterns that influence behaviors and emotions. This structured approach is effective for treating anxiety, depression, and other mental health conditions.",
      icon: <Brain className="h-10 w-10 text-[#30D5C8]" />,
      features: [
        "Evidence-based techniques",
        "Practical skill development",
        "Homework between sessions",
        "Measurable progress tracking",
      ],
    },
    {
      title: "Couples Counseling",
      description:
        "Strengthen your relationship with professional guidance. Our couples counseling helps improve communication, resolve conflicts, and deepen connection between partners.",
      icon: <Heart className="h-10 w-10 text-[#30D5C8]" />,
      features: [
        "Communication skill building",
        "Conflict resolution strategies",
        "Rebuilding trust and intimacy",
        "Joint and individual sessions",
      ],
    },
    {
      title: "Mindfulness-Based Therapy",
      description:
        "Learn to be present in the moment and develop a non-judgmental awareness of your thoughts and feelings. Mindfulness practices can reduce stress, anxiety, and improve overall well-being.",
      icon: <Sparkles className="h-10 w-10 text-[#30D5C8]" />,
      features: [
        "Meditation techniques",
        "Stress reduction practices",
        "Present-moment awareness",
        "Integration into daily life",
      ],
    },
  ]

  const pricingPlans = [
    {
      title: "Online Individual Session",
      price: "$175",
      description: "Per 50-minute session",
      features: [
        "One-on-one attention",
        "Personalized treatment plan",
        "Virtual/telehealth session",
        "Flexible scheduling",
      ],
    },
    {
      title: "In-Person Individual Session",
      price: "$185",
      description: "Per 50-minute session",
      features: [
        "One-on-one attention",
        "Personalized treatment plan",
        "In-person at our office",
        "Flexible scheduling",
      ],
    },
    {
      title: "Group Therapy",
      price: "$100",
      description: "Per 90-minute session",
      features: [
        "Small group setting (6-8 people)",
        "Topic-focused sessions",
        "Supportive community",
        "Led by licensed therapist",
      ],
    },
    {
      title: "Couples Package",
      price: "$195",
      description: "Per 60-minute session",
      features: [
        "Relationship assessment",
        "Communication training",
        "Conflict resolution strategies",
        "Joint goal setting",
      ],
    },
  ]

  const navigate = useNavigate()

  const serviceCardVariants = {
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
    },
    hover: {
      y: -10,
      scale: 1.02,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const pricingCardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
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
  };

  const priceVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15
      }
    }
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <div className="pt-16">
      {/* Services Header */}
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
            src='/images/professional-counseling.jpg'
            alt='Professional counseling environment'
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
              Our{' '}
              <span className='text-[#30D5C8]'>
                Services
              </span>
            </motion.h1>
            <motion.p variants={fadeIn} custom={1} className="text-xl text-white/90">
              We offer a range of professional counseling services tailored to meet your unique needs and support your
              mental health journey
            </motion.p>
            <motion.div variants={fadeIn} custom={2}>
              <Button 
                size="lg" 
                className="text-lg bg-[#008080] hover:bg-[#008080]/90 text-white shadow-lg mt-6"
                onClick={() => {
                  if (checkIsLoggedIn()) {
                    navigate("/booking")
                  } else {
                    navigate("/login")
                  }
                }}
              >
                Book an Appointment
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 bg-[#30D5C8]/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, margin: "-50px" }}
                variants={serviceCardVariants}
                custom={index}
                className="bg-card rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#30D5C8]/20 hover:border-[#30D5C8]/40"
              >
                <motion.div
                  className='bg-[#30D5C8]/10 p-3 rounded-full w-fit mb-6'
                  variants={featureVariants}
                  whileHover="hover"
                >
                  <motion.div variants={iconVariants}>
                    {service.icon}
                  </motion.div>
                </motion.div>
                <motion.div variants={featureVariants}>
                  <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                </motion.div>
                <motion.div variants={featureVariants}>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        variants={featureVariants}
                        custom={i}
                        className="flex items-center text-muted-foreground"
                      >
                        <Check className="h-4 w-4 text-[#30D5C8] mr-2" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div variants={featureVariants}>
                  <Button
                    className="bg-[#30D5C8] text-black hover:bg-[#30D5C8]/90"
                    onClick={() => {
                      navigate('/booking');
                      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                    }}
                  >
                    Book Now
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-[#30D5C8]/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{once: true, margin: '-100px'}}
            className='text-center mb-16'
          >
            <motion.h2
              variants={fadeIn}
              custom={0}
              className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}
            >
              Pricing
            </motion.h2>
            <motion.p
              variants={fadeIn}
              custom={1}
              className={`text-xl ${theme === 'dark' ? 'text-white/80' : 'text-black/80'} max-w-2xl mx-auto`}
            >
              Transparent pricing for our services. We also accept many insurance plans and offer sliding scale options for those in need.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.title}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, margin: "-50px" }}
                variants={pricingCardVariants}
                custom={index}
                className="bg-card rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#30D5C8]/20 hover:border-[#30D5C8]/40"
              >
                <motion.div variants={featureVariants}>
                  <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                  <motion.div variants={priceVariants} className="mb-4">
                    <span className="text-4xl font-bold text-[#30D5C8]">{plan.price}</span>
                    <span className="text-muted-foreground"> {plan.description}</span>
                  </motion.div>
                  <motion.ul variants={featureVariants} className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        variants={featureVariants}
                        custom={i}
                        className="flex items-center text-muted-foreground"
                      >
                        <Check className="h-4 w-4 text-[#30D5C8] mr-2" />
                        {feature}
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
                <motion.div variants={featureVariants}>
                  <Button
                    asChild
                    className="bg-[#30D5C8] text-black hover:bg-[#30D5C8]/90"
                  >
                    <Link to="/booking">Book Now</Link>
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{once: true, margin: '-100px'}}
            className='text-center mt-24 mb-16'
          >
            <motion.p
              variants={fadeIn}
              custom={1}
              className={`text-xl ${theme === 'dark' ? 'text-white/80' : 'text-black/80'} max-w-2xl mx-auto mb-6`}
            >
              Not sure which service is right for you? Contact us for a free 15-minute consultation to discuss your needs.
            </motion.p>
            <motion.div
              variants={fadeIn}
              custom={2}
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
            >
              <Button
                size='lg'
                className='text-lg bg-[#008080] hover:bg-[#008080]/90 text-white shadow-lg'
                onClick={() => {
                  if (checkIsLoggedIn()) {
                    // Direct user straight to Calendly free 15-min link inside booking page
                    navigate('/booking?calendly=free15');
                  } else {
                    navigate('/login');
                  }
                }}
              >
                Book a Free 15-Minute Consultation
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 relative overflow-hidden'>
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
            src='/images/gold.jpg'
            alt='Autumn forest path'
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
            <motion.h2 variants={fadeIn} custom={0} className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to Begin Your Journey?
            </motion.h2>
            <motion.p variants={fadeIn} custom={1} className="text-xl text-white/90 mb-8">
              Take the first step towards better mental health and well-being. Our team of professionals is here to
              support you.
            </motion.p>
            <motion.div variants={fadeIn} custom={2}>
              <Button 
                size="lg" 
                className="text-lg bg-[#008080] hover:bg-[#008080]/90 text-white shadow-lg"
                onClick={() => {
                  if (checkIsLoggedIn()) {
                    navigate("/booking");
                    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                  } else {
                    navigate("/login");
                  }
                }}
              >
                Book an Appointment
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

