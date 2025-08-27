import { z } from "zod"

export const onboardingSchema = z.object({
  // ICP Step
  persona: z.string().min(1, "Please select a persona"),
  companySize: z.string().min(1, "Please select company size"),
  geography: z.string().min(1, "Please select geography"),
  acvBand: z.string().min(1, "Please select ACV band"),
  grossMargin: z.number().min(0).max(100, "Gross margin must be between 0 and 100"),
  salesMotion: z.string().min(1, "Please select a sales motion"),

  // Channel Step
  channels: z.array(z.string()).min(1, "Please select at least one channel"),

  // Success Step
  cacPaybackWindow: z.number().min(1, "CAC payback window must be at least 1 month"),
  cpqmTarget: z.number().min(0, "CPQM target must be positive"),

  // Mode Step
  mode: z.enum(["simulation", "connected"], {
    message: "Please select a mode",
  }),
})

export type OnboardingFormData = z.infer<typeof onboardingSchema>

export const stepSchemas = {
  icp: onboardingSchema.pick({
    persona: true,
    companySize: true,
    geography: true,
    acvBand: true,
    grossMargin: true,
    salesMotion: true,
  }),
  channel: onboardingSchema.pick({
    channels: true,
  }),
  success: onboardingSchema.pick({
    cacPaybackWindow: true,
    cpqmTarget: true,
  }),
  mode: onboardingSchema.pick({
    mode: true,
  }),
}