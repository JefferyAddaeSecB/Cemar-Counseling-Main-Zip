import { Link, useNavigate } from "react-router-dom"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { checkIsLoggedIn } from "../lib/auth-helpers"
import { motion } from "framer-motion"

const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
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

export default function Footer() {
    const navigate = useNavigate()

    const handleServiceClick = (path: string) => {
        console.log('Starting navigation check...')
        console.log('LocalStorage isLoggedIn:', localStorage.getItem('isLoggedIn'))
        const isLoggedIn = checkIsLoggedIn()
        console.log('checkIsLoggedIn result:', isLoggedIn)
        console.log('Attempting to navigate to:', path)
        
        if (isLoggedIn) {
            navigate(path)
        } else {
            console.log('User not logged in, redirecting to login')
            navigate("/login")
        }
    }

    return (
        <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={footerVariants}
            className="bg-muted py-12"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <motion.div variants={itemVariants} className="space-y-4">
                        <motion.div 
                            variants={itemVariants}
                            whileHover={{ scale: 1.1, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                            className="cursor-pointer"
                        >
                            <img
                                src="/light.png"
                                alt=""
                                className="h-20 md:h-26"
                            />
                        </motion.div>
                        <motion.p variants={itemVariants} className="text-sm text-muted-foreground">
                            Celebrating Every Milestone And Recovery
                        </motion.p>
                        <div className="flex space-x-4">
                            <motion.a
                                href="#"
                                variants={iconVariants}
                                whileHover="hover"
                                className="text-muted-foreground hover:text-[#30D5C8]"
                            >
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </motion.a>
                            <motion.a
                                href="#"
                                variants={iconVariants}
                                whileHover="hover"
                                className="text-muted-foreground hover:text-[#30D5C8]"
                            >
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </motion.a>
                            <motion.a
                                href="#"
                                variants={iconVariants}
                                whileHover="hover"
                                className="text-muted-foreground hover:text-[#30D5C8]"
                            >
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </motion.a>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-4">
                        <motion.h3 variants={itemVariants} className="text-lg font-semibold">Quick Links</motion.h3>
                        <ul className="space-y-2">
                           {['Home', 'About', 'Services', 'Contact'].map((link, index) => {
    const path =
        link === "Home"
            ? "/"                    // FIXED
            : `/${link.toLowerCase()}`;

    return (
        <motion.li key={link} variants={itemVariants} custom={index} whileHover="hover">
            <Link
                to={path}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-muted-foreground hover:text-[#30D5C8]"
            >
                {link}
            </Link>
        </motion.li>
    );
})}
                        </ul>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-4">
                        <motion.h3 variants={itemVariants} className="text-lg font-semibold">Services</motion.h3>
                        <ul className="space-y-2">
                            {['One-on-One Therapy', 'Group Counseling', 'Online Sessions'].map((service, index) => (
                                <motion.li
                                    key={service}
                                    variants={itemVariants}
                                    custom={index}
                                    whileHover="hover"
                                >
                                    <Link
                                        to="#"
                                        className="text-muted-foreground hover:text-[#30D5C8]"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                            handleServiceClick("/services");
                                        }}
                                    >
                                        {service}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-4">
                        <motion.h3 variants={itemVariants} className="text-lg font-semibold">Contact</motion.h3>
                        <motion.p variants={itemVariants} className="mt-2">
                            <a
                                href="tel:+1234567890"
                                className="hover:text-[#30D5C8]"
                            >
                                (416) 885-6821
                            </a>
                        </motion.p>
                        <motion.p variants={itemVariants}>
                            <a
                                href="mailto:info@cemar.com"
                                className="hover:text-[#30D5C8]"
                            >
                                info@cemarcounseling.com
                            </a>
                        </motion.p>
                    </motion.div>
                </div>

                <motion.div
                    variants={itemVariants}
                    className="mt-12 pt-8 border-t border-white"
                >
                    <motion.p variants={itemVariants} className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} CEMAR. All rights reserved.
                    </motion.p>
                    <div className="mt-4 flex justify-center space-x-6">
                        <motion.a
                            variants={itemVariants}
                            whileHover="hover"
                            href="/privacy"
                            className="text-xs text-muted-foreground hover:text-[#30D5C8]"
                        >
                            Privacy Policy
                        </motion.a>
                        <motion.a
                            variants={itemVariants}
                            whileHover="hover"
                            href="/terms"
                            className="text-xs text-muted-foreground hover:text-[#30D5C8]"
                        >
                            Terms of Service
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    )
}
