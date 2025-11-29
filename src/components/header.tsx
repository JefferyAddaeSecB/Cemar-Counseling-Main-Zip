import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import { checkIsLoggedIn } from '../lib/auth-helpers';
import { useTheme } from '../components/theme-provider';
import { cn } from '../lib/utils';

interface NavItem {
    path: string;
    label: string;
}

const navItems: NavItem[] = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' },
];

const Header = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme } = useTheme();

    const navVariants = {
        hidden: { opacity: 0, y: -20 },
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

    const logoVariants = {
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
            scale: 1.1,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 10
            }
        }
    };

    const menuItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15
            }
        },
        hover: {
            scale: 1.05,
            color: '#30D5C8',
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 10
            }
        }
    };

    return (
        <motion.header
            initial="hidden"
            animate="visible"
            variants={navVariants}
            className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <motion.div
                        variants={logoVariants}
                        whileHover="hover"
                        className="flex items-center"
                    >
                        <Link to="/" className="flex items-center">
                            <img
                                src={theme === 'dark' ? "/logo-dark.png" : "/logo.png"}
                                alt="CEMAR Counselling Logo"
                                className="h-8 w-auto"
                            />
                            <span className="ml-2 text-xl font-bold text-foreground">CEMAR Counselling</span>
                        </Link>
                    </motion.div>

                    <nav className="hidden md:flex items-center space-x-8">
                        {navItems.map((item: NavItem, index: number) => (
                            <motion.div
                                key={item.path}
                                variants={menuItemVariants}
                                custom={index}
                                whileHover="hover"
                            >
                                <Link
                                    to={item.path}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-[#30D5C8]",
                                        theme === 'dark' ? 'text-white' : 'text-black'
                                    )}
                                >
                                    {item.label}
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    <motion.div
                        variants={menuItemVariants}
                        whileHover="hover"
                        className="hidden md:block"
                    >
                        <Button
                            onClick={() => {
                                if (checkIsLoggedIn()) {
                                    navigate('/booking');
                                } else {
                                    navigate('/login');
                                }
                            }}
                            className="bg-[#30D5C8] hover:bg-[#30D5C8]/90 text-white"
                        >
                            Book Now
                        </Button>
                    </motion.div>

                    <motion.div
                        variants={menuItemVariants}
                        whileHover="hover"
                        className="md:hidden"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    </motion.div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                    opacity: isMenuOpen ? 1 : 0,
                    height: isMenuOpen ? 'auto' : 0
                }}
                transition={{ duration: 0.3 }}
                className="md:hidden border-t"
            >
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex flex-col space-y-4">
                        {navItems.map((item: NavItem, index: number) => (
                            <motion.div
                                key={item.path}
                                variants={menuItemVariants}
                                custom={index}
                                whileHover="hover"
                            >
                                <Link
                                    to={item.path}
                                    className={cn(
                                        "block py-2 text-sm font-medium transition-colors hover:text-[#30D5C8]",
                                        theme === 'dark' ? 'text-white' : 'text-black'
                                    )}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            </motion.div>
                        ))}
                        <motion.div
                            variants={menuItemVariants}
                            whileHover="hover"
                        >
                            <Button
                                onClick={() => {
                                    if (checkIsLoggedIn()) {
                                        navigate('/booking');
                                    } else {
                                        navigate('/login');
                                    }
                                    setIsMenuOpen(false);
                                }}
                                className={cn(
                                    "w-full bg-[#30D5C8] hover:bg-[#30D5C8]/90 text-white",
                                    theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
                                )}
                            >
                                Book Now
                            </Button>
                        </motion.div>
                    </nav>
                </div>
            </motion.div>
        </motion.header>
    );
};

export default Header; 