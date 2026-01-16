"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "../../components/ui/button"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { getCurrentUser, type User, checkIsLoggedIn } from "../../lib/auth-helpers"
import { firestore } from "../../lib/firebase"
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { LogOut, Settings, Camera } from "lucide-react"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { cn } from "../../lib/utils"
import { useTheme } from "../../components/theme-provider"

export default function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([])
  const [pastAppointments, setPastAppointments] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = checkIsLoggedIn()

    if (!isLoggedIn) {
      navigate("/login?tab=signup")
      return
    }

    const currentUser = getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
    // Subscribe to appointments for this user
    if (currentUser?.id) {
      const q = query(collection(firestore, 'appointments'), where('clientId', '==', currentUser.id))
      const unsubscribe = onSnapshot(q, (snap) => {
        const docs = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
        const now = new Date()
        const upcoming = docs.filter(a => (a.startTime ? a.startTime.toDate() > now : a.status === 'upcoming'))
        const past = docs.filter(a => (a.startTime ? a.startTime.toDate() <= now : a.status === 'completed'))
        // sort
        upcoming.sort((x, y) => (x.startTime?.toDate?.() || 0) - (y.startTime?.toDate?.() || 0))
        past.sort((x, y) => (y.startTime?.toDate?.() || 0) - (x.startTime?.toDate?.() || 0))
        setUpcomingAppointments(upcoming)
        setPastAppointments(past)
      })
      return () => unsubscribe()
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userData")
    // Clear any other user-related data
    localStorage.removeItem("sitePreferences")
    navigate("/")
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (user) {
          const updatedUser = {
            ...user,
            avatar: reader.result as string
          }
          localStorage.setItem("userData", JSON.stringify(updatedUser))
          setUser(updatedUser)
          window.dispatchEvent(new Event("storage"))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="pt-16">
        <section className="py-20 bg-background relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto text-center"
            >
              <h1 className="text-3xl font-bold mb-4">Create Your Profile</h1>
              <p className="text-muted-foreground mb-8">
                Sign up to manage your appointments and access personalized features.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                onClick={() => navigate("/login?tab=signup")}
              >
                Sign Up Now
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    )
  }

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
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className={cn(
                  "text-3xl font-bold mb-2",
                  theme === "dark" ? "text-white" : "text-black"
                )}
              >
                Your Profile
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className={cn(
                  theme === "dark" ? "text-white" : "text-black"
                )}
              >
                Manage your personal information and appointments
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card>
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="relative group">
                        <Avatar className="h-24 w-24 cursor-pointer transition-transform group-hover:scale-105" onClick={handleAvatarClick}>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                            {user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={handleAvatarClick}>
                          <Camera className="h-6 w-6 text-white" />
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                          aria-label="Upload profile picture"
                        />
                      </div>
                    </div>
                    <CardTitle>{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      className="w-full bg-[#30D5C8] text-black hover:bg-[#30D5C8]/90" 
                      variant="outline" 
                      onClick={() => navigate("/account-settings")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Account Settings
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Upcoming Appointments */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="md:col-span-2"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <CardDescription>Your scheduled sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingAppointments.length === 0 ? (
                        <div className="bg-muted p-4 rounded-lg text-center">
                          <p className="text-muted-foreground">You don't have any upcoming appointments.</p>
                          <Button className="mt-4" onClick={() => navigate("/booking")}>Book an Appointment</Button>
                        </div>
                      ) : (
                        upcomingAppointments.map((a) => (
                          <div key={a.id} className="p-4 rounded-lg bg-muted/50 border">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold">{a.serviceTitle || a.serviceKey}</div>
                                <div className="text-sm text-muted-foreground">{a.clientEmail}</div>
                                <div className="text-sm mt-1">{a.startTime ? a.startTime.toDate().toLocaleString() : 'TBD'}</div>
                              </div>
                              <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-[#30D5C8] text-black">{a.status}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Past Appointments */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="md:col-span-3"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Past Appointments</CardTitle>
                    <CardDescription>Your previous sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pastAppointments.length === 0 ? (
                        <div className="bg-muted p-4 rounded-lg text-center">
                          <p className="text-muted-foreground">You don't have any past appointments.</p>
                        </div>
                      ) : (
                        pastAppointments.map((a) => (
                          <div key={a.id} className="p-4 rounded-lg bg-muted/50 border">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold">{a.serviceTitle || a.serviceKey}</div>
                                <div className="text-sm text-muted-foreground">{a.clientEmail}</div>
                                <div className="text-sm mt-1">{a.startTime ? a.startTime.toDate().toLocaleString() : 'TBD'}</div>
                              </div>
                              <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-gray-200 text-black">{a.status || 'completed'}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 