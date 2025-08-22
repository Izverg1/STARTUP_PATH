import { BaseAgent } from './base'
import { 
  Artifact, 
  CopyArtifact, 
  CampaignOptimizationEngineCapability,
  TonePreference,
  CopyVariant 
} from '@/types/agents'

export class CampaignOptimizationEngineAgent extends BaseAgent {
  constructor() {
    const capabilities: CampaignOptimizationEngineCapability[] = [
      {
        name: 'Copy Generation',
        description: 'Generate compelling copy variants for different channels',
        type: 'copy_generation',
        inputs: [
          {
            name: 'channel_type',
            type: 'string',
            required: true,
            description: 'Target channel (email, linkedin, etc.)'
          },
          {
            name: 'copy_type',
            type: 'string',
            required: true,
            description: 'Type of copy (subject_line, body, cta, etc.)'
          },
          {
            name: 'target_audience',
            type: 'string',
            required: true,
            description: 'Description of target audience'
          }
        ],
        outputs: [
          {
            name: 'copy_variants',
            type: 'array',
            description: 'Multiple copy variants with performance predictions'
          }
        ],
        dependencies: ['audience_data', 'channel_best_practices']
      },
      {
        name: 'A/B Test Design',
        description: 'Design statistical A/B tests for copy variants',
        type: 'ab_test_design',
        inputs: [
          {
            name: 'variants',
            type: 'array',
            required: true,
            description: 'Copy variants to test'
          }
        ],
        outputs: [
          {
            name: 'test_design',
            type: 'object',
            description: 'Statistical test design with sample sizes'
          }
        ],
        dependencies: ['statistical_methods']
      }
    ]

    super('campaign_optimization_engine', capabilities)
  }

  protected async performExecution(input?: {
    channel_type?: string
    copy_type?: 'subject_line' | 'body' | 'cta' | 'headline' | 'description'
    target_audience?: string
    tone?: TonePreference
    variant_count?: number
  }): Promise<Artifact[]> {
    const artifacts: Artifact[] = []

    await this.simulateProcessing('Analyzing audience psychology...', 1200)
    
    const copyArtifact = await this.generateCopyVariants(input)
    artifacts.push(copyArtifact)

    await this.simulateProcessing('Designing A/B test framework...', 800)
    
    const testDesign = await this.createTestDesign(copyArtifact)
    artifacts.push(testDesign)

    return artifacts
  }

  private async generateCopyVariants(input?: {
    channel_type?: string
    copy_type?: 'subject_line' | 'body' | 'cta' | 'headline' | 'description'
    target_audience?: string
    tone?: TonePreference
    variant_count?: number
  }): Promise<CopyArtifact> {
    const channelType = input?.channel_type || 'email'
    const copyType = input?.copy_type || 'subject_line'
    const tone = input?.tone || 'professional'
    const variantCount = input?.variant_count || 4

    // Generate copy variants based on type and tone
    const variants = this.createVariantsByType(copyType, tone, variantCount)

    return this.createArtifact(
      'copy',
      `${copyType.charAt(0).toUpperCase() + copyType.slice(1)} Variants - ${channelType}`,
      {
        markdown_body: `## ${copyType.toUpperCase()} Copy Variants\n\n**Channel:** ${channelType}\n**Tone:** ${tone}\n**Target:** ${input?.target_audience || 'B2B Decision Makers'}\n\n### Variants\n\n${variants.map((v, i) => `**Variant ${i + 1}${v.is_control ? ' (Control)' : ''}**\n${v.text}\n*Predicted Performance: ${Math.round((v.performance_prediction || 0) * 100)}%*\n`).join('\n')}`,
        structured_data: {
          channel_type: channelType,
          copy_type: copyType,
          variants,
          target_audience: input?.target_audience || 'B2B Decision Makers',
          tone,
          personalization_fields: this.getPersonalizationFields(copyType),
          compliance_status: 'approved'
        }
      },
      {
        confidence_score: 0.78,
        data_sources: ['copy_performance_data', 'psychological_triggers', 'industry_benchmarks'],
        tags: ['copy', copyType, tone, channelType]
      }
    ) as CopyArtifact
  }

  private createVariantsByType(
    copyType: 'subject_line' | 'body' | 'cta' | 'headline' | 'description',
    tone: TonePreference,
    count: number
  ): CopyVariant[] {
    const templates = this.getCopyTemplates(copyType, tone)
    const variants: CopyVariant[] = []

    for (let i = 0; i < count; i++) {
      const template = templates[i % templates.length]
      variants.push({
        id: `variant-${i + 1}`,
        text: template,
        performance_prediction: Math.random() * 0.3 + 0.15, // 15-45% predicted performance
        ab_test_allocation: count > 1 ? Math.round(100 / count) : 100,
        is_control: i === 0
      })
    }

    return variants
  }

  private getCopyTemplates(
    copyType: 'subject_line' | 'body' | 'cta' | 'headline' | 'description',
    tone: TonePreference
  ): string[] {
    const templates = {
      subject_line: {
        professional: [
          'Quick question about {company}\'s growth strategy',
          'Helping {industry} companies reduce costs by 23%',
          '{first_name}, thought you\'d find this interesting',
          'RE: {company}\'s efficiency initiatives'
        ],
        casual: [
          'Hey {first_name}, got a sec?',
          'This made me think of {company}',
          'Quick favor to ask, {first_name}',
          'Spotted something cool for {industry} folks'
        ],
        urgent: [
          'Time-sensitive: {company} opportunity',
          '{first_name}, deadline approaching',
          'Last chance: {industry} benchmarks inside',
          'Action required: {company}\'s competitive edge'
        ],
        consultative: [
          'Benchmarking {company} against industry leaders',
          'Strategic insights for {company}\'s growth',
          '{first_name}, industry trend analysis attached',
          'Competitive intelligence: {industry} landscape'
        ],
        friendly: [
          'Hope you\'re doing well, {first_name}!',
          'Exciting news for {company}',
          '{first_name}, wanted to share this with you',
          'Good morning {first_name}, quick share'
        ]
      },
      headline: {
        professional: [
          'Increase {metric} by 40% in 90 Days',
          'Industry-Leading {solution} for {industry}',
          'Proven Results: {benefit} for Growing Companies',
          'Transform Your {process} with Data-Driven Insights'
        ],
        casual: [
          'Want to 2x your {metric}?',
          'The simple way to {benefit}',
          'No more {pain_point} headaches',
          'Finally, {solution} that actually works'
        ],
        urgent: [
          'Limited Time: {discount}% Off {solution}',
          'Don\'t Miss Out: {benefit} Opportunity',
          'Act Fast: {scarcity} Remaining',
          'Deadline Approaching: {offer} Expires Soon'
        ],
        consultative: [
          'How {industry} Leaders Achieve {benefit}',
          'The Strategic Approach to {solution}',
          'Expert Analysis: {trend} Impact on {industry}',
          'Research-Backed {solution} for {audience}'
        ],
        friendly: [
          'We\'d love to help you {benefit}',
          'Your success story starts here',
          'Join hundreds of happy {customer_type}',
          'Ready to make {goal} a reality?'
        ]
      },
      cta: {
        professional: [
          'Schedule a Strategic Discussion',
          'Request Industry Benchmarks',
          'Download Executive Summary',
          'Book Consultation Call'
        ],
        casual: [
          'Let\'s chat!',
          'Grab your free copy',
          'See it in action',
          'Try it out'
        ],
        urgent: [
          'Claim Your Spot Now',
          'Get Instant Access',
          'Don\'t Wait - Act Today',
          'Secure Your Discount'
        ],
        consultative: [
          'Explore the Data',
          'Review the Analysis',
          'Access Expert Insights',
          'Get Strategic Guidance'
        ],
        friendly: [
          'Let\'s connect!',
          'I\'d love to help',
          'Happy to share more',
          'Would love to chat'
        ]
      },
      body: {
        professional: [
          'I noticed {company} is focused on {goal}. We\'ve helped similar {industry} companies achieve {benefit} through {solution}. Would you be interested in a brief discussion about how this might apply to {company}?',
          'Based on your recent {activity}, it seems {company} could benefit from {solution}. We\'ve documented case studies showing {metric} improvements. I\'d be happy to share relevant benchmarks.',
          'Given {company}\'s growth in {area}, I wanted to reach out about {solution}. Our {industry} clients typically see {benefit}. Would a 15-minute call make sense?'
        ],
        casual: [
          'Saw your post about {topic} and thought you might like this! We help {audience} with {solution}. Quick chat?',
          'Hey! Working with a lot of {industry} companies lately and {benefit} keeps coming up. Thought {company} might be interested.',
          'Hope things are going well at {company}! We just launched something that might help with {pain_point}. Want to take a look?'
        ],
        urgent: [
          'This week only - we\'re offering {discount} to qualified {industry} companies. Given {company}\'s {characteristic}, you\'d be a perfect fit. Interested?',
          'Deadline is Friday for our {program}. With {company}\'s focus on {goal}, this could be valuable. Can we connect this week?',
          'Limited spots available for our {offer}. Based on {company}\'s {situation}, I didn\'t want you to miss out. Quick call?'
        ],
        consultative: [
          'I\'ve been analyzing {industry} trends and noticed {insight}. This could significantly impact {company}\'s {area}. I\'d appreciate your perspective on this.',
          'Our recent study of {industry} companies revealed {finding}. Given {company}\'s position, I thought you\'d find this interesting. Would you like to see the data?',
          'Working on benchmarking {metric} across {industry}. {company}\'s approach to {area} would provide valuable insights. Could we exchange perspectives?'
        ],
        friendly: [
          'Hope you\'re having a great week! I came across {reference} and thought of {company}. We\'ve been helping similar companies with {solution}. Would love to connect!',
          'Hi {first_name}! Wanted to reach out because we\'ve been getting great results for {industry} companies like {company}. Happy to share what we\'re seeing!',
          'Good {time_of_day}! I know how busy things get at {company}, but wanted to share something that might help with {goal}. Got a few minutes to chat?'
        ]
      },
      description: {
        professional: [
          'Enterprise-grade {solution} designed for {industry} leaders. Proven track record of {benefit} with Fortune 500 companies.',
          'Strategic {solution} platform enabling {audience} to achieve {goal} through data-driven insights and industry best practices.',
          'Comprehensive {solution} suite delivering measurable {benefit} for growing {industry} organizations.'
        ],
        casual: [
          'The easy way to {benefit}. No complicated setup, no lengthy training. Just results.',
          'Simple {solution} that actually works. Join thousands of happy {customer_type} already seeing {benefit}.',
          '{solution} made simple. Get {benefit} without the headache.'
        ],
        urgent: [
          'Limited-time {solution} opportunity. Act now to secure {benefit} before {deadline}.',
          'Exclusive {solution} access for qualified {audience}. Only {number} spots remaining.',
          'Time-sensitive {offer}. Don\'t miss your chance to {benefit}.'
        ],
        consultative: [
          'Research-backed {solution} methodology developed through analysis of {industry} best practices.',
          'Strategic {solution} framework based on extensive {industry} benchmarking and expert insights.',
          'Evidence-based {solution} approach validated by leading {industry} organizations.'
        ],
        friendly: [
          'We love helping {audience} achieve {goal}. Our friendly team is here to support your success every step of the way.',
          'Built by {industry} professionals for {industry} professionals. We understand your challenges and we\'re here to help.',
          'Your success is our mission. Join our community of {customer_type} who are already {benefit}.'
        ]
      }
    }

    return templates[copyType]?.[tone] || templates[copyType]?.professional || []
  }

  private getPersonalizationFields(copyType: string): string[] {
    const commonFields = ['first_name', 'company', 'industry']
    
    const typeSpecificFields = {
      subject_line: ['title', 'department'],
      body: ['recent_activity', 'company_size', 'pain_point'],
      headline: ['goal', 'metric', 'benefit'],
      cta: ['action', 'urgency'],
      description: ['solution', 'audience', 'value_prop']
    }

    return [...commonFields, ...(typeSpecificFields[copyType as keyof typeof typeSpecificFields] || [])]
  }

  private async createTestDesign(copyArtifact: CopyArtifact): Promise<Artifact> {
    const variants = copyArtifact.content.structured_data.variants
    const sampleSizePerVariant = Math.ceil(Math.random() * 500 + 200) // 200-700 per variant

    const testDesign = {
      test_type: 'ab_test',
      variants: variants.length,
      sample_size_per_variant: sampleSizePerVariant,
      total_sample_size: sampleSizePerVariant * variants.length,
      confidence_level: 0.95,
      minimum_detectable_effect: 0.05, // 5% improvement
      statistical_power: 0.8,
      test_duration_days: Math.ceil(Math.random() * 7 + 7), // 7-14 days
      success_metric: 'conversion_rate',
      allocation: variants.map(v => ({
        variant_id: v.id,
        allocation_percent: v.ab_test_allocation,
        is_control: v.is_control
      }))
    }

    return this.createArtifact(
      'calc',
      'A/B Test Design',
      {
        markdown_body: `## A/B Test Design\n\n**Test Type:** ${testDesign.test_type}\n**Variants:** ${testDesign.variants}\n**Sample Size:** ${testDesign.total_sample_size} (${testDesign.sample_size_per_variant} per variant)\n**Duration:** ${testDesign.test_duration_days} days\n**Confidence Level:** ${testDesign.confidence_level * 100}%\n\n### Allocation\n${testDesign.allocation.map(a => `- ${a.variant_id}: ${a.allocation_percent}%${a.is_control ? ' (Control)' : ''}`).join('\n')}`,
        json_data: testDesign,
        structured_data: {
          calculation_type: 'ab_test_design',
          inputs: [
            { name: 'variants', value: variants.length, unit: 'count', source: 'copy_generation' },
            { name: 'confidence_level', value: 0.95, unit: 'probability', source: 'statistical_standards' },
            { name: 'power', value: 0.8, unit: 'probability', source: 'statistical_standards' }
          ],
          formula: 'Sample size = (Z_α/2 + Z_β)² × 2 × p × (1-p) / Δ²',
          result: {
            value: testDesign.total_sample_size,
            unit: 'samples',
            interpretation: 'good'
          },
          assumptions: [
            'Normal distribution of outcomes',
            'Independent observations',
            'Equal variance between groups'
          ]
        }
      },
      {
        confidence_score: 0.91,
        data_sources: ['statistical_methods', 'ab_testing_best_practices'],
        tags: ['ab_test', 'statistical_design', 'copy_testing']
      }
    )
  }

  /**
   * Generate copy for specific channel and type
   */
  public async generateCopy(params: {
    channel_type: string
    copy_type: 'subject_line' | 'body' | 'cta' | 'headline' | 'description'
    target_audience: string
    tone?: TonePreference
    variant_count?: number
  }): Promise<CopyArtifact[]> {
    const artifacts = await this.execute(params)
    return artifacts.filter(a => a.type === 'copy') as CopyArtifact[]
  }

  /**
   * Optimize existing copy based on performance data
   */
  public async optimizeCopy(
    originalCopy: string,
    performanceData: { 
      conversion_rate: number
      engagement_rate: number
      click_rate?: number 
    }
  ): Promise<CopyArtifact> {
    await this.simulateProcessing('Analyzing performance patterns...', 1000)
    
    // Mock optimization logic
    const optimizedVariants: CopyVariant[] = [
      {
        id: 'optimized-1',
        text: originalCopy, // Keep original as control
        performance_prediction: performanceData.conversion_rate,
        ab_test_allocation: 25,
        is_control: true
      },
      {
        id: 'optimized-2', 
        text: this.applyOptimization(originalCopy, 'urgency'),
        performance_prediction: performanceData.conversion_rate * 1.15,
        ab_test_allocation: 25,
        is_control: false
      },
      {
        id: 'optimized-3',
        text: this.applyOptimization(originalCopy, 'personalization'),
        performance_prediction: performanceData.conversion_rate * 1.12,
        ab_test_allocation: 25,
        is_control: false
      },
      {
        id: 'optimized-4',
        text: this.applyOptimization(originalCopy, 'social_proof'),
        performance_prediction: performanceData.conversion_rate * 1.08,
        ab_test_allocation: 25,
        is_control: false
      }
    ]

    return this.createArtifact(
      'copy',
      'Optimized Copy Variants',
      {
        structured_data: {
          channel_type: 'email',
          copy_type: 'subject_line',
          variants: optimizedVariants,
          target_audience: 'B2B Decision Makers',
          tone: 'professional',
          personalization_fields: ['first_name', 'company'],
          compliance_status: 'approved'
        }
      },
      {
        confidence_score: 0.82,
        data_sources: ['performance_data', 'optimization_patterns'],
        tags: ['optimization', 'performance_driven', 'copy']
      }
    ) as CopyArtifact
  }

  private applyOptimization(text: string, strategy: string): string {
    // Simple mock optimization strategies
    switch (strategy) {
      case 'urgency':
        return `[Action Required] ${text}`
      case 'personalization':
        return text.replace(/you/g, '{first_name}')
      case 'social_proof':
        return `${text} (Used by 500+ companies)`
      default:
        return text
    }
  }
}