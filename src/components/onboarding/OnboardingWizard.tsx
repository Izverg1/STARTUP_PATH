"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, ArrowLeft, Clock } from "lucide-react"
import ICPStep from "./steps/ICPStep"
import ChannelStep from "./steps/ChannelStep"
import SuccessStep from "./steps/SuccessStep"
import ModeStep from "./steps/ModeStep"
import { onboardingSchema, stepSchemas, type OnboardingFormData } from "@/lib/validations/onboarding"

const steps = [
  {
    id: "icp",
    title: "ICP & Economics",
    description: "Define your target market",
    component: ICPStep,
    schema: stepSchemas.icp,
  },
  {
    id: "channel",
    title: "Channel Selection",
    description: "Choose your marketing channels",
    component: ChannelStep,
    schema: stepSchemas.channel,
  },
  {
    id: "success",
    title: "Success Metrics",
    description: "Set your target KPIs",
    component: SuccessStep,
    schema: stepSchemas.success,
  },
  {
    id: "mode",
    title: "Simulation Mode",
    description: "Select your data source",
    component: ModeStep,
    schema: stepSchemas.mode,
  },
]

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const router = useRouter()

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: "onBlur",
    defaultValues: {
      channels: [],
      grossMargin: 80,
      cacPaybackWindow: 12,
      cpqmTarget: 250,
    },
  })

  const { handleSubmit, trigger, formState } = form
  const currentStepData = steps[currentStep]

  const validateCurrentStep = async () => {
    const isValid = await trigger(Object.keys(currentStepData.schema.shape) as (keyof OnboardingFormData)[])
    return isValid
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    
    if (isValid) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        // Final step - submit the form
        handleSubmit(onSubmit)()
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = (data: OnboardingFormData) => {
    console.log("Onboarding completed:", data)
    // Here you would typically save the data to your backend
    // For now, redirect to dashboard
    router.push("/dashboard")
  }

  const StepComponent = currentStepData.component

  return (
    <div className="max-w-4xl mx-auto p-6 min-w-[800px]" data-testid="onboarding-wizard">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-blue-600" />
          <Badge variant="secondary">~3 minutes to complete</Badge>
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Go-to-Market Simulator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Let&apos;s set up your account with the key information we need to provide personalized insights and recommendations.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    completedSteps.includes(index)
                      ? "bg-green-500 border-green-500 text-white"
                      : index === currentStep
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-300 bg-gray-50 text-gray-400"
                  }`}
                >
                  {completedSteps.includes(index) ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={`text-sm font-medium ${
                      index <= currentStep ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{step.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 transition-colors ${
                    completedSteps.includes(index) ? "bg-gray-500" : "bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <StepComponent />

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
              data-testid="prev"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>

            <Button
              type={currentStep === steps.length - 1 ? "submit" : "button"}
              onClick={currentStep === steps.length - 1 ? undefined : handleNext}
              className="flex items-center gap-2"
              disabled={formState.isSubmitting}
              data-testid={currentStep === steps.length - 1 ? 'submit' : 'next'}
            >
              {currentStep === steps.length - 1 ? "Complete Setup" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>

      {/* Help Text */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Need help? All settings can be changed later in your dashboard.
        </p>
      </div>
    </div>
  )
}
