export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  companyName: string
  companySize: string
}

export interface ProfitData {
  month: string
  profit: number
  revenue: number
  costs: number
}

export interface ProductPerformance {
  name: string
  revenue: number
  margin: number
  sales: number
  cost: number
}

export interface SubscriptionData {
  name: string
  value: number
  color: string
}

export interface ProfitOpportunity {
  id: number
  type: 'subscription' | 'pricing' | 'advertising' | 'other'
  title: string
  description: string
  potential: number
  priority: 'high' | 'medium' | 'low'
  action: string
  details?: any[]
}

export interface Alert {
  id: number
  type: 'warning' | 'success' | 'info' | 'error'
  message: string
  time: string
  severity?: 'low' | 'medium' | 'high'
}

export interface Metrics {
  monthlyProfit: number
  profitMargin: number
  revenue: number
  costSavings: number
  profitChange: number
  marginChange: number
  revenueChange: number
  savingsChange: number
}

export interface Integration {
  name: string
  status: 'connected' | 'disconnected' | 'connecting' | 'error'
  icon: string
  lastSync?: string | null
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

export interface AnalyticsResponse {
  success: boolean
  data: any
  error?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
