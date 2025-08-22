import { BaseAgent } from './base'
import { 
  Artifact, 
  CalcArtifact, 
  PerformanceAnalyticsEngineCapability 
} from '@/types/agents'

export class PerformanceAnalyticsEngineAgent extends BaseAgent {
  constructor() {
    const capabilities: PerformanceAnalyticsEngineCapability[] = [
      {
        name: 'Metric Calculation',
        description: 'Calculate key performance metrics (CPQM, CAC, LTV, etc.)',
        type: 'metric_calculation',
        inputs: [
          {
            name: 'data_points',
            type: 'array',
            required: true,
            description: 'Raw performance data points'
          },
          {
            name: 'metric_type',
            type: 'string',
            required: true,
            description: 'Type of metric to calculate'
          }
        ],
        outputs: [
          {
            name: 'calculated_metrics',
            type: 'object',
            description: 'Calculated metrics with confidence intervals'
          }
        ],
        dependencies: ['performance_data', 'statistical_methods']
      },
      {
        name: 'Anomaly Detection',
        description: 'Detect statistical anomalies in performance data',
        type: 'anomaly_detection',
        inputs: [
          {
            name: 'time_series_data',
            type: 'array',
            required: true,
            description: 'Time series performance data'
          }
        ],
        outputs: [
          {
            name: 'anomalies',
            type: 'array',
            description: 'Detected anomalies with severity levels'
          }
        ],
        dependencies: ['time_series_analysis']
      },
      {
        name: 'Forecasting',
        description: 'Generate performance forecasts based on historical data',
        type: 'forecasting',
        inputs: [
          {
            name: 'historical_data',
            type: 'array',
            required: true,
            description: 'Historical performance data'
          },
          {
            name: 'forecast_horizon',
            type: 'number',
            required: true,
            description: 'Number of periods to forecast'
          }
        ],
        outputs: [
          {
            name: 'forecast',
            type: 'object',
            description: 'Forecast values with prediction intervals'
          }
        ],
        dependencies: ['forecasting_models']
      }
    ]

    super('performance_analytics_engine', capabilities)
  }

  protected async performExecution(input?: {
    data_points?: any[]
    metric_type?: 'cpqm' | 'cac' | 'ltv' | 'roi' | 'mer'
    time_period?: string
    channel_filter?: string
  }): Promise<Artifact[]> {
    const artifacts: Artifact[] = []

    await this.simulateProcessing('Processing performance data...', 1500)
    
    const metricsArtifact = await this.calculateMetrics(input)
    artifacts.push(metricsArtifact)

    await this.simulateProcessing('Running anomaly detection...', 1000)
    
    const anomalyArtifact = await this.detectAnomalies(input)
    artifacts.push(anomalyArtifact)

    await this.simulateProcessing('Generating forecasts...', 1200)
    
    const forecastArtifact = await this.generateForecast(input)
    artifacts.push(forecastArtifact)

    return artifacts
  }

  private async calculateMetrics(input?: any): Promise<CalcArtifact> {
    const metricType = input?.metric_type || 'cpqm'
    
    // Mock calculation based on metric type
    const calculation = this.performCalculation(metricType)

    return this.createArtifact(
      'calc',
      `${metricType.toUpperCase()} Analysis`,
      {
        markdown_body: `## ${metricType.toUpperCase()} Calculation\n\n**Result:** $${calculation.result.value.toFixed(2)}\n**Interpretation:** ${calculation.result.interpretation}\n\n### Calculation Details\n- **Formula:** ${calculation.formula}\n- **Confidence Level:** ${(calculation.confidence_interval?.confidence_level || 0.9) * 100}%\n- **Sample Size:** ${calculation.inputs.find(i => i.name === 'sample_size')?.value || 'N/A'}\n\n### Inputs\n${calculation.inputs.map(i => `- **${i.name}**: ${i.value} ${i.unit}`).join('\n')}\n\n### Benchmark Comparison\n${calculation.result.benchmark_comparison ? 
  `Your ${metricType.toUpperCase()}: $${calculation.result.value.toFixed(2)}\nIndustry Benchmark: $${calculation.result.benchmark_comparison.benchmark_value.toFixed(2)}\nVariance: ${calculation.result.benchmark_comparison.variance_percent > 0 ? '+' : ''}${calculation.result.benchmark_comparison.variance_percent.toFixed(1)}%` 
  : 'No benchmark data available'}`,
        structured_data: calculation
      },
      {
        confidence_score: 0.87,
        data_sources: ['performance_data', 'industry_benchmarks'],
        tags: [metricType, 'calculation', 'metrics'],
        computation_time_ms: 1500
      }
    ) as CalcArtifact
  }

  private performCalculation(metricType: 'cpqm' | 'cac' | 'ltv' | 'roi' | 'mer') {
    // Mock data generation for different metric types
    const mockData = {
      cpqm: {
        spend: Math.random() * 10000 + 5000,
        qualified_meetings: Math.random() * 50 + 20,
        benchmark: 180
      },
      cac: {
        spend: Math.random() * 15000 + 8000,
        customers_acquired: Math.random() * 25 + 10,
        benchmark: 650
      },
      ltv: {
        average_revenue: Math.random() * 5000 + 2000,
        churn_rate: Math.random() * 0.05 + 0.02,
        gross_margin: Math.random() * 0.2 + 0.7,
        benchmark: 12000
      },
      roi: {
        revenue_generated: Math.random() * 50000 + 25000,
        investment: Math.random() * 15000 + 8000,
        benchmark: 3.2
      },
      mer: {
        revenue: Math.random() * 40000 + 20000,
        marketing_spend: Math.random() * 10000 + 5000,
        benchmark: 4.5
      }
    }

    const data = mockData[metricType]
    let result: number
    let formula: string
    let inputs: any[] = []

    switch (metricType) {
      case 'cpqm':
        result = data.spend / data.qualified_meetings
        formula = 'Total Spend ÷ Qualified Meetings'
        inputs = [
          { name: 'total_spend', value: data.spend, unit: 'USD', source: 'campaign_data' },
          { name: 'qualified_meetings', value: data.qualified_meetings, unit: 'count', source: 'crm_data' },
          { name: 'sample_size', value: 30, unit: 'days', source: 'time_period' }
        ]
        break
      
      case 'cac':
        result = data.spend / data.customers_acquired
        formula = 'Total Acquisition Spend ÷ Customers Acquired'
        inputs = [
          { name: 'acquisition_spend', value: data.spend, unit: 'USD', source: 'marketing_data' },
          { name: 'customers_acquired', value: data.customers_acquired, unit: 'count', source: 'sales_data' },
          { name: 'sample_size', value: 90, unit: 'days', source: 'time_period' }
        ]
        break
      
      case 'ltv':
        result = (data.average_revenue * data.gross_margin) / data.churn_rate
        formula = '(Average Revenue × Gross Margin) ÷ Churn Rate'
        inputs = [
          { name: 'average_revenue', value: data.average_revenue, unit: 'USD', source: 'billing_data' },
          { name: 'gross_margin', value: data.gross_margin, unit: 'percentage', source: 'financial_data' },
          { name: 'churn_rate', value: data.churn_rate, unit: 'percentage', source: 'customer_data' }
        ]
        break
      
      case 'roi':
        result = (data.revenue_generated - data.investment) / data.investment
        formula = '(Revenue Generated - Investment) ÷ Investment'
        inputs = [
          { name: 'revenue_generated', value: data.revenue_generated, unit: 'USD', source: 'sales_data' },
          { name: 'investment', value: data.investment, unit: 'USD', source: 'marketing_spend' }
        ]
        break
      
      case 'mer':
        result = data.revenue / data.marketing_spend
        formula = 'Total Revenue ÷ Marketing Spend'
        inputs = [
          { name: 'total_revenue', value: data.revenue, unit: 'USD', source: 'sales_data' },
          { name: 'marketing_spend', value: data.marketing_spend, unit: 'USD', source: 'marketing_data' }
        ]
        break
      
      default:
        result = 0
        formula = 'Unknown calculation'
    }

    const benchmark = data.benchmark
    const variance = ((result - benchmark) / benchmark) * 100

    const interpretation = this.interpretResult(metricType, result, benchmark)

    return {
      calculation_type: metricType,
      inputs,
      formula,
      result: {
        value: result,
        unit: metricType === 'roi' || metricType === 'mer' ? 'ratio' : 'USD',
        interpretation,
        benchmark_comparison: {
          benchmark_value: benchmark,
          variance_percent: variance,
          percentile_rank: Math.random() * 40 + 30 // 30-70th percentile
        }
      },
      assumptions: this.getAssumptions(metricType),
      confidence_interval: {
        lower_bound: result * 0.85,
        upper_bound: result * 1.15,
        confidence_level: 0.9
      }
    }
  }

  private interpretResult(metricType: string, value: number, benchmark: number): 'excellent' | 'good' | 'acceptable' | 'poor' | 'critical' {
    const ratio = value / benchmark
    
    // For cost metrics (CPQM, CAC), lower is better
    const isInverted = ['cpqm', 'cac'].includes(metricType)
    
    if (isInverted) {
      if (ratio <= 0.7) return 'excellent'
      if (ratio <= 0.9) return 'good'
      if (ratio <= 1.1) return 'acceptable'
      if (ratio <= 1.3) return 'poor'
      return 'critical'
    } else {
      // For revenue metrics (LTV, ROI, MER), higher is better
      if (ratio >= 1.3) return 'excellent'
      if (ratio >= 1.1) return 'good'
      if (ratio >= 0.9) return 'acceptable'
      if (ratio >= 0.7) return 'poor'
      return 'critical'
    }
  }

  private getAssumptions(metricType: string): string[] {
    const commonAssumptions = [
      'Data quality is consistent across time periods',
      'Attribution models are accurate',
      'Market conditions remain stable'
    ]

    const metricAssumptions = {
      cpqm: [
        'Meeting qualification criteria are consistent',
        'Lead quality remains stable over time'
      ],
      cac: [
        'Customer acquisition channels are properly attributed',
        'Organic acquisition is excluded from calculation'
      ],
      ltv: [
        'Churn rate remains constant over customer lifetime',
        'Revenue patterns are predictable'
      ],
      roi: [
        'All revenue is properly attributed to investment',
        'Timeframe captures full revenue cycle'
      ],
      mer: [
        'Marketing spend includes all relevant costs',
        'Revenue attribution is accurate'
      ]
    }

    return [...commonAssumptions, ...(metricAssumptions[metricType as keyof typeof metricAssumptions] || [])]
  }

  private async detectAnomalies(input?: any): Promise<Artifact> {
    // Mock anomaly detection
    const anomalies = [
      {
        timestamp: '2024-01-15T10:30:00Z',
        metric: 'conversion_rate',
        value: 0.023,
        expected_value: 0.045,
        severity: 'medium' as const,
        description: 'Conversion rate 49% below expected',
        potential_causes: ['Landing page issue', 'Ad creative fatigue', 'Technical problems']
      },
      {
        timestamp: '2024-01-18T14:15:00Z',
        metric: 'cost_per_click',
        value: 2.84,
        expected_value: 1.92,
        severity: 'high' as const,
        description: 'CPC spike of 48% detected',
        potential_causes: ['Increased competition', 'Keyword bid adjustments', 'Quality score drop']
      }
    ]

    return this.createArtifact(
      'calc',
      'Performance Anomaly Detection',
      {
        markdown_body: `## Anomaly Detection Results\n\n**Analysis Period:** Last 30 days\n**Anomalies Detected:** ${anomalies.length}\n\n### Detected Anomalies\n\n${anomalies.map((a, i) => 
          `**${i + 1}. ${a.metric.toUpperCase()} Anomaly**\n- **Severity:** ${a.severity}\n- **Value:** ${a.value} (expected: ${a.expected_value})\n- **Description:** ${a.description}\n- **Potential Causes:**\n${a.potential_causes.map(c => `  - ${c}`).join('\n')}\n`
        ).join('\n')}`,
        json_data: {
          anomalies,
          detection_method: 'statistical_threshold',
          sensitivity: 0.85,
          false_positive_rate: 0.05
        }
      },
      {
        confidence_score: 0.83,
        data_sources: ['performance_metrics', 'statistical_models'],
        tags: ['anomalies', 'detection', 'alerts']
      }
    )
  }

  private async generateForecast(input?: any): Promise<Artifact> {
    // Mock forecast generation
    const horizon = 30 // days
    const forecastData = Array.from({ length: horizon }, (_, i) => {
      const trend = 1 + (i * 0.002) // 0.2% daily growth
      const seasonality = 1 + Math.sin((i / 7) * Math.PI) * 0.1 // Weekly pattern
      const noise = 1 + (Math.random() - 0.5) * 0.05 // ±2.5% random variation
      
      const baseValue = 150 // Base CPQM
      return {
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        predicted_value: baseValue * trend * seasonality * noise,
        lower_bound: baseValue * trend * seasonality * noise * 0.85,
        upper_bound: baseValue * trend * seasonality * noise * 1.15
      }
    })

    const totalPredicted = forecastData.reduce((sum, d) => sum + d.predicted_value, 0)
    const avgPredicted = totalPredicted / forecastData.length

    return this.createArtifact(
      'calc',
      'Performance Forecast',
      {
        markdown_body: `## 30-Day Performance Forecast\n\n**Average Predicted CPQM:** $${avgPredicted.toFixed(2)}\n**Forecast Confidence:** 85%\n**Trend:** Slight upward trend (+0.2% daily)\n\n### Key Insights\n- Weekly seasonality pattern detected\n- Expected variance: ±15%\n- Recommendation: Monitor for trend changes\n\n### Forecast Data\n${forecastData.slice(0, 7).map(d => `- ${d.date}: $${d.predicted_value.toFixed(2)} (±$${(d.upper_bound - d.lower_bound).toFixed(2)})`).join('\n')}\n\n*[Showing first 7 days of 30-day forecast]*`,
        json_data: {
          forecast_horizon: horizon,
          forecast_data: forecastData,
          model_type: 'time_series_decomposition',
          accuracy_metrics: {
            mape: 8.3, // Mean Absolute Percentage Error
            rmse: 12.7, // Root Mean Square Error
            r_squared: 0.847
          }
        }
      },
      {
        confidence_score: 0.85,
        data_sources: ['historical_performance', 'time_series_model'],
        tags: ['forecast', 'prediction', 'trends']
      }
    )
  }

  /**
   * Calculate specific metric
   */
  public async calculateMetric(
    metricType: 'cpqm' | 'cac' | 'ltv' | 'roi' | 'mer',
    data: any
  ): Promise<CalcArtifact> {
    const artifacts = await this.execute({ metric_type: metricType, data_points: data })
    return artifacts.find(a => a.type === 'calc') as CalcArtifact
  }

  /**
   * Monitor performance and detect issues
   */
  public async monitorPerformance(
    metrics: Array<{ name: string; value: number; timestamp: string }>
  ): Promise<Artifact[]> {
    await this.simulateProcessing('Monitoring performance metrics...', 800)
    
    // Check for alerts based on thresholds
    const alerts = this.checkAlertThresholds(metrics)
    
    if (alerts.length > 0) {
      const alertArtifact = this.createArtifact(
        'calc',
        'Performance Alerts',
        {
          markdown_body: `## Performance Alerts\n\n${alerts.map((alert, i) => 
            `**${i + 1}. ${alert.metric} Alert**\n- **Current Value:** ${alert.value}\n- **Threshold:** ${alert.threshold}\n- **Severity:** ${alert.severity}\n- **Action Required:** ${alert.action}`
          ).join('\n\n')}`,
          json_data: { alerts }
        },
        {
          confidence_score: 0.92,
          data_sources: ['real_time_metrics'],
          tags: ['alerts', 'monitoring', 'real_time']
        }
      )
      
      return [alertArtifact]
    }
    
    return []
  }

  private checkAlertThresholds(metrics: Array<{ name: string; value: number; timestamp: string }>) {
    // Mock alert thresholds
    const thresholds = {
      cpqm: { warning: 200, critical: 300 },
      conversion_rate: { warning: 0.03, critical: 0.02 },
      cpc: { warning: 2.5, critical: 3.5 }
    }

    const alerts = []
    
    for (const metric of metrics) {
      const threshold = thresholds[metric.name as keyof typeof thresholds]
      if (threshold) {
        if (metric.value >= threshold.critical) {
          alerts.push({
            metric: metric.name,
            value: metric.value,
            threshold: threshold.critical,
            severity: 'critical',
            action: 'Immediate investigation required'
          })
        } else if (metric.value >= threshold.warning) {
          alerts.push({
            metric: metric.name,
            value: metric.value,
            threshold: threshold.warning,
            severity: 'warning',
            action: 'Monitor closely and prepare optimization'
          })
        }
      }
    }

    return alerts
  }
}