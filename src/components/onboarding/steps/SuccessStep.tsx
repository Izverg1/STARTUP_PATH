"use client"

import { useFormContext } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { OnboardingFormData } from "@/lib/validations/onboarding"

export default function SuccessStep() {
  const { control, watch } = useFormContext<OnboardingFormData>()
  const acvBand = watch("acvBand")
  const salesMotion = watch("salesMotion")
  const cacPaybackWindow = watch("cacPaybackWindow")
  const cpqmTarget = watch("cpqmTarget")

  // Calculate recommended values based on ACV and sales motion
  const getRecommendedCAC = () => {
    if (!acvBand) return null
    
    const acvValues = {
      "0-5k": 2500,
      "5k-25k": 15000,
      "25k-100k": 62500,
      "100k-500k": 300000,
      "500k+": 750000,
    }
    
    const baseACV = acvValues[acvBand as keyof typeof acvValues] || 15000
    
    // CAC should typically be 20-33% of ACV for healthy payback
    const recommendedCAC = Math.round(baseACV * 0.25)
    return recommendedCAC
  }

  const getRecommendedPayback = () => {
    if (!salesMotion) return null
    
    const paybackPeriods = {
      "self-serve": 6,
      "product-led": 8,
      "inside-sales": 12,
      "field-sales": 18,
      "partner-led": 15,
    }
    
    return paybackPeriods[salesMotion as keyof typeof paybackPeriods] || 12
  }

  const recommendedCAC = getRecommendedCAC()
  const recommendedPayback = getRecommendedPayback()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Define Success Metrics</CardTitle>
        <CardDescription>
          Set your target metrics to measure marketing effectiveness and ROI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="cacPaybackWindow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CAC Payback Window (months)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="12"
                    min="1"
                    max="36"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormDescription>
                  How long should it take to recover customer acquisition costs?
                </FormDescription>
                {recommendedPayback && (
                  <div className="mt-2">
                    <Badge variant="secondary">
                      Recommended for {salesMotion?.replace('-', ' ')}: {recommendedPayback} months
                    </Badge>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="cpqmTarget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPQM Target ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="250"
                    min="0"
                    step="10"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Cost Per Qualified Meeting - your target cost for generating qualified sales meetings
                </FormDescription>
                {recommendedCAC && (
                  <div className="mt-2">
                    <Badge variant="secondary">
                      Suggested based on {acvBand} ACV: ${Math.round(recommendedCAC * 0.1)} - ${Math.round(recommendedCAC * 0.2)}
                    </Badge>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {(cacPaybackWindow && cpqmTarget && recommendedCAC) && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-3">Projected Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">
                  ${Math.round(cpqmTarget * 4).toLocaleString()}
                </div>
                <div className="text-green-600">Estimated CAC</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Assuming 25% meeting → customer conversion
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">
                  {cacPaybackWindow}
                </div>
                <div className="text-green-600">Months to Payback</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Based on your target window
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">
                  {Math.round((recommendedCAC / (cpqmTarget * 4)) * 100)}%
                </div>
                <div className="text-green-600">Efficiency vs. Benchmark</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Higher is better
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}