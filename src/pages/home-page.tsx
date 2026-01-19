'use client';

import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Users, Video } from 'lucide-react';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { TESTIMONIALS } from '../lib/constants';
import { LazyImage } from '../components/ui/lazy-image';
import { cn } from '../lib/utils';
import { useTheme } from '../components/theme-provider';

const MotionLazyImage = motion(LazyImage);

export default function Home() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // -- Config / constants (memoized) -------------------------------------------------
  const heroImages = useMemo(
    () => [ '/images/0.1.JPG', '/images/0.2.JPG', '/images/2.JPG', '/images/3.JPG'],
    []
  );

  // Use centralized constant testimonials (six entries)
  const testimonials = TESTIMONIALS

  // -- Local state ------------------------------------------------------------------
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonialIntervalRef = useRef<number | null>(null);
  const heroIntervalRef = useRef<number | null>(null);

  const bookingLink = isLoggedIn ? '/booking' : '/login';

  // -- Reusable animation config ---------------------------------------------------
  const baseSpring = useMemo(
    () => ({ type: 'spring', stiffness: 100, damping: 15 }),
    []
  );

  const variants = useMemo(
    () => ({
      fadeIn: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: baseSpring } },
      card: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: baseSpring },
        hover: { scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 10 } },
      },
      icon: { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: baseSpring }, hover: { scale: 1.2 } },
    }),
    [baseSpring]
  );

  // -- Helpers ---------------------------------------------------------------------
  const safeClearInterval = useCallback((ref: React.MutableRefObject<number | null>) => {
    if (ref.current !== null) {
      window.clearInterval(ref.current);
      ref.current = null;
    }
  }, []);

  const preloadImage = useCallback((src: string) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve();
      img.onerror = () => resolve(); // resolve on error so UI still works
    });
  }, []);

  const preloadNextImage = useCallback(async (index: number) => {
    const nextIndex = index % heroImages.length;
    const src = heroImages[nextIndex];
    await preloadImage(src);
  }, [heroImages, preloadImage]);

  // -- Effects ---------------------------------------------------------------------
  // Auth check
  useEffect(() => {
    const userLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);
  }, []);

  // Preload all hero images once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await Promise.all(heroImages.map((s) => preloadImage(s)));
      } catch (e) {
        // ignore errors - fallback is shown via placeholder
        console.error('Preload error', e);
      }
      if (mounted) setImagesPreloaded(true);
    })();
    return () => {
      mounted = false;
    };
  }, [heroImages, preloadImage]);

  // Hero rotation (efficient, single interval)
  useEffect(() => {
    safeClearInterval(heroIntervalRef);
    heroIntervalRef.current = window.setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => safeClearInterval(heroIntervalRef);
  }, [heroImages.length, safeClearInterval]);

  // Testimonials rotation (auto-rotate every 8 seconds per spec)
  useEffect(() => {
    safeClearInterval(testimonialIntervalRef);
    testimonialIntervalRef.current = window.setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % testimonials.length);
    }, 8000);

    return () => safeClearInterval(testimonialIntervalRef);
  }, [testimonials.length, safeClearInterval]);

  // Ensure top-level element has id so footer anchors (#home) work with SPA anchors
  useEffect(() => {
    // Scroll to top on mount to avoid showing strange positions when navigating between routes
    window.scrollTo(0, 0);
    document.title = 'CEMAR Counseling';
  }, []);

  // -- Event handlers --------------------------------------------------------------
  const handleManualTestimonialChange = (idx: number) => {
    setTestimonialIndex(idx);
    safeClearInterval(testimonialIntervalRef);
  };

  const handlePrevTestimonial = () => {
    setTestimonialIndex((c) => (c - 1 + testimonials.length) % testimonials.length);
    safeClearInterval(testimonialIntervalRef);
  };

  const handleNextTestimonial = () => {
    setTestimonialIndex((c) => (c + 1) % testimonials.length);
    safeClearInterval(testimonialIntervalRef);
  };

  // -- Render ---------------------------------------------------------------------
  return (
    <div id="home" className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 z-0"
          >
            <LazyImage
              src={imagesPreloaded ? heroImages[currentImageIndex] : '/placeholder.svg'}
              alt="Calm counseling environment"
              className={cn('w-full h-full object-cover brightness-[0.7]', isImageLoading ? 'scale-105' : 'scale-100')}
              priority={true}
              onLoad={async () => {
                setIsImageLoading(false);
                // fire-and-forget preload of following image to keep transitions smooth
                preloadNextImage(currentImageIndex + 1).catch(() => {});
              }}
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 z-[1]" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div initial="hidden" animate="visible" variants={variants.fadeIn}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Welcome to <span className="text-[#30D5C8]">CEMAR Counseling</span>
              </h1>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={variants.fadeIn}>
              <p className="text-xl md:text-2xl text-white/90 mb-8">Celebrating Every Milestone And Recovery</p>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={variants.fadeIn} whileHover={{ scale: 1.03 }}>
              <Button
                size="lg"
                className="text-lg bg-[#008080] hover:bg-[#008080]/90 text-white shadow-lg"
                onClick={() => {
                  if (isLoggedIn) {
                    navigate('/booking');
                  } else {
                    navigate('/login?returnUrl=/booking');
                  }
                }}
              >
                Book an Appointment
              </Button>
            </motion.div>
          </div>
        </div>

        {/* 3D Floating Elements (kept minimal for performance) */}
        <div className="absolute inset-0 z-[2] pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/20 blur-xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-center mb-16">
            <motion.h2 variants={variants.fadeIn} className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              Our Services
            </motion.h2>
            <motion.p variants={variants.fadeIn} className={`text-xl ${theme === 'dark' ? 'text-white/80' : 'text-black/80'} max-w-2xl mx-auto`}>
              We offer a range of professional counseling services to support your mental health journey
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Therapy Sessions */}
            <motion.div initial="hidden" whileInView="visible" whileHover="hover" viewport={{ once: true, margin: '-50px' }} variants={variants.card} className="bg-card rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#30D5C8]/20 hover:border-[#30D5C8]/40">
              <motion.div variants={variants.icon} className="bg-[#30D5C8]/10 p-3 rounded-full w-fit mb-6">
                <UserPlus className="h-8 w-8 text-[#30D5C8]" />
              </motion.div>
              <motion.div>
                <h3 className="text-xl font-semibold mb-4">Therapy Sessions</h3>
                <p className="text-muted-foreground mb-6">One-on-one sessions with our experienced therapists to address your specific needs and concerns.</p>
              </motion.div>
              <motion.div variants={variants.fadeIn} whileHover={{ scale: 1.02 }}>
                <Button className="bg-[#30D5C8] text-black hover:bg-[#30D5C8]/90" onClick={() => navigate('/services#one-on-one')}>Learn More</Button>
              </motion.div>
            </motion.div>

            {/* Group Counseling */}
            <motion.div initial="hidden" whileInView="visible" whileHover="hover" viewport={{ once: true, margin: '-50px' }} variants={variants.card} className="bg-card rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#30D5C8]/20 hover:border-[#30D5C8]/40">
              <motion.div variants={variants.icon} className="bg-[#30D5C8]/10 p-3 rounded-full w-fit mb-6">
                <Users className="h-8 w-8 text-[#30D5C8]" />
              </motion.div>
              <motion.div>
                <h3 className="text-xl font-semibold mb-4">Group Counseling</h3>
                <p className="text-muted-foreground mb-6">Connect with others facing similar challenges in a supportive group environment led by our counselors.</p>
              </motion.div>
              <motion.div variants={variants.fadeIn} whileHover={{ scale: 1.02 }}>
                <Button className="bg-[#30D5C8] text-black hover:bg-[#30D5C8]/90" onClick={() => navigate('/services#group')}>Learn More</Button>
              </motion.div>
            </motion.div>

            {/* Online Sessions */}
            <motion.div initial="hidden" whileInView="visible" whileHover="hover" viewport={{ once: true, margin: '-50px' }} variants={variants.card} className="bg-card rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#30D5C8]/20 hover:border-[#30D5C8]/40">
              <motion.div variants={variants.icon} className="bg-[#30D5C8]/10 p-3 rounded-full w-fit mb-6">
                <Video className="h-8 w-8 text-[#30D5C8]" />
              </motion.div>
              <motion.div>
                <h3 className="text-xl font-semibold mb-4">Online Sessions</h3>
                <p className="text-muted-foreground mb-6">Access therapy from the comfort of your home with our secure and confidential online sessions.</p>
              </motion.div>
              <motion.div variants={variants.fadeIn} whileHover={{ scale: 1.02 }}>
                <Button className="bg-[#30D5C8] text-black hover:bg-[#30D5C8]/90" onClick={() => navigate('/services#online')}>Learn More</Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Early Results & Founder Feedback */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-center mb-6">
            <motion.h2 variants={variants.fadeIn} className={`text-3xl md:text-4xl font-bold mb-6 text-black`}>
              What Our Clients Say
            </motion.h2>
            <motion.p variants={variants.fadeIn} className={`text-lg text-black/80 max-w-3xl mx-auto`}>
              Hear from individuals who have experienced positive change through our counseling services.
            </motion.p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-lg overflow-hidden">

              <MotionLazyImage src="/images/testimonials-bg.jpg" alt="soft background" className="absolute inset-0 w-full h-full object-cover brightness-75 pointer-events-none" />
              {/* Darker overlay for stronger contrast */}
              <div className="absolute inset-0 bg-black/50" />

              <div className="relative h-[300px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={testimonialIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center p-4"
                  >
                    <div className="rounded-lg p-6 max-w-2xl w-full">
                      <div className="flex flex-col items-center justify-center text-center px-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden mb-4 ring-2 ring-[#30D5C8]">
                          <img
                            src={testimonials[testimonialIndex].avatar}
                            alt={testimonials[testimonialIndex].name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/avatar-placeholder.png' }}
                          />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>{testimonials[testimonialIndex].name}</h3>
                        <p className="text-white/80 mb-6" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>{testimonials[testimonialIndex].title}</p>

                        <p className="text-white max-w-2xl italic" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>"{testimonials[testimonialIndex].quote}"</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-6 flex justify-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => { setTestimonialIndex(index) }}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === testimonialIndex ? 'bg-[#30D5C8]' : 'bg-[#30D5C8]/30'}`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <motion.div className="absolute inset-0 z-0" initial={{ scale: 1, rotate: 0 }} animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0] }} transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}>
          <MotionLazyImage src="/images/gold.jpg" alt="Autumn forest path" className="w-full h-full object-cover" animate={{ scale: [1.05, 1, 1.05] }} transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse' }} />
          <motion.div className="absolute inset-0" animate={{ backgroundColor: ['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.4)'] }} transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }} />
        </motion.div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center max-w-3xl mx-auto">
            <motion.h2 variants={variants.fadeIn} className="text-3xl md:text-4xl font-bold mb-4 text-white">Begin Your Journey Today</motion.h2>
            <motion.p variants={variants.fadeIn} className="text-xl text-white/90 mb-8">Take the first step towards better mental health and well-being. Our team of professionals is here to support you.</motion.p>
            <motion.div variants={variants.fadeIn} whileHover={{ scale: 1.03 }}>
              <Button
                size="lg"
                className="text-lg bg-[#008080] hover:bg-[#008080]/90 text-white shadow-lg"
                onClick={() => {
                  if (isLoggedIn) {
                    navigate('/booking#booking-top');
                  } else {
                    navigate('/login?returnUrl=/booking#booking-top');
                  }
                }}
              >
                Book an Appointment
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer note: keep this simple so footer links work with SPA routers. If your Footer component uses anchor tags like <a href="#home"> it will now work because the top-level div has id="home". Prefer using react-router <Link to="/"> for cross-page navigation. */}
    </div>
  );
}
