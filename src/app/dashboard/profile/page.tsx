'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  TrendingUp,
  Activity,
  Zap,
  Edit3,
  Save,
  X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: user?.name || 'Demo User',
    email: user?.email || 'user@startuppath.ai',
    company: 'STARTUP_PATH Demo',
    position: 'Founder & CEO',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    industry: 'SaaS',
    companySize: '10-50 employees',
    yearFounded: '2023',
    website: 'https://iamkarlson.com'
  })

  const handleSave = () => {
    // TODO: Save profile changes
    setIsEditing(false)
  }

  const agentInsights = [
    {
      agent: 'Channel Discovery Engine',
      icon: '🔍',
      insight: 'LinkedIn Sales Navigator shows 92% efficiency for your industry',
      action: 'Optimize channel mix'
    },
    {
      agent: 'Budget Allocation Engine', 
      icon: '💰',
      insight: '$15k budget reallocation could improve CPQM by 23%',
      action: 'Review allocation'
    },
    {
      agent: 'Performance Analytics Engine',
      icon: '📊', 
      insight: 'Conversion rate trending up 8.3% over last 30 days',
      action: 'View analytics'
    },
    {
      agent: 'Campaign Optimization Engine',
      icon: '✨',
      insight: 'New copy variants ready for A/B testing',
      action: 'Review copy'
    }
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            <p className="text-gray-400 mt-1">Manage your account and company information</p>
          </div>
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="bg-blue-600/10 border-blue-500/20 hover:bg-blue-600/20 text-blue-400"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                onClick={handleSave}
                className="bg-green-600/20 border-green-500/30 hover:bg-green-600/30 text-green-400"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button 
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="bg-red-600/10 border-red-500/20 hover:bg-red-600/20 text-red-400"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-600/10 rounded-lg border border-blue-500/20">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                  <p className="text-gray-400 text-sm">Your account details and contact information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  {isEditing ? (
                    <Input 
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  ) : (
                    <p className="text-white bg-slate-800/30 px-3 py-2 rounded-md">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  {isEditing ? (
                    <Input 
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  ) : (
                    <p className="text-white bg-slate-800/30 px-3 py-2 rounded-md">{profile.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  {isEditing ? (
                    <Input 
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  ) : (
                    <p className="text-white bg-slate-800/30 px-3 py-2 rounded-md">{profile.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  {isEditing ? (
                    <Input 
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  ) : (
                    <p className="text-white bg-slate-800/30 px-3 py-2 rounded-md">{profile.location}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Company Information */}
            <Card className="bg-slate-900/50 border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-cyan-600/10 rounded-lg border border-cyan-500/20">
                  <Building2 className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Company Information</h2>
                  <p className="text-gray-400 text-sm">Details about your startup and business</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                  {isEditing ? (
                    <Input 
                      value={profile.company}
                      onChange={(e) => setProfile({...profile, company: e.target.value})}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  ) : (
                    <p className="text-white bg-slate-800/30 px-3 py-2 rounded-md">{profile.company}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                  {isEditing ? (
                    <Input 
                      value={profile.position}
                      onChange={(e) => setProfile({...profile, position: e.target.value})}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  ) : (
                    <p className="text-white bg-slate-800/30 px-3 py-2 rounded-md">{profile.position}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
                  {isEditing ? (
                    <Input 
                      value={profile.industry}
                      onChange={(e) => setProfile({...profile, industry: e.target.value})}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  ) : (
                    <p className="text-white bg-slate-800/30 px-3 py-2 rounded-md">{profile.industry}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company Size</label>
                  {isEditing ? (
                    <Input 
                      value={profile.companySize}
                      onChange={(e) => setProfile({...profile, companySize: e.target.value})}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  ) : (
                    <p className="text-white bg-slate-800/30 px-3 py-2 rounded-md">{profile.companySize}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Year Founded</label>
                  {isEditing ? (
                    <Input 
                      value={profile.yearFounded}
                      onChange={(e) => setProfile({...profile, yearFounded: e.target.value})}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  ) : (
                    <p className="text-white bg-slate-800/30 px-3 py-2 rounded-md">{profile.yearFounded}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                  {isEditing ? (
                    <Input 
                      value={profile.website}
                      onChange={(e) => setProfile({...profile, website: e.target.value})}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  ) : (
                    <p className="text-white bg-slate-800/30 px-3 py-2 rounded-md">{profile.website}</p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Agent Insights Sidebar */}
          <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-600/10 rounded-lg border border-purple-500/20">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Agent Insights</h2>
                  <p className="text-gray-400 text-sm">AI-powered recommendations</p>
                </div>
              </div>

              <div className="space-y-4">
                {agentInsights.map((insight, index) => (
                  <div key={index} className="border border-slate-700/50 rounded-lg p-4 bg-slate-800/30">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{insight.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                            {insight.agent}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-300 mb-3">{insight.insight}</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs bg-blue-600/10 border-blue-500/20 hover:bg-blue-600/20 text-blue-400"
                        >
                          {insight.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-slate-900/50 border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-600/10 rounded-lg border border-green-500/20">
                  <Activity className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Quick Stats</h2>
                  <p className="text-gray-400 text-sm">Your platform usage</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Projects Active</span>
                  <span className="text-white font-medium">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Simulations Run</span>
                  <span className="text-white font-medium">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Agent Insights</span>
                  <span className="text-white font-medium">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">CPQM Improvement</span>
                  <span className="text-green-400 font-medium">+23%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}