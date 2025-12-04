'use client';

import {useEffect, useState, useRef} from 'react'; // Combine imports
import {LazyImage} from '../../../src/components/ui/lazy-image';
import {motion} from 'framer-motion';
import {Button} from '../../../src/components/ui/button';
import {Link, useNavigate} from 'react-router-dom';
import {Users} from 'lucide-react';
import {checkIsLoggedIn} from '../../../src/lib/auth-helpers';
import { useTheme } from "../../components/theme-provider"

const bookingLink = 'https://calendly.com/cemar-counselling/consultation';

const slideshowImages = [
    '/images/0.JPG',
    '/images/1.JPG',
    '/images/2.JPG',
    '/images/3.JPG',
];

export default function AboutPage() {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const navigate = useNavigate();
    const { theme } = useTheme()

    // Add this before the return statement
    useEffect(() => {
        const img = new Image();
        img.src = '/assets/team-meeting.jpg';
        img.onload = () => setIsImageLoaded(true);
    }, []);

    const fadeIn = {
        hidden: {opacity: 0, y: 20},
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
            },
        }),
    };

    const sectionVariants = {
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
    };

    const contentVariants = {
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

    const imageVariants = {
        hidden: { opacity: 0, x: 20, scale: 0.9 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15
            }
        },
        hover: {
            scale: 1.05,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 10
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
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
    };

    const heroVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15,
                staggerChildren: 0.2
            }
        }
    };

    const textVariants = {
        hidden: { opacity: 0, x: -50 },
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

    const imageContainerVariants = {
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
            scale: 1.05,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 10
            }
        }
    };

    const valueCardVariants = {
        hidden: { opacity: 0, y: 30 },
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

    // Slideshow state
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (slideTimeout.current) clearTimeout(slideTimeout.current);
        slideTimeout.current = setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
        }, 3500);
        return () => {
            if (slideTimeout.current) clearTimeout(slideTimeout.current);
        };
    }, [currentSlide]);

    return (
        <div className='pt-16'>
            {/* About Header */}
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
                        src='/images/community-support.jpg'
                        alt='Community support and connection'
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
                        viewport={{once: true}}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <motion.h1
                            variants={fadeIn}
                            custom={0}
                            className="text-4xl md:text-5xl font-bold mb-6 text-white"
                        >
                            About{' '}
                            <span className='text-[#30D5C8]'>
                                Us
                            </span>
                        </motion.h1>
                        <motion.p
                            variants={fadeIn}
                            custom={1}
                            className="text-xl text-white/90"
                        >
                            Dedicated to supporting mental health and well-being in our community
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className='py-20 bg-background'>
                <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='max-w-6xl mx-auto'> {/* Increased from max-w-4xl */}
                        <div className='grid md:grid-cols-2 gap-8 items-center'> {/* Reduced gap from 12 to 8 */}
                            {/* First column */}
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{once: true}}
                                variants={heroVariants}
                            >
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
                                        Our Mission
                                    </motion.h2>
                                    <motion.p
                                        variants={fadeIn}
                                        custom={1}
                                        className={`text-xl ${theme === 'dark' ? 'text-white/80' : 'text-black/80'} max-w-2xl mx-auto`}
                                    >
                                        To provide compassionate and professional counseling services that empower individuals to overcome challenges and achieve personal growth.
                                    </motion.p>
                                </motion.div>

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
                                        Our Vision
                                    </motion.h2>
                                    <motion.p
                                        variants={fadeIn}
                                        custom={1}
                                        className={`text-xl ${theme === 'dark' ? 'text-white/80' : 'text-black/80'} max-w-2xl mx-auto`}
                                    >
                                        Here at CEMAR, we envision to providing a dedicated, compassionate, and non-discriminatory space for individuals to explore their mental health journeys.
                                    </motion.p>
                                </motion.div>

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
                                        Our Goal
                                    </motion.h2>
                                    <motion.p
                                        variants={fadeIn}
                                        custom={1}
                                        className={`text-xl ${theme === 'dark' ? 'text-white/80' : 'text-black/80'} max-w-2xl mx-auto`}
                                    >
                                        To enhance and equip clients' emotional well-being and coping skills.
                                    </motion.p>
                                </motion.div>
                            </motion.div>

                            {/* Image slideshow column */}
                            <motion.div
                                variants={fadeIn}
                                custom={2}
                                className="relative w-full h-auto overflow-hidden rounded-lg bg-black/10 md:max-w-3xl" // Added md:max-w-3xl
                            >
                                <motion.img
                                    key={slideshowImages[currentSlide]}
                                    src={slideshowImages[currentSlide]}
                                    alt="Slideshow"
                                    className="w-full object-cover h-[700px]" // Increased height and removed max-h constraint
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8 }}
                                />
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 p-2 bg-black/30 rounded-full">
                                    {slideshowImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            className={`w-4 h-4 rounded-full ${idx === currentSlide ? 'bg-[#30D5C8]' : 'bg-white/70'}`}
                                            onClick={() => setCurrentSlide(idx)}
                                            aria-label={`Go to slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet Your Therapist Section */}
            <section className='py-20 bg-muted'>
                <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                    <motion.div
                        initial='hidden'
                        whileInView='visible'
                        viewport={{once: true}}
                        className='text-center mb-16'
                    >
                        <motion.h2
                            variants={fadeIn}
                            custom={0}
                            className='text-3xl md:text-4xl font-bold mb-6'
                        >
                            Meet Your Therapist
                        </motion.h2>
                        <motion.p
                            variants={fadeIn}
                            custom={1}
                            className='text-xl text-muted-foreground'
                        >
                            Get to know the professional who will guide you
                            through your journey
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial='hidden'
                        whileInView='visible'
                        viewport={{once: true}}
                        variants={fadeIn}
                        custom={0}
                        className='max-w-4xl mx-auto bg-card rounded-lg overflow-hidden shadow-lg mt-8'
                    >
                        <div className='md:flex h-full'>
                            <div className='md:w-1/2 h-full pt-16'>
                                <motion.img
                                    src='/images/team/cecilia.jpg'
                                    alt='Cecilia Mar'
                                    className='w-full h-full object-cover rounded-2xl shadow-2xl'
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    whileHover={{ scale: 1.02 }}
                                />
                            </div>
                            <div className='p-8 md:w-1/2'>
                                <h3 className='text-2xl font-bold mb-2'>
                                    Richard A. Titus-Glover
                                </h3>
                                <p className='text-primary mb-6'>
                                    Licensed Professional Counselor
                                </p>
                                <div className='space-y-6'>
                                    <div>
                                        <h4 className='font-semibold mb-2'>
                                            About
                                        </h4>
                                        <p className='text-muted-foreground'>
                                            With over 15 years of experience supporting individuals and families facing mental health challenges,
                                            I am deeply committed to providing tailored therapeutic approaches.
                                            Understanding that each person's journey is unique,
                                            I employ evidence-based modalities including
                                            Cognitive Behaviour Therapy (CBT), Dialectical Behaviour Therapy (DBT), Psychodynamic Therapy, and Solution-Focused Brief Therapy (SFBT).
                                            This diverse toolkit allows me to effectively address the specific issues and concerns of my clients,
                                            fostering personal growth and resilience.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className='font-semibold mb-2'>
                                            Education & Credentials
                                        </h4>
                                        <ul className='text-muted-foreground space-y-1'>
                                            <li>
                                                Master of Social Work, RSW
                                            </li>
                                            <li>
                                                Registered, and in good Standing 
                                                <li> with <a href='https://www.ocswssw.org/registrants/' className='text-[#00FFFF] font-bold italic hover:underline transition duration-300 ease-in-out transform hover:scale-105'>OCSWSSW</a>
                                                 </li>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className='font-semibold mb-2'>
                                            Specializations
                                        </h4>
                                        <ul className='list-disc list-inside text-muted-foreground space-y-1'>
                                            <li>ADHD and Autism</li>
                                            <li>Anxiety & Depression</li>
                                            <li>Relationship Counseling</li>
                                            <li>Stress Management</li>
                                            <li>Personal Growth</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className='py-20 bg-background'>
                <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        className='max-w-4xl mx-auto'
                    >
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
                                Our Core Values
                            </motion.h2>
                            <motion.p
                                variants={fadeIn}
                                custom={1}
                                className={`text-xl ${theme === 'dark' ? 'text-white/80' : 'text-black/80'} max-w-2xl mx-auto`}
                            >
                                {/* Add your core values text here */}
                            </motion.p>
                        </motion.div>

                        <div className='grid md:grid-cols-2 gap-8'>
                            <motion.div
                                variants={valueCardVariants}
                                whileHover="hover"
                                className='bg-card p-6 rounded-lg border-2 border-[#30D5C8]/20 hover:border-[#30D5C8]/40'
                            >
                                <h3 className='text-xl font-semibold mb-3 text-white'>
                                    Compassion
                                </h3>
                                <p className='text-white'>
                                    We approach every client with empathy and
                                    understanding, recognizing that each
                                    person's journey is unique.
                                </p>
                            </motion.div>

                            <motion.div
                                variants={valueCardVariants}
                                whileHover="hover"
                                className='bg-card p-6 rounded-lg border-2 border-[#30D5C8]/20 hover:border-[#30D5C8]/40'
                            >
                                <h3 className='text-xl font-semibold mb-3 text-white'>
                                    Excellence
                                </h3>
                                <p className='text-white'>
                                    We are committed to providing the highest
                                    quality care through evidence-based
                                    practices and continuous professional
                                    development.
                                </p>
                            </motion.div>

                            <motion.div
                                variants={valueCardVariants}
                                whileHover="hover"
                                className='bg-card p-6 rounded-lg border-2 border-[#30D5C8]/20 hover:border-[#30D5C8]/40'
                            >
                                <h3 className='text-xl font-semibold mb-3 text-white'>
                                    Inclusivity
                                </h3>
                                <p className='text-white'>
                                    We create a welcoming environment for people
                                    of all backgrounds, identities, and
                                    experiences.
                                </p>
                            </motion.div>

                            <motion.div
                                variants={valueCardVariants}
                                whileHover="hover"
                                className='bg-card p-6 rounded-lg border-2 border-[#30D5C8]/20 hover:border-[#30D5C8]/40'
                            >
                                <h3 className='text-xl font-semibold mb-3 text-white'>
                                    Integrity
                                </h3>
                                <p className='text-white'>
                                    We uphold the highest ethical standards in
                                    all our interactions, maintaining
                                    confidentiality and trust.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className='py-20 relative overflow-hidden'>
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

                <div className='container relative z-10 mx-auto px-4 sm:px-6 lg:px-8'>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={heroVariants}
                        className='text-center max-w-3xl mx-auto'
                    >
                        <motion.h2
                            variants={textVariants}
                            className='text-3xl md:text-4xl font-bold mb-4 text-white'
                        >
                            Ready to Begin Your Journey?
                        </motion.h2>
                        <motion.p
                            variants={textVariants}
                            className='text-xl text-white/90 mb-8'
                        >
                            Take the first step towards better mental health and well-being. Our team of professionals is here to support you.
                        </motion.p>
                        <motion.div variants={textVariants}>
                            <Button
                                size='lg'
                                className='text-lg bg-[#008080] hover:bg-[#008080]/90 text-white shadow-lg'
                                onClick={() => {
                                    if (checkIsLoggedIn()) {
                                        navigate('/booking');
                                    } else {
                                        navigate('/login');
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
    );
}
