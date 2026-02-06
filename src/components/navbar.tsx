"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Menu, X, UserIcon, Settings, LogOut, LogIn, UserPlus, Sliders } from "lucide-react"
import { cn } from "../lib/utils"
import { motion } from "framer-motion"
import { checkIsLoggedIn, getCurrentUser, logout, type User } from "../lib/auth-helpers"
import { useTheme } from "../components/theme-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

// Add these animation variants at the top of the component
const navItemVariants = {
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

const dropdownVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
}

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { theme } = useTheme()

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = checkIsLoggedIn()
      setIsLoggedIn(loggedIn)

      if (loggedIn) {
        const currentUser = getCurrentUser()
        setUser(currentUser)
      } else {
        setUser(null)
      }
    }

    checkLoginStatus()
    window.addEventListener("storage", checkLoginStatus)

    return () => {
      window.removeEventListener("storage", checkLoginStatus)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ]

  const bookingLink = isLoggedIn ? "/booking" : "/login"

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500",
        isScrolled ? "bg-[#30D5C8]/95 backdrop-blur-sm shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          {/* Logo on the left */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                <img
                  src="/images/logo.png"
                  alt="CEMAR - Celebrating Every Milestone And Recovery"
                  className="h-16 md:h-15"
                />
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center space-x-12">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
              >
                <Link
                  to={link.href}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors hover:text-[#008080]",
                    location.pathname === link.href
                      ? "border-b-2 border-[#008080]"
                      : "",
                    theme === 'dark' ? 'text-white' : 'text-black'
                  )}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="ml-auto flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="default"
                className="hidden md:inline-flex bg-[#008080] hover:bg-[#30D5C8] text-white transition-colors duration-300" 
                onClick={() => {
                  if (!isLoggedIn) {
                    navigate('/login?returnUrl=/booking');
                  } else {
                    navigate('/booking');
                  }
                }}
              >
                Book Appointment
              </Button>
            </motion.div>
            {!isLoggedIn ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  className="bg-[#30D5C8] text-black border-2 border-[#008080] hover:bg-[#30D5C8]/90 hover:text-black hover:border-[#008080] transition-colors duration-300"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </motion.div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full ring-2 ring-[#008080] hover:ring-[#30D5C8]">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-[#008080] text-white">
                          {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={dropdownVariants}
                >
                  <DropdownMenuContent className="w-56 border-[#008080]" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-White">{user?.name}</p>
                        <p className="text-xs leading-none text-[#30D5C8]">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#008080]/20" />
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="text-White  hover:text-[#30D5C8] cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/account-settings')} className="text-White hover:text-[#30D5C8] cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/preferences')} className="text-White hover:text-[#30D5C8] cursor-pointer">
                      <Sliders className="mr-2 h-4 w-4" />
                      <span>Preferences</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/booking')} className="text-White hover:text-[#30D5C8] cursor-pointer">
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Book Appointment</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#008080]/20" />
                    <DropdownMenuItem className="text-red-600 hover:text-red-700 cursor-pointer" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </motion.div>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center rounded-md p-2 text-[#008080] hover:bg-[#30D5C8]/10 focus:outline-none focus:ring-2 focus:ring-[#008080]"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={mobileMenuVariants}
          className="md:hidden bg-[#008080] border-b border-[#008080]/20 shadow-md"
        >
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
              >
                <Link
                  to={link.href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-base font-medium transition-colors hover:text-white",
                    location.pathname === link.href
                      ? "bg-white/10"
                      : "hover:bg-white/10",
                    "text-white"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            {!isLoggedIn ? (
              <div className="px-3 py-2">
                <Button 
                  variant="outline" 
                  className="w-full bg-white text-[#008080] border-white hover:bg-white/90 hover:text-[#008080] hover:border-white transition-colors duration-300" 
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </div>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-white hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/account-settings"
                  className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-white hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                >
                  Account Settings
                </Link>
                <Link
                  to="/preferences"
                  className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-white hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                >
                  Preferences
                </Link>
                <div className="px-3 py-2">
                  <Button 
                    variant="destructive" 
                    className="w-full bg-[#30D5C8] text-black hover:bg-[#30D5C8]/90 hover:text-black" 
                    onClick={handleLogout}
                  >
                    Log out
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}

