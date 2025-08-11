const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Setting up database...')

  // Create a sample user
  const user = await prisma.user.upsert({
    where: { email: 'demo@profitpath.com' },
    update: {},
    create: {
      email: 'demo@profitpath.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ8Kj2G', // demo123
      firstName: 'Demo',
      lastName: 'User',
      company: 'Demo Company',
      companySize: '10-50'
    }
  })

  console.log('Created user:', user.email)

  // Create sample integrations
  const integrations = [
    { name: 'QuickBooks', status: 'connected' },
    { name: 'Xero', status: 'connected' },
    { name: 'Shopify', status: 'disconnected' },
    { name: 'Stripe', status: 'disconnected' }
  ]

  for (const integration of integrations) {
    await prisma.integration.upsert({
      where: {
        userId_name: {
          userId: user.id,
          name: integration.name
        }
      },
      update: {},
      create: {
        userId: user.id,
        name: integration.name,
        status: integration.status,
        accessToken: integration.status === 'connected' ? 'mock_token' : null,
        metadata: {
          connectedAt: integration.status === 'connected' ? new Date().toISOString() : null
        }
      }
    })
  }

  console.log('Created integrations')

  // Create sample analytics data
  const analyticsData = {
    overview: {
      metrics: {
        monthlyProfit: 68000,
        profitMargin: 43.9,
        revenue: 155000,
        costSavings: 12400,
        profitChange: 12.5,
        marginChange: 2.1,
        revenueChange: 8.3,
        savingsChange: 15.2
      },
      profitData: [
        { month: 'Jan', profit: 45000, revenue: 120000, costs: 75000 },
        { month: 'Feb', profit: 52000, revenue: 135000, costs: 83000 },
        { month: 'Mar', profit: 48000, revenue: 128000, costs: 80000 },
        { month: 'Apr', profit: 61000, revenue: 145000, costs: 84000 },
        { month: 'May', profit: 55000, revenue: 138000, costs: 83000 },
        { month: 'Jun', profit: 68000, revenue: 155000, costs: 87000 }
      ],
      productPerformance: [
        { name: 'Product A', revenue: 45000, margin: 35, sales: 1200 },
        { name: 'Product B', revenue: 38000, margin: 28, sales: 950 },
        { name: 'Product C', revenue: 32000, margin: 42, sales: 800 },
        { name: 'Product D', revenue: 28000, margin: 25, sales: 700 },
        { name: 'Product E', revenue: 22000, margin: 38, sales: 550 }
      ]
    }
  }

  await prisma.analytics.create({
    data: {
      userId: user.id,
      type: 'overview',
      data: analyticsData.overview,
      period: 'monthly'
    }
  })

  console.log('Created analytics data')

  // Create sample profit opportunities
  const opportunities = [
    {
      type: 'subscription',
      title: 'Unused SaaS Subscriptions',
      description: '3 subscriptions unused for 60+ days',
      potential: 2500,
      priority: 'high',
      action: 'Review and cancel unused services'
    },
    {
      type: 'pricing',
      title: 'Low Margin Products',
      description: 'Product A has high revenue but 15% margin',
      potential: 8000,
      priority: 'medium',
      action: 'Consider price increase or cost reduction'
    },
    {
      type: 'advertising',
      title: 'Inefficient Ad Spend',
      description: 'Facebook ads showing 2.1x ROAS vs target 3x',
      potential: 3500,
      priority: 'medium',
      action: 'Optimize ad targeting and creative'
    }
  ]

  for (const opportunity of opportunities) {
    await prisma.profitOpportunity.create({
      data: {
        userId: user.id,
        ...opportunity
      }
    })
  }

  console.log('Created profit opportunities')

  console.log('Database setup complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
