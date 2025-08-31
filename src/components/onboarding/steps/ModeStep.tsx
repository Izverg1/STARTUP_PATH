"use client"

import { useFormContext } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Zap, Database, BarChart3, Settings } from "lucide-react"
import type { OnboardingFormData } from "@/lib/validations/onboarding"

const modes = [
  {
    value: "simulation",
    title: "Simulation Mode",
    description: "Get started quickly with synthetic data and benchmarks",
    icon: Zap,
    features: [
      "Instant setup - no integrations needed",
      "Industry benchmark data",
      "Synthetic performance scenarios",
      "Best practice recommendations",
      "Risk-free experimentation",
    ],
    ideal: "Perfect for getting started, testing strategies, or when you don't have access to live data yet.",
    badge: "Recommended",
    badgeVariant: "default" as const,
  },
  {
    value: "connected",
    title: "Connected Mode",
    description: "Connect your actual tools and data for real-time insights",
    icon: Database,
    features: [
      "Live data from your CRM, ads, and analytics",
      "Real-time performance tracking",
      "Actual ROI calculations",
      "Integration with 50+ tools",
      "Historical data analysis",
    ],
    ideal: "Best when you have existing marketing tools and want to optimize based on real performance data.",
    badge: "Advanced",
    badgeVariant: "secondary" as const,
  },
]

export default function ModeStep() {
  const { control, watch } = useFormContext<OnboardingFormData>()
  const selectedMode = watch("mode")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Your Mode</CardTitle>
        <CardDescription>
          Select how you want to run your go-to-market simulations and experiments.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="mode"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid gap-4"
                >
                  {modes.map((mode) => {
                    const Icon = mode.icon
                    return (
                      <div
                        key={mode.value}
                        className={`relative rounded-lg border p-6 cursor-pointer transition-all hover:bg-gray-50/50 ${
                          selectedMode === mode.value
                            ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20"
                            : "border-gray-200"
                        }`}
                      >
                        <FormItem className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={mode.value} className="mt-1" data-testid={`mode-${mode.value}`} />
                          </FormControl>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Icon className="h-5 w-5 text-gray-600" />
                              <FormLabel className="text-lg font-semibold cursor-pointer">
                                {mode.title}
                              </FormLabel>
                              <Badge variant={mode.badgeVariant}>{mode.badge}</Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4">
                              {mode.description}
                            </p>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  Features
                                </h4>
                                <ul className="space-y-2">
                                  {mode.features.map((feature, index) => (
                                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                                  <BarChart3 className="h-4 w-4 text-blue-600" />
                                  Ideal For
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {mode.ideal}
                                </p>
                              </div>
                            </div>
                          </div>
                        </FormItem>
                      </div>
                    )
                  })}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedMode && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              {selectedMode === "simulation" ? (
                <Zap className="h-4 w-4 text-blue-600" />
              ) : (
                <Database className="h-4 w-4 text-blue-600" />
              )}
              <h4 className="font-semibold text-blue-900">
                {selectedMode === "simulation" ? "Simulation Mode" : "Connected Mode"} Selected
              </h4>
            </div>
            <p className="text-sm text-blue-700">
              {selectedMode === "simulation"
                ? "You'll start with industry benchmarks and synthetic data. You can always upgrade to Connected Mode later."
                : "We'll help you connect your tools in the next step. This may take a few minutes to set up."}
            </p>
            {selectedMode === "connected" && (
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                <Settings className="h-3 w-3" />
                <span>Supported integrations: HubSpot, Salesforce, Google Ads, LinkedIn Ads, and 40+ more</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
