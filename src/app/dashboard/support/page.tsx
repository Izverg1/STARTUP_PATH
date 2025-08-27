'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  HelpCircle, 
  Bot, 
  BookOpen, 
  MessageSquare, 
  ExternalLink,
  Search,
  CheckCircle,
  Clock,
  Zap,
  TrendingUp,
  Target,
  DollarSign,
  BarChart3,
  Lightbulb,
  Video,
  Download,
  Mail
} from 'lucide-react'

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const agentGuides = [
    {
      name: 'Channel Agent',
      icon: '🔍',
      description: 'Channel discovery and recommendation engine',
      status: 'active',
      features: [
        'Discover high-performing channels for your vertical',
        'Test micro-budgets across channels efficiently',
        'Get confidence-scored channel recommendations',
        'Analyze channel performance and gate thresholds'
      ],
      tutorials: [
        { title: 'Setting Up Channel Discovery', duration: '3 min', type: 'video' },
        { title: 'Understanding Channel Scores', duration: '2 min', type: 'guide' },
        { title: 'Channel Testing Best Practices', duration: '5 min', type: 'guide' }
      ]
    },
    {
      name: 'Campaign Agent',
      icon: '✨',
      description: 'Copy generation and A/B testing automation',
      status: 'active',
      features: [
        'Generate copy variants for any channel',
        'Automated A/B testing and performance tracking',
        'Tone-aware copy optimization',
        'Subject line and CTA optimization'
      ],
      tutorials: [
        { title: 'Copy Generation Fundamentals', duration: '4 min', type: 'video' },
        { title: 'A/B Testing Setup', duration: '3 min', type: 'guide' },
        { title: 'Optimizing for Conversion', duration: '6 min', type: 'guide' }
      ]
    },
    {
      name: 'Analytics Agent',
      icon: '📊',
      description: 'Performance monitoring and anomaly detection',
      status: 'active',
      features: [
        'Real-time CPQM, CAC, and LTV calculations',
        'Anomaly detection and trend analysis',
        'Performance forecasting and alerts',
        'Custom metric tracking and reporting'
      ],
      tutorials: [
        { title: 'Understanding Key Metrics', duration: '5 min', type: 'video' },
        { title: 'Setting Alert Thresholds', duration: '2 min', type: 'guide' },
        { title: 'Reading Performance Reports', duration: '4 min', type: 'guide' }
      ]
    },
    {
      name: 'Finance Agent',
      icon: '💰',
      description: 'Budget optimization and allocation strategy',
      status: 'active',
      features: [
        'Thompson Sampling optimization',
        'Automated budget rebalancing',
        'Risk tolerance management',
        'ROI-driven allocation decisions'
      ],
      tutorials: [
        { title: 'Budget Allocation Strategies', duration: '6 min', type: 'video' },
        { title: 'Thompson Sampling Explained', duration: '4 min', type: 'guide' },
        { title: 'Risk Management Settings', duration: '3 min', type: 'guide' }
      ]
    }
  ]

  const faqItems = [
    {
      question: 'How do I start my first project simulation?',
      answer: 'Begin by creating a project in the Projects section, then configure your channels, set up gates (pass/fail thresholds), and let the agents recommend the optimal strategy.',
      category: 'Getting Started'
    },
    {
      question: 'What is CPQM and why is it important?',
      answer: 'Cost Per Qualified Meeting (CPQM) measures the cost to generate a sales-qualified meeting. It\'s crucial for understanding your sales funnel efficiency and optimizing spend.',
      category: 'Metrics'
    },
    {
      question: 'How often do agents update their recommendations?',
      answer: 'Agents run continuously, with Channel Agent checking every 2 hours, Campaign Agent running real-time A/B tests, Analytics Agent monitoring every 5 minutes, and Finance Agent rebalancing weekly.',
      category: 'Agents'
    },
    {
      question: 'Can I export my simulation data?',
      answer: 'Yes, all simulation results, agent insights, and performance metrics can be exported in CSV, JSON, or PDF formats from the Analytics dashboard.',
      category: 'Data Export'
    },
    {
      question: 'How do I set custom success thresholds?',
      answer: 'Navigate to Settings > Performance Thresholds to configure custom CPQM, CAC payback, and conversion rate thresholds that align with your business goals.',
      category: 'Configuration'
    },
    {
      question: 'What happens if a channel fails its gate threshold?',
      answer: 'When a channel fails its gate, Finance Agent automatically reallocates budget to better-performing channels while Channel Agent searches for alternative options.',
      category: 'Optimization'
    }
  ]

  const quickActions = [
    {
      title: 'Schedule Demo Call',
      description: 'Book a 30-minute walkthrough with our team',
      icon: Video,
      action: 'Schedule Now',
      href: 'mailto:support@startuppath.ai?subject=Demo Request'
    },
    {
      title: 'Download User Guide',
      description: 'Complete PDF guide to STARTUP_PATH',
      icon: Download,
      action: 'Download PDF',
      href: '#'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our technical team',
      icon: Mail,
      action: 'Send Email',
      href: 'mailto:support@startuppath.ai'
    }
  ]

  const filteredFAQ = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Help & Support</h1>
            <p className="text-gray-400 mt-1">Learn how to maximize your STARTUP_PATH experience</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="bg-green-600/10 border-green-500/20 hover:bg-green-600/20 text-green-400"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Live Chat
            </Button>
            <Button 
              variant="outline"
              className="bg-blue-600/10 border-blue-500/20 hover:bg-blue-600/20 text-blue-400"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Documentation
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent Documentation */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-600/10 rounded-lg border border-purple-500/20">
                  <Bot className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Agent Documentation</h2>
                  <p className="text-gray-400 text-sm">Learn how each AI agent enhances your GTM strategy</p>
                </div>
              </div>

              <div className="space-y-6">
                {agentGuides.map((agent, index) => (
                  <div key={index} className="border border-slate-700/50 rounded-lg p-4 bg-slate-800/30">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{agent.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{agent.name}</h3>
                            <Badge 
                              variant="outline" 
                              className="text-xs border-green-500/30 text-green-400 bg-green-600/10"
                            >
                              {agent.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">{agent.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Key Features:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {agent.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs">
                            <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tutorials */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Tutorials:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {agent.tutorials.map((tutorial, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            className="justify-start text-xs bg-slate-900/50 border-slate-600 hover:bg-slate-800/50 text-gray-300"
                          >
                            {tutorial.type === 'video' ? (
                              <Video className="w-3 h-3 mr-2 text-blue-400" />
                            ) : (
                              <BookOpen className="w-3 h-3 mr-2 text-cyan-400" />
                            )}
                            <div className="text-left">
                              <div>{tutorial.title}</div>
                              <div className="text-gray-500">{tutorial.duration}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* FAQ Section */}
            <Card className="bg-slate-900/50 border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-cyan-600/10 rounded-lg border border-cyan-500/20">
                  <HelpCircle className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Frequently Asked Questions</h2>
                  <p className="text-gray-400 text-sm">Quick answers to common questions</p>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search FAQ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-4">
                {filteredFAQ.map((item, index) => (
                  <div key={index} className="border border-slate-700/50 rounded-lg p-4 bg-slate-800/30">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-white text-sm">{item.question}</h3>
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-400 ml-2">
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-600/10 rounded-lg border border-orange-500/20">
                  <Zap className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                  <p className="text-gray-400 text-sm">Get help fast</p>
                </div>
              </div>

              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start bg-slate-800/30 border-slate-600 hover:bg-slate-800/50 text-left p-4 h-auto"
                    onClick={() => window.open(action.href, '_blank')}
                  >
                    <action.icon className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-white text-sm">{action.title}</div>
                      <div className="text-gray-400 text-xs">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>

            {/* System Status */}
            <Card className="bg-slate-900/50 border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-600/10 rounded-lg border border-green-500/20">
                  <BarChart3 className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">System Status</h2>
                  <p className="text-gray-400 text-sm">Platform health</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">API Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-sm">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Agent Systems</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-sm">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Database</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-sm">Connected</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Analytics</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-yellow-400 text-sm">Delayed (2min)</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card className="bg-slate-900/50 border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-600/10 rounded-lg border border-yellow-500/20">
                  <Lightbulb className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Pro Tips</h2>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="bg-slate-800/30 p-3 rounded">
                  <p className="text-gray-300">Set realistic gate thresholds based on your industry benchmarks for better agent recommendations.</p>
                </div>
                <div className="bg-slate-800/30 p-3 rounded">
                  <p className="text-gray-300">Let Channel Agent run for 48 hours before making major strategy changes.</p>
                </div>
                <div className="bg-slate-800/30 p-3 rounded">
                  <p className="text-gray-300">Use Campaign Agent's tone settings to match your brand voice across all channels.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
  )
}