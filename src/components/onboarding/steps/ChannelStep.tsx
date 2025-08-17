"use client"

import { useFormContext } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { OnboardingFormData } from "@/lib/validations/onboarding"

const channels = [
  {
    id: "google-search",
    name: "Google Search",
    description: "Paid search campaigns targeting high-intent keywords",
    benchmarks: {
      ctr: "3.2%",
      conversion: "2.8%",
      cac: "$180-$420",
    },
    gates: {
      pass: ["Budget >$5K/month", "Landing page ready", "Keyword research done"],
      fail: ["No search volume", "High competition keywords only"],
    },
  },
  {
    id: "linkedin-inmail",
    name: "LinkedIn InMail",
    description: "Direct outreach to decision makers via LinkedIn",
    benchmarks: {
      openRate: "52%",
      responseRate: "18%",
      cac: "$280-$650",
    },
    gates: {
      pass: ["B2B product", "Decision maker profiles identified", "Personalization strategy"],
      fail: ["B2C product", "No LinkedIn Sales Navigator"],
    },
  },
  {
    id: "webinar",
    name: "Webinar",
    description: "Educational webinars to generate and nurture leads",
    benchmarks: {
      attendance: "35%",
      conversion: "12%",
      cac: "$150-$320",
    },
    gates: {
      pass: ["Subject matter expertise", "Presentation ready", "Follow-up sequence"],
      fail: ["No expertise to share", "No presentation skills"],
    },
  },
]

export default function ChannelStep() {
  const { control, watch } = useFormContext<OnboardingFormData>()
  const selectedChannels = watch("channels") || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Channels</CardTitle>
        <CardDescription>
          Choose the marketing channels that best fit your ICP and business model. We&apos;ve pre-filled pass/fail gates based on industry benchmarks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="channels"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Available Channels</FormLabel>
              <div className="grid gap-4 mt-4">
                {channels.map((channel) => (
                  <FormField
                    key={channel.id}
                    control={control}
                    name="channels"
                    render={({ field }) => {
                      return (
                        <FormItem key={channel.id}>
                          <div className="border rounded-lg p-4 hover:bg-gray-50/50 transition-colors">
                            <div className="flex items-start space-x-3">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(channel.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, channel.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== channel.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <FormLabel className="text-base font-semibold cursor-pointer">
                                    {channel.name}
                                  </FormLabel>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {channel.description}
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                  <div>
                                    <h4 className="font-medium text-sm mb-2">Benchmarks</h4>
                                    <div className="space-y-1">
                                      {Object.entries(channel.benchmarks).map(([key, value]) => (
                                        <div key={key} className="flex justify-between text-xs">
                                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                          <span className="font-medium">{value}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium text-sm mb-2">Pass Gates</h4>
                                    <div className="flex flex-wrap gap-1">
                                      {channel.gates.pass.map((gate, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          ✓ {gate}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium text-sm mb-2">Fail Gates</h4>
                                    <div className="flex flex-wrap gap-1">
                                      {channel.gates.fail.map((gate, index) => (
                                        <Badge key={index} variant="destructive" className="text-xs">
                                          ✗ {gate}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedChannels.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Selected Channels</h4>
            <div className="flex flex-wrap gap-2">
              {selectedChannels.map((channelId) => {
                const channel = channels.find(c => c.id === channelId)
                return channel ? (
                  <Badge key={channelId} variant="default">
                    {channel.name}
                  </Badge>
                ) : null
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}