'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/contexts/AuthContext'
import { OrganizationSetup } from '@/components/onboarding/OrganizationSetup'
import { 
  User, 
  Building2, 
  Settings, 
  Bell, 
  Shield, 
  Database,
  AlertTriangle,
  Save,
  RefreshCw,
  Building,
  Loader2,
  CheckCircle,
  AlertCircle,
  Zap,
  TrendingUp,
  Activity,
  Edit3,
  X
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  getUserProfile, 
  updateUserProfile, 
  updateOrganization,
  getOrganizationUsers
} from '@/lib/db/client-queries'

interface UserSettings {
  name: string
  email: string
  avatar_url?: string
  timezone: string
  currency: string
  phone: string
  location: string
  position: string
  industry: string
  website: string
  email_notifications: boolean
  push_notifications: boolean
  weekly_reports: boolean
}

interface OrganizationSettings {
  id: string
  name: string
  domain?: string
  subscription_tier: string
  companySize: string
  yearFounded: string
  settings: {
    timezone: string
    currency: string
    fiscal_year_start: string
    notification_preferences: {
      email_enabled: boolean
      slack_webhook_url?: string
      notification_triggers: string[]
    }
    security_settings: {
      sso_enabled: boolean
      mfa_required: boolean
      session_timeout_hours: number
      allowed_domains: string[]
    }
  }
}

interface PerformanceThresholds {
  cpqm_threshold: number
  cac_payback_threshold: number
  conversion_rate_threshold: number
  notification_level: string
}

export default function AccountPage() {
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  
  // Support URL parameters for tab navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get('tab')
    if (tabParam && ['personal', 'organization', 'preferences', 'security'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [])
  
  // Settings state
  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: '',
    email: '',
    timezone: 'America/New_York',
    currency: 'USD',
    phone: '',
    location: '',
    position: '',
    industry: '',
    website: '',
    email_notifications: true,
    push_notifications: true,
    weekly_reports: true
  })
  
  const [orgSettings, setOrgSettings] = useState<OrganizationSettings>({
    id: '',
    name: '',
    subscription_tier: 'demo',
    companySize: '',
    yearFounded: '',
    settings: {
      timezone: 'America/New_York',
      currency: 'USD',
      fiscal_year_start: '2024-01-01',
      notification_preferences: {
        email_enabled: true,
        slack_webhook_url: undefined,
        notification_triggers: ['experiment_completed', 'gate_failed']
      },
      security_settings: {
        sso_enabled: false,
        mfa_required: false,
        session_timeout_hours: 24,
        allowed_domains: []
      }
    }
  })

  const [performanceSettings, setPerformanceSettings] = useState<PerformanceThresholds>({
    cpqm_threshold: 200,
    cac_payback_threshold: 12,
    conversion_rate_threshold: 0.03,
    notification_level: 'important'
  })

  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [hasChanges, setHasChanges] = useState(false)

  // Agent insights data
  const agentInsights = [
    {
      agent: 'Channel Agent',
      icon: '🔍',
      insight: 'LinkedIn Sales Navigator shows 92% efficiency for your industry',
      action: 'Optimize channel mix'
    },
    {
      agent: 'Finance Agent', 
      icon: '💰',
      insight: '$15k budget reallocation could improve CPQM by 23%',
      action: 'Review allocation'
    },
    {
      agent: 'Analytics Agent',
      icon: '📊', 
      insight: 'Conversion rate trending up 8.3% over last 30 days',
      action: 'View analytics'
    },
    {
      agent: 'Campaign Agent',
      icon: '✨',
      insight: 'New copy variants ready for A/B testing',
      action: 'Review copy'
    }
  ]

  // Load user and organization data
  useEffect(() => {
    const loadSettings = async () => {
      if (!user || !isAuthenticated) return

      try {
        setLoading(true)
        
        // Load user profile with organization data
        const userProfile = await getUserProfile(user.id)
        if (userProfile) {
          // Extract personal settings from organization settings or use defaults
          const personalSettings = userProfile.SPATH_organizations?.settings?.personal_settings || {}
          
          setUserSettings({
            name: userProfile.name,
            email: userProfile.email,
            avatar_url: userProfile.avatar_url || undefined,
            timezone: userProfile.SPATH_organizations?.settings?.timezone || 'America/New_York',
            currency: userProfile.SPATH_organizations?.settings?.currency || 'USD',
            phone: personalSettings.phone || '',
            location: personalSettings.location || '',
            position: personalSettings.position || '',
            industry: personalSettings.industry || '',
            website: personalSettings.website || '',
            email_notifications: personalSettings.email_notifications !== false, // Default true
            push_notifications: personalSettings.push_notifications !== false, // Default true  
            weekly_reports: personalSettings.weekly_reports !== false // Default true
          })

          // Set organization settings
          if (userProfile.SPATH_organizations) {
            const orgData = userProfile.SPATH_organizations.settings || {}
            
            setOrgSettings({
              id: userProfile.SPATH_organizations.id,
              name: userProfile.SPATH_organizations.name,
              domain: userProfile.SPATH_organizations.domain || undefined,
              subscription_tier: userProfile.SPATH_organizations.subscription_tier,
              companySize: orgData.company_size || '',
              yearFounded: orgData.year_founded || '',
              settings: userProfile.SPATH_organizations.settings || {
                timezone: 'America/New_York',
                currency: 'USD', 
                fiscal_year_start: 'January',
                notification_preferences: {
                  email_enabled: true,
                  slack_webhook_url: undefined,
                  notification_triggers: []
                },
                security_settings: {
                  sso_enabled: false,
                  mfa_required: false,
                  session_timeout_hours: 8,
                  allowed_domains: []
                }
              }
            })
          }

          // Load team members
          if (userProfile.SPATH_organizations?.id) {
            const members = await getOrganizationUsers(userProfile.SPATH_organizations.id)
            setTeamMembers(members)
          }

          // Load performance settings from localStorage
          const savedPreferences = localStorage.getItem(`performance_settings_${userProfile.id}`)
          if (savedPreferences) {
            try {
              const preferences = JSON.parse(savedPreferences)
              setPerformanceSettings(preferences.performance_thresholds)
            } catch (error) {
              console.error('Error parsing saved performance settings:', error)
            }
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error)
        console.error('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [user, isAuthenticated])

  const handleSaveUserSettings = async () => {
    if (!user || !orgSettings.id) return

    try {
      setSaving(true)
      
      // Update user name
      await updateUserProfile(user.id, {
        name: userSettings.name
      })

      // Store personal information and preferences in organization settings
      const updatedOrgSettings = {
        ...orgSettings.settings,
        personal_settings: {
          phone: userSettings.phone,
          location: userSettings.location,
          position: userSettings.position,
          industry: userSettings.industry,
          website: userSettings.website,
          email_notifications: userSettings.email_notifications,
          push_notifications: userSettings.push_notifications,
          weekly_reports: userSettings.weekly_reports
        },
        timezone: userSettings.timezone,
        currency: userSettings.currency
      }

      await updateOrganization(orgSettings.id, {
        settings: updatedOrgSettings
      })

      setHasChanges(false)
      setIsEditing(false)
      alert('Profile settings saved successfully')
    } catch (error) {
      console.error('Error saving user settings:', error)
      alert('Failed to save profile settings')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveOrgSettings = async () => {
    if (!user || !orgSettings.id) {
      alert('Unable to save organization settings - missing user or organization')
      return
    }

    try {
      setSaving(true)
      
      const updates = {
        name: orgSettings.name,
        domain: orgSettings.domain || null,
        settings: {
          ...orgSettings.settings,
          timezone: orgSettings.settings.timezone,
          currency: orgSettings.settings.currency,
          fiscal_year_start: orgSettings.settings.fiscal_year_start,
          company_size: orgSettings.companySize,
          year_founded: orgSettings.yearFounded,
          notification_preferences: orgSettings.settings.notification_preferences,
          security_settings: orgSettings.settings.security_settings
        }
      }

      const updatedOrg = await updateOrganization(orgSettings.id, updates)
      
      if (updatedOrg) {
        setHasChanges(false)
        alert('Organization settings saved successfully')
      } else {
        alert('Failed to save organization settings')
      }
    } catch (error) {
      console.error('Error saving organization settings:', error)
      alert('Failed to save organization settings')
    } finally {
      setSaving(false)
    }
  }

  const handleSavePerformanceSettings = async () => {
    if (!user) {
      alert('Unable to save performance settings - user not found')
      return
    }

    try {
      setSaving(true)
      
      // Store performance settings in localStorage for now
      // In a production app, these could be stored in a user_preferences table
      const userPreferences = {
        performance_thresholds: performanceSettings,
        updated_at: new Date().toISOString()
      }
      
      localStorage.setItem(`performance_settings_${user.id}`, JSON.stringify(userPreferences))
      
      setHasChanges(false)
      alert('Performance settings saved successfully')
    } catch (error) {
      console.error('Error saving performance settings:', error)
      alert('Failed to save performance settings')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (section: string, field: string, value: any) => {
    setHasChanges(true)
    
    if (section === 'user') {
      setUserSettings(prev => ({ ...prev, [field]: value }))
    } else if (section === 'org') {
      setOrgSettings(prev => ({ ...prev, [field]: value }))
    } else if (section === 'performance') {
      setPerformanceSettings(prev => ({ ...prev, [field]: value }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading account...
        </div>
      </div>
    )
  }

  return (
    <div className="settings-scrollbar red-scrollbar h-screen overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Account</h1>
          <p className="text-gray-400 mt-1">Manage your personal and organization settings</p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400">Unsaved changes</span>
            </div>
          )}
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
                onClick={handleSaveUserSettings}
                disabled={saving}
                className="bg-green-600/20 border-green-500/30 hover:bg-green-600/30 text-green-400"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
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
      </div>

      {/* Quick Stats - Moved to top and made smaller */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">3</div>
          <div className="text-xs text-gray-400">Projects Active</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">47</div>
          <div className="text-xs text-gray-400">Simulations Run</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">156</div>
          <div className="text-xs text-gray-400">Agent Insights</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">+23%</div>
          <div className="text-xs text-gray-400">CPQM Improvement</div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 border border-slate-700/50">
          <TabsTrigger 
            value="personal" 
            className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400"
          >
            <User className="w-4 h-4 mr-2" />
            Personal
          </TabsTrigger>
          <TabsTrigger 
            value="organization" 
            className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-400"
          >
            <Building className="w-4 h-4 mr-2" />
            Organization
          </TabsTrigger>
          <TabsTrigger 
            value="preferences" 
            className="data-[state=active]:bg-orange-600/20 data-[state=active]:text-orange-400"
          >
            <Settings className="w-4 h-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400"
          >
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                        value={userSettings.name}
                        onChange={(e) => handleInputChange('user', 'name', e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    ) : (
                      <p className="text-white bg-slate-800/30 px-3 py-2 rounded-md">{userSettings.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <p className="text-white bg-slate-800/30 px-3 py-2 rounded-md">{userSettings.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                    {isEditing ? (
                      <Input 
                        value={userSettings.phone}
                        onChange={(e) => handleInputChange('user', 'phone', e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    ) : (
                      <p className="text-white bg-slate-800/30 px-3 py-2 rounded-md">{userSettings.phone || 'Not set'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    {isEditing ? (
                      <Input 
                        value={userSettings.location}
                        onChange={(e) => handleInputChange('user', 'location', e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    ) : (
                      <p className="text-white bg-slate-800/30 px-3 py-2 rounded-md">{userSettings.location || 'Not set'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                    {isEditing ? (
                      <Input 
                        value={userSettings.position}
                        onChange={(e) => handleInputChange('user', 'position', e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    ) : (
                      <p className="text-white bg-slate-800/30 px-3 py-2 rounded-md">{userSettings.position || 'Not set'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
                    {isEditing ? (
                      <Input 
                        value={userSettings.industry}
                        onChange={(e) => handleInputChange('user', 'industry', e.target.value)}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    ) : (
                      <p className="text-white bg-slate-800/30 px-3 py-2 rounded-md">{userSettings.industry || 'Not set'}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                  {isEditing ? (
                    <Input 
                      value={userSettings.website}
                      onChange={(e) => handleInputChange('user', 'website', e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  ) : (
                    <p className="text-white bg-slate-800/30 px-3 py-2 rounded-md">{userSettings.website || 'Not set'}</p>
                  )}
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
            </div>
          </div>
        </TabsContent>

        {/* Organization Settings */}
        <TabsContent value="organization" className="space-y-6">
          {!orgSettings.id ? (
            <OrganizationSetup 
              onOrganizationCreated={() => {
                // Reload settings after organization is created
                window.location.reload()
              }} 
            />
          ) : (
            <Card className="bg-slate-900/50 border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-600/10 rounded-lg border border-purple-500/20">
                  <Building2 className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Organization Settings</h2>
                  <p className="text-gray-400 text-sm">Manage your organization information and preferences</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Organization Name</label>
                    <Input 
                      value={orgSettings.name}
                      onChange={(e) => handleInputChange('org', 'name', e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Domain</label>
                    <Input 
                      value={orgSettings.domain || ''}
                      onChange={(e) => handleInputChange('org', 'domain', e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                      placeholder="company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Company Size</label>
                    <Input 
                      value={orgSettings.companySize}
                      onChange={(e) => handleInputChange('org', 'companySize', e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                      placeholder="1-10 employees"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Year Founded</label>
                    <Input 
                      value={orgSettings.yearFounded}
                      onChange={(e) => handleInputChange('org', 'yearFounded', e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                      placeholder="2023"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Subscription Plan</label>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`${
                          orgSettings.subscription_tier === 'demo' 
                            ? 'border-gray-500 text-gray-400 bg-gray-600/10'
                            : orgSettings.subscription_tier === 'starter'
                            ? 'border-blue-500 text-blue-400 bg-blue-600/10'
                            : orgSettings.subscription_tier === 'growth'
                            ? 'border-purple-500 text-purple-400 bg-purple-600/10'
                            : 'border-yellow-500 text-yellow-400 bg-yellow-600/10'
                        }`}
                      >
                        {orgSettings.subscription_tier.charAt(0).toUpperCase() + orgSettings.subscription_tier.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div className="pt-6 border-t border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Team Members ({teamMembers.length})</h3>
                  <div className="space-y-3">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{member.name}</p>
                            <p className="text-xs text-gray-400">{member.email}</p>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            member.role === 'owner' 
                              ? 'border-yellow-500/30 text-yellow-400 bg-yellow-600/10' 
                              : member.role === 'admin'
                              ? 'border-purple-500/30 text-purple-400 bg-purple-600/10'
                              : 'border-blue-500/30 text-blue-400 bg-blue-600/10'
                          }`}
                        >
                          {member.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleSaveOrgSettings}
                  disabled={saving}
                  className="bg-purple-600/20 border-purple-500/30 hover:bg-purple-600/30 text-purple-400"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Organization
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          {/* Notification Preferences */}
          <Card className="bg-slate-900/50 border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-600/10 rounded-lg border border-orange-500/20">
                <Bell className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>
                <p className="text-gray-400 text-sm">Configure how and when you receive notifications</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time Zone</label>
                <Select 
                  value={userSettings.timezone}
                  onValueChange={(value) => handleInputChange('user', 'timezone', value)}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (EST/EDT)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CST/CDT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MST/MDT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PST/PDT)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Currency</label>
                <Select 
                  value={userSettings.currency}
                  onValueChange={(value) => handleInputChange('user', 'currency', value)}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Email Notifications</p>
                  <p className="text-xs text-gray-400">Receive alerts and updates via email</p>
                </div>
                <Switch
                  checked={userSettings.email_notifications}
                  onCheckedChange={(checked) => handleInputChange('user', 'email_notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Push Notifications</p>
                  <p className="text-xs text-gray-400">Browser notifications for real-time alerts</p>
                </div>
                <Switch
                  checked={userSettings.push_notifications}
                  onCheckedChange={(checked) => handleInputChange('user', 'push_notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Weekly Reports</p>
                  <p className="text-xs text-gray-400">Weekly performance summaries</p>
                </div>
                <Switch
                  checked={userSettings.weekly_reports}
                  onCheckedChange={(checked) => handleInputChange('user', 'weekly_reports', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Performance Thresholds */}
          <Card className="bg-slate-900/50 border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-600/10 rounded-lg border border-yellow-500/20">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Performance Thresholds</h2>
                <p className="text-gray-400 text-sm">Configure alert thresholds and automation triggers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">CPQM Alert Threshold</label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number"
                    value={performanceSettings.cpqm_threshold}
                    onChange={(e) => handleInputChange('performance', 'cpqm_threshold', Number(e.target.value))}
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                  <span className="text-gray-400 text-sm">USD</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Alert when cost per qualified meeting exceeds this amount</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">CAC Payback Threshold</label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number"
                    value={performanceSettings.cac_payback_threshold}
                    onChange={(e) => handleInputChange('performance', 'cac_payback_threshold', Number(e.target.value))}
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                  <span className="text-gray-400 text-sm">months</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Alert when payback period exceeds this duration</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Min Conversion Rate</label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number"
                    step="0.001"
                    value={performanceSettings.conversion_rate_threshold}
                    onChange={(e) => handleInputChange('performance', 'conversion_rate_threshold', Number(e.target.value))}
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                  <span className="text-gray-400 text-sm">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Alert when conversion rate falls below this percentage</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Notification Level</label>
                <Select 
                  value={performanceSettings.notification_level}
                  onValueChange={(value) => handleInputChange('performance', 'notification_level', value)}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Alerts</SelectItem>
                    <SelectItem value="important">Important Only</SelectItem>
                    <SelectItem value="critical">Critical Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleSavePerformanceSettings}
                disabled={saving}
                className="bg-orange-600/20 border-orange-500/30 hover:bg-orange-600/30 text-orange-400"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-600/10 rounded-lg border border-green-500/20">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Security & Privacy</h2>
                <p className="text-gray-400 text-sm">Manage your account security and data privacy settings</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div>
                    <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-400">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={orgSettings.settings?.security_settings?.mfa_required || false}
                    onCheckedChange={(checked) => {
                      const newSettings = { ...orgSettings }
                      if (!newSettings.settings) newSettings.settings = orgSettings.settings || { timezone: 'America/New_York', currency: 'USD', fiscal_year_start: '2024-01-01', notification_preferences: { email_enabled: true, notification_triggers: [] }, security_settings: { sso_enabled: false, mfa_required: false, session_timeout_hours: 24, allowed_domains: [] } }
                      if (!newSettings.settings.security_settings) newSettings.settings.security_settings = { sso_enabled: false, mfa_required: false, session_timeout_hours: 24, allowed_domains: [] }
                      newSettings.settings.security_settings.mfa_required = checked
                      setOrgSettings(newSettings)
                      setHasChanges(true)
                    }}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div>
                    <p className="text-sm font-medium text-white">Single Sign-On (SSO)</p>
                    <p className="text-xs text-gray-400">Enable enterprise SSO authentication</p>
                  </div>
                  <Switch
                    checked={orgSettings.settings?.security_settings?.sso_enabled || false}
                    onCheckedChange={(checked) => {
                      const newSettings = { ...orgSettings }
                      if (!newSettings.settings) newSettings.settings = orgSettings.settings || { timezone: 'America/New_York', currency: 'USD', fiscal_year_start: '2024-01-01', notification_preferences: { email_enabled: true, notification_triggers: [] }, security_settings: { sso_enabled: false, mfa_required: false, session_timeout_hours: 24, allowed_domains: [] } }
                      if (!newSettings.settings.security_settings) newSettings.settings.security_settings = { sso_enabled: false, mfa_required: false, session_timeout_hours: 24, allowed_domains: [] }
                      newSettings.settings.security_settings.sso_enabled = checked
                      setOrgSettings(newSettings)
                      setHasChanges(true)
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Session Timeout</label>
                <Select 
                  value={orgSettings.settings?.security_settings?.session_timeout_hours?.toString() || '24'}
                  onValueChange={(value) => {
                    const newSettings = { ...orgSettings }
                    if (!newSettings.settings) newSettings.settings = orgSettings.settings || { timezone: 'America/New_York', currency: 'USD', fiscal_year_start: '2024-01-01', notification_preferences: { email_enabled: true, notification_triggers: [] }, security_settings: { sso_enabled: false, mfa_required: false, session_timeout_hours: 24, allowed_domains: [] } }
                    if (!newSettings.settings.security_settings) newSettings.settings.security_settings = { sso_enabled: false, mfa_required: false, session_timeout_hours: 24, allowed_domains: [] }
                    newSettings.settings.security_settings.session_timeout_hours = Number(value)
                    setOrgSettings(newSettings)
                    setHasChanges(true)
                  }}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="8">8 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="168">7 days</SelectItem>
                    <SelectItem value="720">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Data Management */}
              <div className="pt-6 border-t border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Data Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline"
                    className="justify-start bg-blue-600/10 border-blue-500/20 hover:bg-blue-600/20 text-blue-400"
                    onClick={() => alert('Export data functionality - coming soon')}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="justify-start bg-orange-600/10 border-orange-500/20 hover:bg-orange-600/20 text-orange-400"
                    onClick={() => alert('Clear cache functionality - coming soon')}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear Cache
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleSaveOrgSettings}
                disabled={saving}
                className="bg-green-600/20 border-green-500/30 hover:bg-green-600/30 text-green-400"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Security Settings
                  </>
                )}
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-slate-700/50">
        <div className="text-center text-gray-500 text-sm">
          <p>STARTUP_PATH™ Platform Account</p>
          <p className="mt-2">© 2024 Karlson LLC. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
