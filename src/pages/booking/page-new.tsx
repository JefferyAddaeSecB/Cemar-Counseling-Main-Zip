"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { cn } from "../../lib/utils"
import { useTheme } from "next-themes"

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    serviceType: "",
    therapistPreference: "",
    notes: "",
  })
  const { theme } = useTheme()

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  // Load Calendly when moving to step 3
  const handleContinueToCalendly = () => {
    if (typeof window !== 'undefined' && !(window as any).Calendly) {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      document.body.appendChild(script)
    } else if ((window as any).Calendly) {
      (window as any).Calendly.reload()
    }
    setStep(3)
    window.scrollTo(0, 0)
  }

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
                Quick & simple booking process. Provide your preferences, then select your date and time.
              </p>
            </motion.div>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-card p-8 rounded-lg shadow-sm border">
              {/* Step Indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        step >= 1 ? "bg-[#30D5C8] text-black" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      1
                    </div>
                    <div className={`h-1 w-12 transition-colors ${step >= 2 ? "bg-[#30D5C8]" : "bg-muted"}`}></div>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        step >= 2 ? "bg-[#30D5C8] text-black" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      2
                    </div>
                    <div className={`h-1 w-12 transition-colors ${step >= 3 ? "bg-[#30D5C8]" : "bg-muted"}`}></div>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        step >= 3 ? "bg-[#30D5C8] text-black" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      3
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Step {step} of 3</div>
                </div>
              </div>

              {/* Step 1: Service Selection */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-semibold mb-6">What Service Are You Looking For?</h2>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="serviceType">Type of Service *</Label>
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
                          <SelectItem value="individual" className="hover:bg-[#30D5C8] hover:text-black focus:bg-[#30D5C8] focus:text-black">Individual Therapy</SelectItem>
                          <SelectItem value="couples" className="hover:bg-[#30D5C8] hover:text-black focus:bg-[#30D5C8] focus:text-black">Couples Counseling</SelectItem>
                          <SelectItem value="group" className="hover:bg-[#30D5C8] hover:text-black focus:bg-[#30D5C8] focus:text-black">Group Therapy</SelectItem>
                          <SelectItem value="online" className="hover:bg-[#30D5C8] hover:text-black focus:bg-[#30D5C8] focus:text-black">Online Session</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="therapistPreference">Preferred Therapist (Optional)</Label>
                      <Select
                        value={formData.therapistPreference}
                        onValueChange={(value) => handleSelectChange("therapistPreference", value)}
                      >
                        <SelectTrigger className={cn(
                          "text-black",
                          theme === "dark" ? "[&>span]:text-white/70" : "[&>span]:text-black/70"
                        )}>
                          <SelectValue placeholder="Any available" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any" className="hover:bg-[#30D5C8] hover:text-black focus:bg-[#30D5C8] focus:text-black">Any Available</SelectItem>
                          <SelectItem value="richard-titus" className="hover:bg-[#30D5C8] hover:text-black focus:bg-[#30D5C8] focus:text-black">Richard A. Titus-Glover</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Tell us about any specific concerns or what you'd like to focus on..."
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
                      disabled={!formData.serviceType}
                      className="bg-[#30D5C8] text-black hover:bg-[#30D5C8]/90"
                    >
                      Continue
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Review Preferences */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-semibold mb-6">Review Your Preferences</h2>
                  
                  <div className="space-y-4 mb-8">
                    <div className="bg-muted p-6 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">Service Type</p>
                      <p className="text-lg font-semibold mt-2">
                        {formData.serviceType === "individual" && "Individual Therapy"}
                        {formData.serviceType === "couples" && "Couples Counseling"}
                        {formData.serviceType === "group" && "Group Therapy"}
                        {formData.serviceType === "online" && "Online Session"}
                      </p>
                    </div>

                    {formData.therapistPreference && formData.therapistPreference !== "any" && (
                      <div className="bg-muted p-6 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">Preferred Therapist</p>
                        <p className="text-lg font-semibold mt-2">
                          {formData.therapistPreference === "richard-titus" && "Richard A. Titus-Glover"}
                        </p>
                      </div>
                    )}

                    {formData.notes && (
                      <div className="bg-muted p-6 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">Your Notes</p>
                        <p className="text-sm mt-2">{formData.notes}</p>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-8">
                    Next, you'll provide your contact info and select your preferred date & time with our Calendly scheduler.
                  </p>

                  <div className="mt-8 flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={handleBack}
                      className="text-black dark:bg-[#30D5C8] dark:text-black dark:hover:bg-[#30D5C8]/90"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleContinueToCalendly}
                      className="bg-[#30D5C8] text-black hover:bg-[#30D5C8]/90"
                    >
                      Continue to Calendar
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Calendly Embed */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-semibold mb-2">Select Your Appointment Time</h2>
                  <p className="text-muted-foreground mb-6">
                    Choose your preferred date and time. You'll provide your contact information in the next step.
                  </p>
                  
                  <div className="bg-gradient-to-br from-[#30D5C8]/5 to-[#008080]/5 rounded-lg p-6 mb-6 border border-[#30D5C8]/20">
                    <div 
                      className="calendly-inline-widget" 
                      data-url="https://calendly.com/cemarcounseling-info/30min" 
                      style={{
                        minWidth: '320px',
                        height: '700px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      } as React.CSSProperties}
                    ></div>
                  </div>

                  <style>{`
                    /* Calendly styling to match CEMAR theme */
                    .calendly-inline-widget {
                      --cal-primary-color: #30D5C8;
                      --cal-secondary-color: #008080;
                    }
                  `}</style>

                  <div className="mt-8 flex justify-start">
                    <Button 
                      variant="outline" 
                      onClick={handleBack}
                      className="text-black dark:bg-[#30D5C8] dark:text-black dark:hover:bg-[#30D5C8]/90"
                    >
                      Back
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
