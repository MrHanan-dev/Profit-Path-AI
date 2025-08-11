import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'overview'

    // Get user's analytics data from database
    const analytics = await prisma.analytics.findMany({
      where: {
        userId: user.id,
        type: type
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 1
    })

    if (analytics.length === 0) {
      // Return default data if no analytics exist
      return NextResponse.json({
        success: true,
        data: getDefaultAnalytics(type)
      })
    }

    return NextResponse.json({
      success: true,
      data: analytics[0].data
    })

  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, data, type, period = 'monthly' } = body

    switch (action) {
      case 'save_analytics':
        // Save analytics data to database
        await prisma.analytics.create({
          data: {
            userId: user.id,
            type,
            data,
            period
          }
        })
        return NextResponse.json({ success: true, message: 'Analytics data saved' })

      case 'generate_report':
        // Generate and save a new report
        const reportData = generateReportData(user.id)
        await prisma.analytics.create({
          data: {
            userId: user.id,
            type: 'reports',
            data: reportData,
            period
          }
        })
        return NextResponse.json({
          success: true,
          message: 'Report generated successfully',
          reportId: 'report_' + Date.now()
        })

      case 'update_opportunity':
        // Update profit opportunity status
        const { opportunityId, status } = data
        await prisma.profitOpportunity.update({
          where: { id: opportunityId },
          data: { status }
        })
        return NextResponse.json({ success: true, message: 'Opportunity updated successfully' })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Analytics POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getDefaultAnalytics(type: string) {
  const defaultData = {
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
        { name: 'Product A', revenue: 45000, margin: 35, sales: 1200, cost: 29250 },
        { name: 'Product B', revenue: 38000, margin: 28, sales: 950, cost: 27360 },
        { name: 'Product C', revenue: 32000, margin: 42, sales: 800, cost: 18560 },
        { name: 'Product D', revenue: 28000, margin: 25, sales: 700, cost: 21000 },
        { name: 'Product E', revenue: 22000, margin: 38, sales: 550, cost: 13640 }
      ],
      recentAlerts: [
        { id: 1, type: 'warning', message: 'Product B margin dropped 5% this month', time: '2 hours ago' },
        { id: 2, type: 'success', message: 'Subscription optimization saved $1,200 this month', time: '1 day ago' },
        { id: 3, type: 'info', message: 'New integration available: Stripe', time: '3 days ago' }
      ]
    },
    opportunities: [
      {
        id: 1,
        type: 'subscription',
        title: 'Unused SaaS Subscriptions',
        description: '3 subscriptions unused for 60+ days',
        potential: 2500,
        priority: 'high',
        action: 'Review and cancel unused services',
        details: [
          { service: 'Adobe Creative Suite', cost: 1200, lastUsed: '2024-01-15' },
          { service: 'Slack Pro', cost: 800, lastUsed: '2024-01-20' },
          { service: 'Asana Premium', cost: 500, lastUsed: '2024-01-10' }
        ]
      },
      {
        id: 2,
        type: 'pricing',
        title: 'Low Margin Products',
        description: 'Product A has high revenue but 15% margin',
        potential: 8000,
        priority: 'medium',
        action: 'Consider price increase or cost reduction',
        details: [
          { product: 'Product A', currentMargin: 15, suggestedMargin: 25, potentialIncrease: 8000 }
        ]
      },
      {
        id: 3,
        type: 'advertising',
        title: 'Inefficient Ad Spend',
        description: 'Facebook ads showing 2.1x ROAS vs target 3x',
        potential: 3500,
        priority: 'medium',
        action: 'Optimize ad targeting and creative',
        details: [
          { platform: 'Facebook', currentROAS: 2.1, targetROAS: 3.0, spend: 15000, potentialSavings: 3500 }
        ]
      }
    ],
    reports: {
      subscriptionData: [
        { name: 'Active', value: 65, color: '#10B981' },
        { name: 'Unused', value: 25, color: '#F59E0B' },
        { name: 'Expired', value: 10, color: '#EF4444' }
      ],
      productPerformance: [
        { name: 'Product A', revenue: 45000, margin: 35, sales: 1200 },
        { name: 'Product B', revenue: 38000, margin: 28, sales: 950 },
        { name: 'Product C', revenue: 32000, margin: 42, sales: 800 },
        { name: 'Product D', revenue: 28000, margin: 25, sales: 700 },
        { name: 'Product E', revenue: 22000, margin: 38, sales: 550 }
      ],
      profitData: [
        { month: 'Jan', profit: 45000, revenue: 120000, costs: 75000 },
        { month: 'Feb', profit: 52000, revenue: 135000, costs: 83000 },
        { month: 'Mar', profit: 48000, revenue: 128000, costs: 80000 },
        { month: 'Apr', profit: 61000, revenue: 145000, costs: 84000 },
        { month: 'May', profit: 55000, revenue: 138000, costs: 83000 },
        { month: 'Jun', profit: 68000, revenue: 155000, costs: 87000 }
      ]
    }
  }

  return defaultData[type as keyof typeof defaultData] || defaultData.overview
}

function generateReportData(userId: string) {
  // This would generate a comprehensive report based on user's data
  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalRevenue: 155000,
      totalCosts: 87000,
      netProfit: 68000,
      profitMargin: 43.9,
      costSavings: 12400
    },
    recommendations: [
      'Cancel unused SaaS subscriptions to save $2,500/month',
      'Increase Product A pricing by 10% to improve margin',
      'Optimize Facebook ad targeting to improve ROAS'
    ]
  }
}
