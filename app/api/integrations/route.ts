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

    // Get user's integrations
    const integrations = await prisma.integration.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Return default integrations if none exist
    if (integrations.length === 0) {
      const defaultIntegrations = [
        { name: 'QuickBooks', status: 'disconnected', icon: 'QB' },
        { name: 'Xero', status: 'disconnected', icon: 'X' },
        { name: 'Shopify', status: 'disconnected', icon: 'S' },
        { name: 'Stripe', status: 'disconnected', icon: 'ST' }
      ]
      return NextResponse.json({ success: true, data: defaultIntegrations })
    }

    return NextResponse.json({ success: true, data: integrations })

  } catch (error) {
    console.error('Integrations error:', error)
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
    const { action, integrationName, credentials } = body

    switch (action) {
      case 'connect':
        // Connect an integration
        const integration = await connectIntegration(user.id, integrationName, credentials)
        return NextResponse.json({
          success: true,
          message: `${integrationName} connected successfully`,
          integration
        })

      case 'disconnect':
        // Disconnect an integration
        await disconnectIntegration(user.id, integrationName)
        return NextResponse.json({
          success: true,
          message: `${integrationName} disconnected successfully`
        })

      case 'sync':
        // Sync data from integration
        const syncResult = await syncIntegrationData(user.id, integrationName)
        return NextResponse.json({
          success: true,
          message: `${integrationName} data synced successfully`,
          data: syncResult
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Integrations POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function connectIntegration(userId: string, integrationName: string, credentials: any) {
  // In a real application, you would:
  // 1. Validate credentials with the third-party service
  // 2. Exchange credentials for access tokens
  // 3. Store tokens securely
  
  const integration = await prisma.integration.upsert({
    where: {
      userId_name: {
        userId,
        name: integrationName
      }
    },
    update: {
      status: 'connected',
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      metadata: {
        connectedAt: new Date().toISOString(),
        lastSync: null
      }
    },
    create: {
      userId,
      name: integrationName,
      status: 'connected',
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      metadata: {
        connectedAt: new Date().toISOString(),
        lastSync: null
      }
    }
  })

  return integration
}

async function disconnectIntegration(userId: string, integrationName: string) {
  await prisma.integration.update({
    where: {
      userId_name: {
        userId,
        name: integrationName
      }
    },
    data: {
      status: 'disconnected',
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      metadata: {
        disconnectedAt: new Date().toISOString()
      }
    }
  })
}

async function syncIntegrationData(userId: string, integrationName: string) {
  // In a real application, you would:
  // 1. Use the stored access token to fetch data from the third-party service
  // 2. Process and store the data in your database
  // 3. Update the integration's lastSync timestamp

  const integration = await prisma.integration.findUnique({
    where: {
      userId_name: {
        userId,
        name: integrationName
      }
    }
  })

  if (!integration || integration.status !== 'connected') {
    throw new Error('Integration not connected')
  }

  // Mock data sync - in reality, this would fetch from the actual service
  const mockData = generateMockIntegrationData(integrationName)

  // Update last sync time
  await prisma.integration.update({
    where: { id: integration.id },
    data: {
      metadata: {
        ...integration.metadata,
        lastSync: new Date().toISOString()
      }
    }
  })

  return mockData
}

function generateMockIntegrationData(integrationName: string) {
  const mockData = {
    QuickBooks: {
      transactions: [
        { id: '1', date: '2024-01-15', amount: 5000, type: 'income', description: 'Product Sales' },
        { id: '2', date: '2024-01-14', amount: -1200, type: 'expense', description: 'Software Subscription' },
        { id: '3', date: '2024-01-13', amount: -800, type: 'expense', description: 'Office Supplies' }
      ],
      accounts: [
        { id: '1', name: 'Checking Account', balance: 25000 },
        { id: '2', name: 'Credit Card', balance: -5000 }
      ]
    },
    Xero: {
      invoices: [
        { id: '1', number: 'INV-001', amount: 5000, status: 'paid', dueDate: '2024-01-20' },
        { id: '2', number: 'INV-002', amount: 3000, status: 'pending', dueDate: '2024-01-25' }
      ],
      expenses: [
        { id: '1', amount: 1200, description: 'Software Subscription', date: '2024-01-15' },
        { id: '2', amount: 800, description: 'Office Supplies', date: '2024-01-14' }
      ]
    },
    Shopify: {
      orders: [
        { id: '1', orderNumber: '#1001', total: 150, status: 'fulfilled', date: '2024-01-15' },
        { id: '2', orderNumber: '#1002', total: 200, status: 'pending', date: '2024-01-16' }
      ],
      products: [
        { id: '1', name: 'Product A', price: 50, inventory: 100 },
        { id: '2', name: 'Product B', price: 75, inventory: 50 }
      ]
    },
    Stripe: {
      payments: [
        { id: '1', amount: 150, status: 'succeeded', date: '2024-01-15' },
        { id: '2', amount: 200, status: 'succeeded', date: '2024-01-16' }
      ],
      customers: [
        { id: '1', email: 'customer1@example.com', totalSpent: 500 },
        { id: '2', email: 'customer2@example.com', totalSpent: 300 }
      ]
    }
  }

  return mockData[integrationName as keyof typeof mockData] || {}
}
