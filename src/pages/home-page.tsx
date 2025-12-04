'use client';

import {Button} from '../components/ui/button';
import {Link} from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion';
import {UserPlus, Users, Video} from 'lucide-react';
import {useEffect, useState, useRef} from 'react';
import {LazyImage} from '../components/ui/lazy-image';
import {cn} from '../lib/utils';
import {Check} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import { useTheme } from "../components/theme-provider"

const MotionLazyImage = motion(LazyImage);

export default function Home() {
    const { theme } = useTheme()
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [isImageLoading, setIsImageLoading] = useState(true);

    const navigate = useNavigate();

    // Add this function before the return statement
    const preloadNextImage = (nextIndex: number) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = heroImages[nextIndex];
            img.onload = resolve;
            img.onerror = reject;
        });
    };

    // Check if user is logged in (this would be replaced with actual auth logic)
    useEffect(() => {
        const userLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(userLoggedIn);
    }, []);

    // Rotate hero images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % 3);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const heroImages = [
        
        '/images/1.JPG',
        '/images/2.JPG',
        '/images/3.JPG',
    ];

    const bookingLink = isLoggedIn ? '/booking' : '/login';

    const heroVariants = {
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

    const heroContentVariants = {
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

    const heroImageVariants = {
        hidden: { opacity: 0, x: 50, scale: 0.9 },
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

    const buttonVariants = {
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
            scale: 1.05,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 10
            }
        }
    };

    // Add this new state for preloading
    const [imagesPreloaded, setImagesPreloaded] = useState(false);

    // Preload images on component mount
    useEffect(() => {
        const preloadImages = async () => {
            const imagePromises = heroImages.map((src) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = resolve;
                    img.onerror = reject;
                });
            });

            try {
                await Promise.all(imagePromises);
                setImagesPreloaded(true);
            } catch (error) {
                console.error('Error preloading images:', error);
                setImagesPreloaded(true); // Still set to true to show fallback
            }
        };

        preloadImages();
    }, []);

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15
            }
        }
    };

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
            scale: 1.05,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 10
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

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15
            }
        }
    };

    // Testimonials data
    const testimonials = [
        {
            img: '/images/client1.jpg',
            quote: "The counseling sessions have truly transformed my perspective on life. The therapists are compassionate and professional.",
            name: "Sarah M.",
            role: "Individual Therapy",
        },
        {
            img: '/images/client2.jpg',
            quote: "Group counseling helped me realize I wasn't alone in my struggles. The supportive community made all the difference.",
            name: "James T.",
            role: "Group Counseling",
        },
        {
            img: '/images/client3.jpg',
            quote: "The online sessions fit perfectly into my busy schedule. Quality care from the convenience of my home.",
            name: "Emily R.",
            role: "Online Sessions",
        },
    ];

    const [testimonialIndex, setTestimonialIndex] = useState(0);
    const testimonialIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        testimonialIntervalRef.current = window.setInterval(() => {
            setTestimonialIndex((i) => (i + 1) % testimonials.length);
        }, 5000);

        return () => {
            if (testimonialIntervalRef.current) {
                window.clearInterval(testimonialIntervalRef.current);
                testimonialIntervalRef.current = null;
            }
        };
    }, []);

    // Update the hero section render
    return (
        <div className='pt-16'>
            {/* Hero Section */}
            <section className='relative h-[90vh] flex items-center overflow-hidden'>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentImageIndex}
                        initial={{opacity: 0, scale: 1.1}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity: 0, scale: 0.9}}
                        transition={{duration: 0.5}}
                        className='absolute inset-0 z-0'
                    >
                        <LazyImage
                            src={
                                heroImages[currentImageIndex] ||
                                '/placeholder.svg'
                            }
                            alt='Calm counseling environment'
                            className={cn(
                                'w-full h-full object-cover brightness-[0.7]',
                                isImageLoading ? 'scale-105' : 'scale-100',
                            )}
                            priority={true}
                            onLoad={async () => {
                                setIsImageLoading(false);
                                const nextIndex =
                                    (currentImageIndex + 1) % heroImages.length;
                                try {
                                    await preloadNextImage(nextIndex);
                                } catch (error) {
                                    console.error(
                                        'Failed to preload next image:',
                                        error,
                                    );
                                }
                            }}
                        />
                    </motion.div>
                </AnimatePresence>
                <div className='absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 z-[1]' />
                <div className='container relative z-10 mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='max-w-3xl'>
                        <motion.div
                            initial={{opacity: 0, y: 30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{
                                duration: 0.8,
                                type: 'spring',
                                stiffness: 50,
                            }}
                        >
                            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4'>
                                Welcome to{' '}
                                <span className='text-[#30D5C8]'>
                                    CEMAR Counseling
                                </span>
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{opacity: 0, y: 30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{
                                duration: 0.8,
                                delay: 0.2,
                                type: 'spring',
                                stiffness: 50,
                            }}
                        >
                            <p className='text-xl md:text-2xl text-white/90 mb-8'>
                            Celebrating Every Milestone And Recovery
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{opacity: 0, y: 30}}
                            animate={{opacity: 1, y: 0}}
                            transition={{
                                duration: 0.8,
                                delay: 0.4,
                                type: 'spring',
                                stiffness: 50,
                            }}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            <Button
                                asChild
                                size='lg'
                                className='text-lg bg-[#008080] hover:bg-[#008080]/90 text-white shadow-lg'
                            >
                                <Link to={bookingLink}>
                                    Book an Appointment
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>
                {/* 3D Floating Elements */}
                <div className='absolute inset-0 z-[2] pointer-events-none'>
                    <motion.div
                        initial={{opacity: 0, x: -100, y: 100}}
                        animate={{
                            opacity: [0, 0.5, 0],
                            x: [-100, 100],
                            y: [100, -100],
                            rotate: [0, 180],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: 'reverse',
                        }}
                        className='absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/20 blur-xl'
                    />
                    <motion.div
                        initial={{opacity: 0, x: 100, y: -100}}
                        animate={{
                            opacity: [0, 0.3, 0],
                            x: [100, -100],
                            y: [-100, 100],
                            rotate: [180, 0],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: 'reverse',
                        }}
                        className='absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-blue-500/20 blur-xl'
                    />
                    <motion.div
                        initial={{opacity: 0, x: -50, y: -150}}
                        animate={{
                            opacity: [0, 0.4, 0],
                            x: [-50, 50],
                            y: [-150, 150],
                            rotate: [0, 90],
                        }}
                        transition={{
                            duration: 18,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: 'reverse',
                        }}
                        className='absolute bottom-1/4 right-1/3 w-24 h-24 rounded-full bg-purple-500/20 blur-xl'
                    />
                </div>
            </section>

            {/* Features Section */}
            <section className='py-20 bg-background relative overflow-hidden'>
                {/* Background 3D Elements */}
                <motion.div
                    className='absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl'
                    animate={{
                        x: [50, 100, 50],
                        y: [0, 50, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: 'reverse',
                    }}
                />
                <motion.div
                    className='absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl'
                    animate={{
                        x: [0, -50, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: 'reverse',
                    }}
                />

                <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
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
                            Our Services
                        </motion.h2>
                        <motion.p
                            variants={fadeIn}
                            custom={1}
                            className={`text-xl ${theme === 'dark' ? 'text-white/80' : 'text-black/80'} max-w-2xl mx-auto`}
                        >
                            We offer a range of professional counseling services
                            to support your mental health journey
                        </motion.p>
                    </motion.div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {/* Therapy Sessions */}
                        <motion.div
                            initial='hidden'
                            whileInView='visible'
                            whileHover='hover'
                            viewport={{once: true, margin: '-50px'}}
                            variants={cardVariants}
                            custom={0}
                            className='bg-card rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#30D5C8]/20 hover:border-[#30D5C8]/40'
                        >
                            <motion.div
                                variants={iconVariants}
                                className='bg-[#30D5C8]/10 p-3 rounded-full w-fit mb-6'
                            >
                                <UserPlus className='h-8 w-8 text-[#30D5C8]' />
                            </motion.div>
                            <motion.div variants={contentVariants}>
                                <h3 className='text-xl font-semibold mb-4'>
                                    Therapy Sessions
                                </h3>
                                <p className='text-muted-foreground mb-6'>
                                    One-on-one sessions with our experienced
                                    therapists to address your specific needs and
                                    concerns.
                                </p>
                            </motion.div>
                            <motion.div
                                variants={buttonVariants}
                                whileHover='hover'
                            >
                                <Button
                                    className="bg-[#30D5C8] text-black hover:bg-[#30D5C8]/90"
                                >
                                    Learn More
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Group Counseling */}
                        <motion.div
                            initial='hidden'
                            whileInView='visible'
                            whileHover='hover'
                            viewport={{once: true, margin: '-50px'}}
                            variants={cardVariants}
                            custom={1}
                            className='bg-card rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#30D5C8]/20 hover:border-[#30D5C8]/40'
                        >
                            <motion.div
                                variants={iconVariants}
                                className='bg-[#30D5C8]/10 p-3 rounded-full w-fit mb-6'
                            >
                                <Users className='h-8 w-8 text-[#30D5C8]' />
                            </motion.div>
                            <motion.div variants={contentVariants}>
                                <h3 className='text-xl font-semibold mb-4'>
                                    Group Counseling
                                </h3>
                                <p className='text-muted-foreground mb-6'>
                                    Connect with others facing similar challenges in
                                    a supportive group environment led by our
                                    counselors.
                                </p>
                            </motion.div>
                            <motion.div
                                variants={buttonVariants}
                                whileHover='hover'
                            >
                                <Button
                                    className="bg-[#30D5C8] text-black hover:bg-[#30D5C8]/90"
                                >
                                    Learn More
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Online Sessions */}
                        <motion.div
                            initial='hidden'
                            whileInView='visible'
                            whileHover='hover'
                            viewport={{once: true, margin: '-50px'}}
                            variants={cardVariants}
                            custom={2}
                            className='bg-card rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#30D5C8]/20 hover:border-[#30D5C8]/40'
                        >
                            <motion.div
                                variants={iconVariants}
                                className='bg-[#30D5C8]/10 p-3 rounded-full w-fit mb-6'
                            >
                                <Video className='h-8 w-8 text-[#30D5C8]' />
                            </motion.div>
                            <motion.div variants={contentVariants}>
                                <h3 className='text-xl font-semibold mb-4'>
                                    Online Sessions
                                </h3>
                                <p className='text-muted-foreground mb-6'>
                                    Access therapy from the comfort of your home
                                    with our secure and confidential online
                                    sessions.
                                </p>
                            </motion.div>
                            <motion.div
                                variants={buttonVariants}
                                whileHover='hover'
                            >
                                <Button
                                    className="bg-[#30D5C8] text-black hover:bg-[#30D5C8]/90"
                                >
                                    Learn More
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className='py-20 bg-background relative overflow-hidden'>
                <motion.div
                    className='absolute -top-16 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-[#30D5C8]/6 rounded-full blur-3xl pointer-events-none'
                    animate={{ x: [0, 15, -15, 0], y: [0, -8, 8, 0] }}
                    transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, repeatType: 'reverse' }}
                />

                <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
                    <motion.div
                        initial='hidden'
                        whileInView='visible'
                        viewport={{ once: true, margin: '-100px' }}
                        className='text-center mb-8'
                    >
                        <motion.h2
                            variants={fadeIn}
                            className={`text-3xl md:text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                        >
                            What Our Clients Say
                        </motion.h2>
                        <motion.p
                            variants={fadeIn}
                            className={`text-lg ${theme === 'dark' ? 'text-white/80' : 'text-black/80'} max-w-2xl mx-auto`}
                        >
                            Hear from individuals who have experienced positive change through our counseling services.
                        </motion.p>
                    </motion.div>

                    <div className='relative rounded-lg overflow-hidden shadow-lg'>
                        <MotionLazyImage
                            src='/images/testimonials-bg.jpg'
                            alt='soft background'
                            className='absolute inset-0 w-full h-full object-cover brightness-[0.65] pointer-events-none'
                        />
                        <div className='relative z-10 px-4 py-12'>
                            <div className='relative'>
                                <motion.div
                                    className='flex'
                                    animate={{ x: `-${testimonialIndex * 100}%` }}
                                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                                    style={{ width: `${testimonials.length * 100}%` }}
                                >
                                    {testimonials.map((t, i) => (
                                        <div key={i} className='w-full px-4' style={{ flex: '0 0 100%' }}>
                                            <motion.blockquote
                                                initial='hidden'
                                                whileInView='visible'
                                                variants={cardVariants}
                                                className='bg-card/80 backdrop-blur-sm rounded-lg p-6 md:p-10 shadow-xl border-2 border-[#30D5C8]/20'
                                            >
                                                <div className='flex items-center gap-4 mb-4'>
                                                    <div className='w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#30D5C8]'>
                                                        <img
                                                            src={t.img}
                                                            alt={`${t.name} avatar`}
                                                            className='w-full h-full object-cover'
                                                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/avatar-placeholder.png' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className='font-semibold text-[#30D5C8]'>{t.name}</p>
                                                        <p className='text-sm text-muted-foreground'>{t.role}</p>
                                                    </div>
                                                </div>

                                                <motion.p variants={contentVariants} className='text-muted-foreground italic mb-4 md:mb-6'>
                                                    "{t.quote}"
                                                </motion.p>

                                                <div className='flex items-center gap-1'>
                                                    {Array.from({ length: 5 }).map((_, s) => (
                                                        <span key={s} className='text-[#30D5C8]'>★</span>
                                                    ))}
                                                </div>
                                            </motion.blockquote>
                                        </div>
                                    ))}
                                </motion.div>

                                {/* Arrow Buttons */}
                                <button
                                    onClick={() => { setTestimonialIndex((c) => (c - 1 + testimonials.length) % testimonials.length); if (testimonialIntervalRef.current) { window.clearInterval(testimonialIntervalRef.current); } }}
                                    className='absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full shadow-md z-20'
                                    aria-label='Previous testimonial'
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={() => { setTestimonialIndex((c) => (c + 1) % testimonials.length); if (testimonialIntervalRef.current) { window.clearInterval(testimonialIntervalRef.current); } }}
                                    className='absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full shadow-md z-20'
                                    aria-label='Next testimonial'
                                >
                                    ›
                                </button>
                            </div>

                            {/* Dot Indicators */}
                            <div className='mt-6 flex justify-center items-center gap-3'>
                                {testimonials.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => { setTestimonialIndex(idx); if (testimonialIntervalRef.current) { window.clearInterval(testimonialIntervalRef.current); } }}
                                        aria-label={`Go to testimonial ${idx + 1}`}
                                        className={`w-3 h-3 rounded-full transition-colors ${testimonialIndex === idx ? 'bg-[#30D5C8]' : 'bg-white/40'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
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
                    <MotionLazyImage
                        src='/images/gold.jpg'
                        alt='Autumn forest path'
                        className='w-full h-full object-cover'
                        animate={{
                            scale: [1.1, 1, 1.2, 1.1],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: 'reverse',
                            ease: 'easeInOut',
                        }}
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
                        initial='hidden'
                        whileInView='visible'
                        viewport={{once: true}}
                        className='text-center max-w-3xl mx-auto'
                    >
                        <motion.h2
                            variants={fadeIn}
                            custom={0}
                            className='text-3xl md:text-4xl font-bold mb-4 text-white'
                        >
                            Begin Your Journey Today
                        </motion.h2>
                        <motion.p
                            variants={fadeIn}
                            custom={1}
                            className='text-xl text-white/90 mb-8'
                        >
                            Take the first step towards better mental health and
                            well-being. Our team of professionals is here to
                            support you.
                        </motion.p>
                        <motion.div
                            variants={fadeIn}
                            custom={2}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            <Button
                                asChild
                                size='lg'
                                className='text-lg bg-[#008080] hover:bg-[#008080]/90 text-white shadow-lg'
                            >
                                <Link to={bookingLink}>
                                    Book an Appointment
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}