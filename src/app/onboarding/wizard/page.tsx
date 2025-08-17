import { Metadata } from "next"
import OnboardingWizard from "@/components/onboarding/OnboardingWizard"

export const metadata: Metadata = {
  title: "Onboarding Wizard | SOLGEN Startup Sim",
  description: "Set up your go-to-market simulator with personalized insights and recommendations",
}

export default function OnboardingWizardPage() {
  return <OnboardingWizard />
}