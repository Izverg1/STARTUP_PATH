import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Onboarding | STARTUP_PATH Startup Sim",
  description: "Set up your go-to-market simulator",
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="h-full overflow-x-auto overflow-y-hidden">
        {children}
      </div>
    </div>
  )
}