"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Calendar } from "../../components/ui/calendar"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { CalendarIcon, CheckCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { cn } from "../../lib/utils"
import { useTheme } from "next-themes"

export default function BookingPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [step, setStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    therapistPreference: "",
    time: "",
    notes: "",
  })
  const { theme } = useTheme()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    setStep((prev) => prev + 1)
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send the form data to your backend
    setTimeout(() => {
      setIsSubmitted(true)
      window.scrollTo(0, 0)
    }, 1000)
  }

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]

  const fadeIn = {
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

  return (
    <div className="pt-16">
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-4 text-black dark:text-white/90">Book an Appointment</h1>
              <p className="text-lg text-black/70 mb-8 dark:text-white/70">
                Take the first step towards better mental health by scheduling a session with one of our professionals
              </p>
            </motion.div>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card p-8 rounded-lg shadow-sm border text-center"
              >
                <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl font-semibold mb-4">Appointment Request Submitted!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for booking with CEMAR. We have received your appointment request for{" "}
                  {date && format(date, "MMMM d, yyyy")} at {formData.time}.
                </p>
                <p className="text-muted-foreground mb-8">
                  Our team will review your request and send a confirmation email to {formData.email} within 24 hours.
                </p>
                <Button 
                  asChild
                  className="bg-[#30D5C8] text-black hover:bg-[#30D5C8]/90"
                >
                  <a href="/">Return to Home</a>
                </Button>
              </motion.div>
            ) : (
              <div className="bg-card p-8 rounded-lg shadow-sm border">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step >= 1 ? "bg-[#30D5C8] text-black" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        1
                      </div>
                      <div className={`h-1 w-12 ${step >= 2 ? "bg-[#30D5C8]" : "bg-muted"}`}></div>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step >= 2 ? "bg-[#30D5C8] text-black" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        2
                      </div>
                      <div className={`h-1 w-12 ${step >= 3 ? "bg-[#30D5C8]" : "bg-muted"}`}></div>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step >= 3 ? "bg-[#30D5C8] text-black" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        3
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Step {step} of 3</div>
                  </div>
                </div>

                {step === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h2 className="text-2xl font-semibold mb-6">Service Information</h2>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="serviceType">Type of Service</Label>
                        <Select
                          value={formData.serviceType}
                          onValueChange={(value) => handleSelectChange("serviceType", value)}
                        >
                          <SelectTrigger className={cn(
                            "text-black",
                            theme === "dark" ? "[&>span]:text-white/70" : "[&>span]:text-black/70"
                          )}>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual" className="hover:bg-[#78ede5] hover:text-black focus:bg-[#78ede5] focus:text-black">Individual Therapy</SelectItem>
                            <SelectItem value="couples" className="hover:bg-[#78ede5] hover:text-black focus:bg-[#78ede5] focus:text-black">Couples Counseling</SelectItem>
                            <SelectItem value="group" className="hover:bg-[#78ede5] hover:text-black focus:bg-[#78ede5] focus:text-black">Group Therapy</SelectItem>
                            <SelectItem value="online" className="hover:bg-[#78ede5] hover:text-black focus:bg-[#78ede5] focus:text-black">Online Session</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="therapistPreference">Therapist</Label>
                        <Select
                          value={formData.therapistPreference}
                          onValueChange={(value) => handleSelectChange("therapistPreference", value)}
                        >
                          <SelectTrigger className={cn(
                            "text-black",
                            theme === "dark" ? "[&>span]:text-white/70" : "[&>span]:text-black/70"
                          )}>
                            <SelectValue placeholder="Select a therapist" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="richard-titus" className="hover:bg-[#78ede5] hover:text-black focus:bg-[#78ede5] focus:text-black">Richard A. Titus-Glover</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Select a Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground",
                                "text-black dark:text-white [&>span]:text-black/70 dark:[&>span]:text-white/70"
                              )}
                            >
                              <CalendarIcon className={cn(
                                "mr-2 h-4 w-4",
                                "text-black dark:text-white"
                              )} />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                              disabled={(date) => {
                                // Disable past dates and weekends
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                const day = date.getDay()
                                return date < today || day === 0 || day === 6
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {date && (
                        <div>
                          <Label htmlFor="time">Select a Time</Label>
                          <Select value={formData.time} onValueChange={(value) => handleSelectChange("time", value)}>
                            <SelectTrigger className={cn(
                              "text-black",
                              theme === "dark" ? "[&>span]:text-white/70" : "[&>span]:text-black/70"
                            )}>
                              <SelectValue placeholder="Select a time slot" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time} className="hover:bg-[#78ede5] hover:text-black focus:bg-[#78ede5] focus:text-black">
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="notes">Additional Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          placeholder="Please share any specific concerns or information that would help us prepare for your session"
                          className={cn(
                            "text-black",
                            theme === "dark" ? "[&::placeholder]:text-white/70" : "[&::placeholder]:text-black/70"
                          )}
                          rows={4}
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <Button 
                        onClick={handleNext} 
                        disabled={!formData.serviceType || !date || !formData.time}
                        className="bg-[#78ede5] text-black hover:bg-[#78ede5]/90"
                      >
                        Next Step
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className={cn(
                            "text-black dark:text-white",
                            theme === "dark" ? "[&::placeholder]:text-white/70" : "[&::placeholder]:text-black/70"
                          )}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          className={cn(
                            "text-black dark:text-white",
                            theme === "dark" ? "[&::placeholder]:text-white/70" : "[&::placeholder]:text-black/70"
                          )}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          className={cn(
                            "text-black dark:text-white",
                            theme === "dark" ? "[&::placeholder]:text-white/70" : "[&::placeholder]:text-black/70"
                          )}
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={handleBack} 
                        className="text-black dark:bg-[#30D5C8] dark:text-black dark:hover:bg-[#30D5C8]/90"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handleNext} 
                        disabled={!formData.name || !formData.email || !formData.phone}
                        className="bg-[#78ede5] text-black hover:bg-[#78ede5]/90"
                      >
                        Next Step
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h2 className="text-2xl font-semibold mb-6">Review & Confirm</h2>
                    <div className="space-y-6">
                      <div className="bg-muted p-6 rounded-lg">
                        <h3 className="font-semibold mb-4">Appointment Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-sm font-medium">Service:</div>
                          <div className="text-sm text-muted-foreground">
                            {formData.serviceType === "individual" && "Individual Therapy"}
                            {formData.serviceType === "couples" && "Couples Counseling"}
                            {formData.serviceType === "group" && "Group Therapy"}
                            {formData.serviceType === "online" && "Online Session"}
                          </div>

                          <div className="text-sm font-medium">Date:</div>
                          <div className="text-sm text-muted-foreground">{date && format(date, "MMMM d, yyyy")}</div>

                          <div className="text-sm font-medium">Time:</div>
                          <div className="text-sm text-muted-foreground">{formData.time}</div>

                          <div className="text-sm font-medium">Therapist:</div>
                          <div className="text-sm text-muted-foreground">
                            {formData.therapistPreference === "richard-titus" && "Richard A. Titus-Glover"}
                            {!formData.therapistPreference && "Richard A. Titus-Glover"}
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted p-6 rounded-lg">
                        <h3 className="font-semibold mb-4">Personal Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-sm font-medium">Name:</div>
                          <div className="text-sm text-muted-foreground">{formData.name}</div>

                          <div className="text-sm font-medium">Email:</div>
                          <div className="text-sm text-muted-foreground">{formData.email}</div>

                          <div className="text-sm font-medium">Phone:</div>
                          <div className="text-sm text-muted-foreground">{formData.phone}</div>
                        </div>
                      </div>

                      {formData.notes && (
                        <div className="bg-muted p-6 rounded-lg">
                          <h3 className="font-semibold mb-4">Additional Notes</h3>
                          <p className="text-sm text-muted-foreground">{formData.notes}</p>
                        </div>
                      )}

                      <div className="bg-muted/50 p-6 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          By confirming this appointment, you agree to our{" "}
                          <a href="/terms" className="text-primary hover:underline">
                            terms of service
                          </a>{" "}
                          and{" "}
                          <a href="/privacy" className="text-primary hover:underline">
                            privacy policy
                          </a>
                          . You will receive a confirmation email with details about your appointment.
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={handleBack} 
                        className="text-black dark:bg-[#30D5C8] dark:text-black dark:hover:bg-[#30D5C8]/90"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handleSubmit}
                        className="bg-[#30D5C8] text-black hover:bg-[#30D5C8]/90"
                      >
                        Confirm Appointment
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

