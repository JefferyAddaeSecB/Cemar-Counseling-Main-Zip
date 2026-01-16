import { useEffect, useState, useRef } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { getCurrentUser, type User, checkIsLoggedIn, updateAccountProfile } from "../../lib/auth-helpers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Camera, CheckCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog"
import { cn } from "../../lib/utils"
import { useTheme } from "../../components/theme-provider"

export default function AccountSettingsPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const { theme } = useTheme()

  useEffect(() => {
    const isLoggedIn = checkIsLoggedIn()
    if (!isLoggedIn) {
      navigate("/login")
      return
    }

    const currentUser = getCurrentUser()
    setUser(currentUser)
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name,
        email: currentUser.email,
      }))
    }
    setIsLoading(false)
  }, [navigate])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate passwords if changing
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        setError("Current password is required to change password")
        return
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError("New passwords do not match")
        return
      }
      if (formData.newPassword.length < 6) {
        setError("New password must be at least 6 characters")
        return
      }
    }

    if (!user) {
      setError("You need to be logged in to update your account.")
      return
    }

    try {
      setIsSaving(true)
      const updatedUser = await updateAccountProfile({
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword || undefined,
        newPassword: formData.newPassword || undefined,
      })

      setUser(updatedUser)
      window.dispatchEvent(new Event("storage"))
      setShowSuccessDialog(true)

      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (err) {
      const message = (err as any)?.message || "Failed to update account. Please try again."
      setError(message)
    } finally {
      setIsSaving(false)
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

  return (
    <div className="pt-16">
      <section className="py-20 bg-background relative overflow-hidden">
        {/* Background Elements */}
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
            className="max-w-2xl mx-auto"
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
                Account Settings
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className={cn(
                  theme === "dark" ? "text-white" : "text-black"
                )}
              >
                Manage your profile information and security settings
              </motion.p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile details and password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex justify-center mb-6">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 cursor-pointer transition-transform group-hover:scale-105" onClick={handleAvatarClick}>
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                          {user?.name.substring(0, 2).toUpperCase()}
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

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className={cn(
                        theme === "dark" ? "text-white placeholder:text-white" : "text-black placeholder:text-black"
                      )}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className={cn(
                        theme === "dark" ? "text-white placeholder:text-white" : "text-black placeholder:text-black"
                      )}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={formData.currentPassword}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))
                          }
                          className={cn(
                            theme === "dark" ? "placeholder:text-white" : "placeholder:text-black"
                          )}
                          placeholder="Enter your current password"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, newPassword: e.target.value }))
                          }
                          className={cn(
                            theme === "dark" ? "placeholder:text-white" : "placeholder:text-black"
                          )}
                          placeholder="Enter your new password"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                          }
                          className={cn(
                            theme === "dark" ? "placeholder:text-white" : "placeholder:text-black"
                          )}
                          placeholder="Confirm your new password"
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="text-sm text-muted-foreground">
                    Forgot your password?{' '}
                    <Link to="/forgot-password" className="text-[#008080] hover:underline">
                      Reset it here
                    </Link>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      className="bg-[#78ede5] text-black hover:bg-[#78ede5]/90"
                      onClick={() => navigate("/profile")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#78ede5] text-black hover:bg-[#78ede5]/90"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
              >
                <CheckCircle className="h-16 w-16 text-[#00807f] mb-4" />
              </motion.div>
              <AlertDialogTitle className={cn(
                "text-2xl font-semibold mb-2",
                theme === "dark" ? "text-white" : "text-black"
              )}>
                Changes Saved Successfully!
              </AlertDialogTitle>
              <AlertDialogDescription className={cn(
                "text-center",
                theme === "dark" ? "text-white/70" : "text-black"
              )}>
                Your profile information has been updated.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center">
            <Button 
              className="bg-[#00807f] text-white hover:bg-[#78ede5]/90"
              onClick={() => {
                setShowSuccessDialog(false)
                navigate('/profile')
              }}
            >
              Done
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 