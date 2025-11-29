import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { getCurrentUser, type User, checkIsLoggedIn } from "../../lib/auth-helpers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Switch } from "../../components/ui/switch"
import { Moon, Sun, Bell, Globe, Eye } from "lucide-react"
import { useTheme } from "../../components/theme-provider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { cn } from "../../lib/utils"
import PreferencesPage from './page';

export default function SettingsPage() {
  const { setTheme, theme } = useTheme()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
  })
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailUpdates: false,
    fontSize: "medium",
    language: "en",
  })

  useEffect(() => {
    const isLoggedIn = checkIsLoggedIn()
    if (!isLoggedIn) {
      navigate("/login")
      return
    }

    const currentUser = getCurrentUser()
    setUser(currentUser)
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.avatar || "",
      })
    }
    setIsLoading(false)
  }, [navigate])

  useEffect(() => {
    const savedPreferences = localStorage.getItem("sitePreferences")
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would make an API call here
    const updatedUser: User = {
      ...user!,
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar,
    }
    localStorage.setItem("userData", JSON.stringify(updatedUser))
    window.dispatchEvent(new Event("storage"))
    navigate("/profile")
  }

  const handlePreferenceChange = (key: keyof typeof preferences, value: any) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    localStorage.setItem("sitePreferences", JSON.stringify(newPreferences))
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
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
                Preferences
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className={cn(
                  theme === "dark" ? "text-white" : "text-black"
                )}
              >
                Customize your experience with appearance, language, and notification settings
              </motion.p>
            </div>

            <div className="space-y-6">
              {/* Appearance */}
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize how the website looks and feels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Theme</Label>
                      <p className="text-sm text-muted-foreground">
                        Switch between light and dark mode
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className={cn(
                        "hover:bg-[#30D5C8] hover:text-white border-[#30D5C8]",
                        theme === "dark" ? "text-white" : "text-black bg-[#30D5C8]"
                      )}
                    >
                      {theme === "dark" ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Font Size</Label>
                      <p className="text-sm text-muted-foreground">
                        Adjust the text size
                      </p>
                    </div>
                    <Select
                      value={preferences.fontSize}
                      onValueChange={(value) => {
                        handlePreferenceChange("fontSize", value);
                        // Apply font size to the document
                        const root = document.documentElement;
                        if (value === "small") {
                          root.style.fontSize = "90%";
                        } else if (value === "large") {
                          root.style.fontSize = "110%";
                        } else {
                          root.style.fontSize = "100%";
                        }
                      }}
                    >
                      <SelectTrigger className={cn(
                        "w-[120px] border-[#30D5C8]",
                        theme === "dark" ? "text-white" : "text-black bg-[#30D5C8] hover:bg-[#30D5C8]/90"
                      )}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={cn(
                        "border-[#30D5C8]",
                        theme === "dark" ? "text-white" : "text-black bg-[#30D5C8]"
                      )}>
                        <SelectItem value="small" className="hover:bg-[#30D5C8]/90">Small</SelectItem>
                        <SelectItem value="medium" className="hover:bg-[#30D5C8]/90">Medium</SelectItem>
                        <SelectItem value="large" className="hover:bg-[#30D5C8]/90">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Language and Region */}
              <Card>
                <CardHeader>
                  <CardTitle>Language & Region</CardTitle>
                  <CardDescription>
                    Choose your preferred language and regional settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Language</Label>
                      <p className="text-sm text-muted-foreground">
                        Select your preferred language
                      </p>
                    </div>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) => handlePreferenceChange("language", value)}
                    >
                      <SelectTrigger className={cn(
                        "w-[120px] border-[#30D5C8]",
                        theme === "dark" ? "text-white" : "text-black bg-[#30D5C8] hover:bg-[#30D5C8]/90"
                      )}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={cn(
                        "border-[#30D5C8]",
                        theme === "dark" ? "text-white" : "text-black bg-[#30D5C8]"
                      )}>
                        <SelectItem value="en" className="hover:bg-[#30D5C8]/90">English</SelectItem>
                        <SelectItem value="es" className="hover:bg-[#30D5C8]/90">Spanish</SelectItem>
                        <SelectItem value="fr" className="hover:bg-[#30D5C8]/90">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Manage your notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about appointments and updates
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notifications}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange("notifications", checked)
                      }
                      className={cn(
                        "border-[#30D5C8] [&>span]:text-white",
                        theme === "dark" ? "" : "bg-[#30D5C8] data-[state=checked]:bg-[#30D5C8]"
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications about new features and updates
                      </p>
                    </div>
                    <Switch
                      checked={preferences.emailUpdates}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange("emailUpdates", checked)
                      }
                      className={cn(
                        "border-[#30D5C8] [&>span]:text-white",
                        theme === "dark" ? "" : "bg-[#30D5C8] data-[state=checked]:bg-[#30D5C8]"
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
} 