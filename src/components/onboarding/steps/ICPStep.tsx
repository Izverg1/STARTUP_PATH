"use client"

import { useFormContext } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { OnboardingFormData } from "@/lib/validations/onboarding"

const personas = [
  { value: "founder", label: "Founder/CEO" },
  { value: "sales-leader", label: "Sales Leader" },
  { value: "marketing-leader", label: "Marketing Leader" },
  { value: "revenue-ops", label: "Revenue Operations" },
]

const companySizes = [
  { value: "startup", label: "Startup (1-50)" },
  { value: "growth", label: "Growth (51-200)" },
  { value: "scale", label: "Scale (201-1000)" },
  { value: "enterprise", label: "Enterprise (1000+)" },
]

const geographies = [
  { value: "north-america", label: "North America" },
  { value: "europe", label: "Europe" },
  { value: "asia-pacific", label: "Asia Pacific" },
  { value: "global", label: "Global" },
]

const acvBands = [
  { value: "0-5k", label: "$0 - $5K" },
  { value: "5k-25k", label: "$5K - $25K" },
  { value: "25k-100k", label: "$25K - $100K" },
  { value: "100k-500k", label: "$100K - $500K" },
  { value: "500k+", label: "$500K+" },
]

const salesMotions = [
  { value: "self-serve", label: "Self-Serve" },
  { value: "product-led", label: "Product-Led Growth" },
  { value: "inside-sales", label: "Inside Sales" },
  { value: "field-sales", label: "Field Sales" },
  { value: "partner-led", label: "Partner-Led" },
]

export default function ICPStep() {
  const { control } = useFormContext<OnboardingFormData>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Define Your ICP & Economics</CardTitle>
        <CardDescription>
          Let&apos;s understand your target market and business model to optimize your go-to-market strategy.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="persona"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {personas.map((persona) => (
                      <SelectItem key={persona.value} value={persona.value}>
                        {persona.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="companySize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Size</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="geography"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Geography</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select geography" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {geographies.map((geo) => (
                      <SelectItem key={geo.value} value={geo.value}>
                        {geo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="acvBand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Average Contract Value</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ACV band" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {acvBands.map((band) => (
                      <SelectItem key={band.value} value={band.value}>
                        {band.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="grossMargin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gross Margin (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="85"
                    min="0"
                    max="100"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="salesMotion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Sales Motion</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sales motion" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {salesMotions.map((motion) => (
                      <SelectItem key={motion.value} value={motion.value}>
                        {motion.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}