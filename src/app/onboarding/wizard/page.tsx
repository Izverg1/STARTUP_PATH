import { Metadata } from "next"
import OnboardingWizard from "@/components/onboarding/OnboardingWizard"

export const metadata: Metadata = {
  title: "Onboarding Wizard | STARTUP_PATH Startup Sim",
  description: "Set up your go-to-market simulator with personalized insights and recommendations",
}

export default function OnboardingWizardPage() {
  return <OnboardingWizard />
}