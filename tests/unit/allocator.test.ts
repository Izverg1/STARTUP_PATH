import { ThompsonSamplingAllocator, createDefaultConfig } from '../../src/lib/simulation/thompson-sampling'

function sum(arr: number[]) { return arr.reduce((a, b) => a + b, 0) }

function makeAllocator(opts?: Partial<ReturnType<typeof createDefaultConfig>>) {
  const cfg = { ...createDefaultConfig(), ...(opts || {}) }
  return new ThompsonSamplingAllocator(cfg)
}

function addSimpleChannels(alloc: ThompsonSamplingAllocator) {
  alloc.addChannel({ id: 'A', name: 'A', type: 'google_search',   totalConversions: 80, totalImpressions: 4000, totalBudget: 2000 })
  alloc.addChannel({ id: 'B', name: 'B', type: 'paid_social',     totalConversions: 60, totalImpressions: 4000, totalBudget: 2000 })
  alloc.addChannel({ id: 'C', name: 'C', type: 'content_marketing', totalConversions: 20, totalImpressions: 4000, totalBudget: 2000 })
}

// 1) Deterministic reproducibility
{
  const totalBudget = 10000
  const alloc1 = makeAllocator({ deterministic: true, seed: 42, totalBudget })
  addSimpleChannels(alloc1)
  const r1 = alloc1.allocateBudget()

  const alloc2 = makeAllocator({ deterministic: true, seed: 42, totalBudget })
  addSimpleChannels(alloc2)
  const r2 = alloc2.allocateBudget()

  const a1 = r1.map(x => x.allocatedBudget)
  const a2 = r2.map(x => x.allocatedBudget)
  if (JSON.stringify(a1) !== JSON.stringify(a2)) {
    console.error('Deterministic test failed: allocations differ for same seed')
    process.exit(1)
  }
}

// 2) Sum equals totalBudget + constraints respected
{
  const totalBudget = 12345
  const alloc = makeAllocator({ deterministic: true, seed: 7, totalBudget, minAllocationPercentage: 0.1, maxAllocationPercentage: 0.6 })
  addSimpleChannels(alloc)
  const res = alloc.allocateBudget()
  const amounts = res.map(r => r.allocatedBudget)
  if (sum(amounts) !== totalBudget) {
    console.error('Sum test failed: allocations do not sum to totalBudget')
    process.exit(1)
  }
  const n = res.length
  const minAmt = Math.floor(totalBudget * 0.1)
  const maxAmt = Math.ceil(totalBudget * 0.6)
  for (const a of amounts) {
    if (a < minAmt || a > maxAmt) {
      console.error('Constraint test failed: allocation outside min/max bounds', { a, minAmt, maxAmt })
      process.exit(1)
    }
  }
}

// 3) Monotonic-ish behavior: higher conversions tends to get >= others in deterministic run
{
  const totalBudget = 8000
  const alloc = makeAllocator({ deterministic: true, seed: 99, totalBudget })
  addSimpleChannels(alloc)
  const res = alloc.allocateBudget()
  const byId: Record<string, number> = {}
  res.forEach(r => { byId[r.channelId] = r.allocatedBudget })
  if (!(byId['A'] >= byId['B'] && byId['B'] >= byId['C'])) {
    console.error('Monotonic test failed: allocation order does not reflect performance order')
    process.exit(1)
  }
}

console.log('Thompson Sampling unit tests passed')
