"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom"
import { login, signup, checkIsLoggedIn } from "../../lib/auth-helpers"
import { GoogleIcon } from "../../components/icons/google-icon"
import { GoogleSignInButton } from "../../components/google-sign-in-button"

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
            staggerChildren: 0.1
        }
    }
};

const formVariants = {
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

const inputVariants = {
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
        scale: 1.02,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 10
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
    },
    tap: {
        scale: 0.95,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 10
        }
    }
};

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login"
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  })
  const [signupData, setSignupData] = useState<SignupData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<string>(defaultTab)

  useEffect(() => {
    // If already logged in, redirect to returnUrl or home
    if (checkIsLoggedIn()) {
      const params = new URLSearchParams(location.search)
      const returnUrl = params.get('returnUrl')
      if (returnUrl) {
        navigate(returnUrl)
      } else {
        navigate('/')
      }
    }
  }, [navigate, location])

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev: LoginData) => ({ ...prev, [name]: value }))
  }

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignupData((prev: SignupData) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const user = await login(loginData.email, loginData.password)
      console.log('🔐 Login successful:', { id: user.id, email: user.email, role: user.role })
      const params = new URLSearchParams(location.search)
      const returnUrl = params.get('returnUrl')
      
      // Check if user is a therapist - redirect to therapist dashboard
      if (user.role === 'therapist') {
        console.log('✅ User is therapist, redirecting to /therapist/dashboard')
        navigate('/therapist/dashboard')
      } else {
        console.log('👥 User is client, redirecting to home or returnUrl')
        if (returnUrl) {
          navigate(returnUrl)
        } else {
          navigate('/')
        }
      }
    } catch (err) {
      const message = (err as any)?.message || 'Failed to login. Please check your credentials.'
      console.error('❌ Login error:', message)
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      await signup(signupData.name, signupData.email, signupData.password)
      const params = new URLSearchParams(location.search)
      const returnUrl = params.get('returnUrl')
      if (returnUrl) {
        navigate(returnUrl)
      } else {
        navigate('/')
      }
    } catch (err) {
      const message = (err as any)?.message || 'Failed to create account. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="pt-16">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        className="py-20 relative overflow-hidden min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/hero-1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-[#30D5C8]/10 backdrop-blur-[2px]" />

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
          className="absolute bottom-0 left-0 w-96 h-96 bg-[#30D5C8]/5 rounded-full blur-3xl"
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
            variants={formVariants}
            className="max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <motion.h1
                variants={formVariants}
                className="text-3xl font-bold mb-2 text-white"
              >
                Welcome to <span className="text-[#30D5C8]">CEMAR</span>
              </motion.h1>
              <motion.p
                variants={formVariants}
                className="text-white/90"
              >
                Sign in to book your appointment
              </motion.p>
            </div>

            <motion.div
              variants={formVariants}
              className="bg-[#30D5C8] p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#30D5C8]/20 hover:border-[#30D5C8]/40"
            >
              <motion.div
                className="absolute -top-20 -right-20 w-64 h-64 bg-[#30D5C8]/5 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 45, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />

              <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setError("") }} className="w-full relative z-10">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#008080]">
                  <TabsTrigger value="login" className="data-[state=active]:bg-[#30D5C8]">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-[#30D5C8]">
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <TabsContent value="login">
                    <motion.div
                        variants={formVariants}
                        className="bg-[#008080] p-6 rounded-lg border border-[#008080]/20"
                    >
                        <motion.form
                            onSubmit={handleLogin}
                            className="space-y-4"
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <motion.div variants={inputVariants} className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={loginData.email}
                                    onChange={handleLoginChange}
                                    placeholder="Enter your email"
                                    required
                                    className="transition-all duration-300 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-black/70 bg-white dark:bg-white text-black dark:text-black"
                                />
                            </motion.div>
                            <motion.div variants={inputVariants} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link to="/forgot-password" className="text-sm text-[white] hover:text-blue-500 hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={loginData.password}
                                    onChange={handleLoginChange}
                                    placeholder="Enter your password"
                                    required
                                    className="transition-all duration-300 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-black/70 bg-white dark:bg-white text-black dark:text-black"
                                />
                            </motion.div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm text-red-500"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div className="text-sm text-white space-y-1">
                              <div>
                                Don&apos;t have an account?{' '}
                                <button
                                  type="button"
                                  onClick={() => setActiveTab('signup')}
                                  className="underline text-white hover:text-white/80 cursor-pointer"
                                >
                                  Sign up
                                </button>
                              </div>
                            </div>

                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                <Button
                                    type="submit"
                                    className="w-full bg-[#30D5C8] hover:bg-[#30D5C8]/90 text-black"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                className="mr-2 h-4 w-4 border-2 border-black border-t-transparent rounded-full"
                                            />
                                            Signing in...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>
                            </motion.div>

                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-[#008080] px-2 text-white">
                                        Or
                                    </span>
                                </div>
                            </div>

                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                              <GoogleSignInButton
                                className="w-full relative overflow-hidden bg-[#008080] text-white hover:bg-[#008080]/90"
                                variant="outline"
                              />
                            </motion.div>
                        </motion.form>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="signup">
                    <motion.div
                        variants={formVariants}
                        className="bg-[#008080] p-6 rounded-lg border border-[#008080]/20"
                    >
                        <motion.form
                            onSubmit={handleSignup}
                            className="space-y-4"
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <motion.div variants={inputVariants} className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={signupData.name}
                                    onChange={handleSignupChange}
                                    placeholder="Enter your full name"
                                    required
                                    className="transition-all duration-300 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-black/70 bg-white dark:bg-white text-black dark:text-black"
                                />
                            </motion.div>
                            <motion.div variants={inputVariants} className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input
                                    id="signup-email"
                                    name="email"
                                    type="email"
                                    value={signupData.email}
                                    onChange={handleSignupChange}
                                    placeholder="Enter your email"
                                    required
                                    className="transition-all duration-300 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-black/70 bg-white dark:bg-white text-black dark:text-black"
                                />
                            </motion.div>
                            <motion.div variants={inputVariants} className="space-y-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <Input
                                    id="signup-password"
                                    name="password"
                                    type="password"
                                    value={signupData.password}
                                    onChange={handleSignupChange}
                                    placeholder="Enter your password"
                                    required
                                    className="transition-all duration-300 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-black/70 bg-white dark:bg-white text-black dark:text-black"
                                />
                            </motion.div>
                            <motion.div variants={inputVariants} className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input
                                    id="confirm-password"
                                    name="confirmPassword"
                                    type="password"
                                    value={signupData.confirmPassword}
                                    onChange={handleSignupChange}
                                    placeholder="Confirm your password"
                                    required
                                    className="transition-all duration-300 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-black/70 bg-white dark:bg-white text-black dark:text-black"
                                />
                            </motion.div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm text-red-500"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                <Button
                                    type="submit"
                                    className="w-full bg-[#30D5C8] hover:bg-[#30D5C8]/90 text-black"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                className="mr-2 h-4 w-4 border-2 border-black border-t-transparent rounded-full"
                                            />
                                            Creating account...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </Button>
                            </motion.div>

                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-[#008080] px-2 text-white">
                                        Or
                                    </span>
                                </div>
                            </div>

                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                              <GoogleSignInButton
                                className="w-full relative overflow-hidden bg-[#008080] text-white hover:bg-[#008080]/90"
                                variant="outline"
                              />
                            </motion.div>
                        </motion.form>
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
              </Tabs>

              <motion.div
                variants={formVariants}
                className="mt-6 text-center text-sm text-black"
              >
                <p>
                  By continuing, you agree to our{" "}
                  <Link to="/terms" className="text-[#008080] hover:text-blue-500 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-[#008080] hover:text-blue-500 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

