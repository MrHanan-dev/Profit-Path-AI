'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  BarChart3, 
  Settings, 
  Bell,
  User,
  LogOut,
  Plus,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  Calendar,
  Filter
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Link from 'next/link'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddIntegration, setShowAddIntegration] = useState(false)
  const [integrations, setIntegrations] = useState([
    { name: 'QuickBooks', status: 'connected', icon: 'QB' },
    { name: 'Xero', status: 'connected', icon: 'X' },
    { name: 'Shopify', status: 'disconnected', icon: 'S' },
    { name: 'Stripe', status: 'disconnected', icon: 'ST' }
  ])
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New profit opportunity detected', time: '5 min ago' },
    { id: 2, message: 'Stripe integration available', time: '1 hour ago' },
    { id: 3, message: 'Monthly report ready', time: '2 hours ago' }
  ])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null)

  // Mock data for charts
  const profitData = [
    { month: 'Jan', profit: 45000, revenue: 120000, costs: 75000 },
    { month: 'Feb', profit: 52000, revenue: 135000, costs: 83000 },
    { month: 'Mar', profit: 48000, revenue: 128000, costs: 80000 },
    { month: 'Apr', profit: 61000, revenue: 145000, costs: 84000 },
    { month: 'May', profit: 55000, revenue: 138000, costs: 83000 },
    { month: 'Jun', profit: 68000, revenue: 155000, costs: 87000 },
  ]

  const productPerformance = [
    { name: 'Product A', revenue: 45000, margin: 35, sales: 1200 },
    { name: 'Product B', revenue: 38000, margin: 28, sales: 950 },
    { name: 'Product C', revenue: 32000, margin: 42, sales: 800 },
    { name: 'Product D', revenue: 28000, margin: 25, sales: 700 },
    { name: 'Product E', revenue: 22000, margin: 38, sales: 550 },
  ]

  const subscriptionData = [
    { name: 'Active', value: 65, color: '#10B981' },
    { name: 'Unused', value: 25, color: '#F59E0B' },
    { name: 'Expired', value: 10, color: '#EF4444' },
  ]

  const [profitOpportunities, setProfitOpportunities] = useState([
    {
      id: 1,
      type: 'subscription',
      title: 'Unused SaaS Subscriptions',
      description: '3 subscriptions unused for 60+ days',
      potential: 2500,
      priority: 'high',
      action: 'Review and cancel unused services',
      status: 'pending'
    },
    {
      id: 2,
      type: 'pricing',
      title: 'Low Margin Products',
      description: 'Product A has high revenue but 15% margin',
      potential: 8000,
      priority: 'medium',
      action: 'Consider price increase or cost reduction',
      status: 'pending'
    },
    {
      id: 3,
      type: 'advertising',
      title: 'Inefficient Ad Spend',
      description: 'Facebook ads showing 2.1x ROAS vs target 3x',
      potential: 3500,
      priority: 'medium',
      action: 'Optimize ad targeting and creative',
      status: 'pending'
    }
  ])

  // Handler functions
  const handleIntegrationAction = async (integrationName: string, action: string) => {
    try {
      if (action === 'connect') {
        const response = await fetch('/api/integrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'connect',
            integrationName,
            credentials: { /* mock credentials */ }
          })
        })
        
        if (response.ok) {
          setIntegrations(prev => prev.map(integration => 
            integration.name === integrationName 
              ? { ...integration, status: 'connected' }
              : integration
          ))
          alert(`${integrationName} connected successfully!`)
        } else {
          alert('Failed to connect integration')
        }
      } else if (action === 'manage') {
        // Open integration management modal
        alert(`Managing ${integrationName} integration...`)
      }
    } catch (error) {
      console.error('Integration action error:', error)
      alert('Failed to perform integration action')
    }
  }

  const handleAddIntegration = () => {
    setShowAddIntegration(true)
    alert('Add Integration modal would open here')
  }

  const generateProfitReport = () => {
    const doc = new jsPDF()
    
    // Add title
    doc.setFontSize(24)
    doc.setTextColor(59, 130, 246) // Blue color
    doc.text('ProfitPath - Profit Rescue Report', 20, 30)
    
    // Add date
    doc.setFontSize(12)
    doc.setTextColor(107, 114, 128) // Gray color
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45)
    
    // Executive Summary
    doc.setFontSize(16)
    doc.setTextColor(17, 24, 39) // Dark gray
    doc.text('Executive Summary', 20, 65)
    
    doc.setFontSize(10)
    doc.setTextColor(55, 65, 81)
    doc.text('This report identifies key profit optimization opportunities based on your business data analysis.', 20, 75)
    
    // Key Metrics
    doc.setFontSize(14)
    doc.setTextColor(17, 24, 39)
    doc.text('Key Performance Metrics', 20, 95)
    
    const metricsData = [
      ['Metric', 'Value', 'Change'],
      ['Monthly Revenue', '$155,000', '+8.3%'],
      ['Monthly Profit', '$68,000', '+12.5%'],
      ['Profit Margin', '43.9%', '+2.1%'],
      ['Cost Savings', '$12,400', '+15.2%']
    ]
    
         (doc as any).autoTable({
       startY: 105,
       head: [metricsData[0]],
       body: metricsData.slice(1),
       theme: 'grid',
       headStyles: { fillColor: [59, 130, 246] },
       styles: { fontSize: 10 }
     })
    
    // Profit Opportunities
    doc.setFontSize(14)
    doc.setTextColor(17, 24, 39)
    doc.text('Profit Optimization Opportunities', 20, 160)
    
    const opportunitiesData = profitOpportunities.map(opp => [
      opp.title,
      `$${opp.potential.toLocaleString()}`,
      opp.priority.toUpperCase(),
      opp.action
    ])
    
         (doc as any).autoTable({
       startY: 170,
       head: [['Opportunity', 'Potential Savings', 'Priority', 'Recommended Action']],
       body: opportunitiesData,
       theme: 'grid',
       headStyles: { fillColor: [59, 130, 246] },
       styles: { fontSize: 8 },
       columnStyles: {
         0: { cellWidth: 50 },
         1: { cellWidth: 30 },
         2: { cellWidth: 25 },
         3: { cellWidth: 85 }
       }
     })
    
    // Product Performance
    doc.setFontSize(14)
    doc.setTextColor(17, 24, 39)
    doc.text('Product Performance Analysis', 20, 220)
    
    const productData = productPerformance.map(product => [
      product.name,
      `$${product.revenue.toLocaleString()}`,
      `${product.margin}%`,
      product.sales.toLocaleString()
    ])
    
         (doc as any).autoTable({
       startY: 230,
       head: [['Product', 'Revenue', 'Margin', 'Sales']],
       body: productData,
       theme: 'grid',
       headStyles: { fillColor: [59, 130, 246] },
       styles: { fontSize: 9 }
     })
    
    // Recommendations
    doc.setFontSize(14)
    doc.setTextColor(17, 24, 39)
    doc.text('Strategic Recommendations', 20, 280)
    
    doc.setFontSize(10)
    doc.setTextColor(55, 65, 81)
    
    const recommendations = [
      '1. Review and cancel unused SaaS subscriptions (Potential: $2,500/month)',
      '2. Consider price increase for Product A to improve margin from 15% to 25%',
      '3. Optimize Facebook ad targeting to improve ROAS from 2.1x to 3x',
      '4. Implement automated cost monitoring for real-time optimization',
      '5. Set up alerts for margin drops below 20%'
    ]
    
    recommendations.forEach((rec, index) => {
      doc.text(rec, 20, 290 + (index * 8))
    })
    
    // Footer
    doc.setFontSize(8)
    doc.setTextColor(107, 114, 128)
    doc.text('Generated by ProfitPath - AI-Powered Profit Optimization', 20, 340)
    
    // Save the PDF
    const fileName = `ProfitPath_Report_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
  }

  const handleDownloadReport = async () => {
    try {
      // Show loading state
      const button = document.querySelector('[data-report-button]') as HTMLButtonElement
      if (button) {
        button.disabled = true
        button.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Generating...'
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate the actual PDF report
      generateProfitReport()
      
      // Reset button
      if (button) {
        button.disabled = false
        button.innerHTML = '<Plus className="w-4 h-4 mr-2" />Generate Report'
      }
      
    } catch (error) {
      console.error('Download report error:', error)
      alert('Failed to generate report')
      
      // Reset button on error
      const button = document.querySelector('[data-report-button]') as HTMLButtonElement
      if (button) {
        button.disabled = false
        button.innerHTML = '<Plus className="w-4 h-4 mr-2" />Generate Report'
      }
    }
  }

  const handleViewDetails = (opportunityId: number) => {
    alert(`Viewing details for opportunity ${opportunityId}`)
  }

  const handleTakeAction = (opportunity: any) => {
    setSelectedOpportunity(opportunity)
    setShowActionModal(true)
  }

  const handleConfirmAction = async () => {
    if (!selectedOpportunity) return
    
    try {
      // Update the opportunity status
      setProfitOpportunities(prev => prev.map(opp => 
        opp.id === selectedOpportunity.id 
          ? { ...opp, status: 'in-progress' }
          : opp
      ))
      
      // Close modal
      setShowActionModal(false)
      setSelectedOpportunity(null)
      
      // Show success message
      alert(`Action initiated for ${selectedOpportunity.title}. Our team will review and implement the recommended changes.`)
      
    } catch (error) {
      console.error('Confirm action error:', error)
      alert('Failed to process action. Please try again.')
    }
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await fetch('/api/auth', { method: 'DELETE' })
        window.location.href = '/login'
      } catch (error) {
        console.error('Logout error:', error)
        window.location.href = '/login'
      }
    }
  }

  // Close dropdowns when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element
    if (!target.closest('.notification-dropdown') && !target.closest('.user-dropdown')) {
      setShowNotifications(false)
      setShowUserDropdown(false)
    }
  }

  // Add click outside listener
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const recentAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Product B margin dropped 5% this month',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'success',
      message: 'Subscription optimization saved $1,200 this month',
      time: '1 day ago'
    },
    {
      id: 3,
      type: 'info',
      message: 'New integration available: Stripe',
      time: '3 days ago'
    }
  ]

  const metrics = [
    {
      title: 'Monthly Profit',
      value: '$68,000',
      change: '+12.5%',
      trend: 'up',
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      title: 'Profit Margin',
      value: '43.9%',
      change: '+2.1%',
      trend: 'up',
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      title: 'Revenue',
      value: '$155,000',
      change: '+8.3%',
      trend: 'up',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      title: 'Cost Savings',
      value: '$12,400',
      change: '+15.2%',
      trend: 'up',
      icon: <Target className="w-5 h-5" />
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ProfitPath</span>
          </div>
        </div>
        
        <nav className="mt-6 px-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-3" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'opportunities' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Zap className="w-5 h-5 mr-3" />
              Opportunities
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'reports' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Download className="w-5 h-5 mr-3" />
              Reports
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'integrations' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5 mr-3" />
              Integrations
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <BarChart3 className="w-6 h-6" />
              </button>
              <h1 className="ml-4 text-2xl font-semibold text-gray-900">
                {activeTab === 'overview' && 'Dashboard'}
                {activeTab === 'opportunities' && 'Profit Opportunities'}
                {activeTab === 'reports' && 'Reports'}
                {activeTab === 'integrations' && 'Integrations'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    </div>
                    {notifications.map((notification) => (
                      <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                        <p className="text-sm text-gray-700">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative user-dropdown">
                <button 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <User className="w-5 h-5" />
                </button>
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <Link 
                      href="/profile"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="card"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <div className="text-blue-600">{metric.icon}</div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      {metric.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`ml-1 text-sm font-medium ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">vs last month</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profit Trend */}
                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Profit Trend</h3>
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-700"
                      onClick={() => alert('Viewing profit trend details...')}
                    >
                      View Details
                    </button>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={profitData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Product Performance */}
                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Product Performance</h3>
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-700"
                      onClick={() => alert('Viewing all product performance data...')}
                    >
                      View All
                    </button>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={productPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Alerts */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
                <div className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          alert.type === 'warning' ? 'bg-yellow-500' :
                          alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`} />
                        <span className="text-sm text-gray-700">{alert.message}</span>
                      </div>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'opportunities' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Profit Opportunities</h2>
                                 <button 
                   className="btn-primary flex items-center"
                   onClick={handleDownloadReport}
                   data-report-button
                 >
                   <Plus className="w-4 h-4 mr-2" />
                   Generate Report
                 </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {profitOpportunities.map((opportunity) => (
                  <motion.div
                    key={opportunity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          opportunity.priority === 'high' ? 'bg-red-500' :
                          opportunity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <span className="text-sm font-medium text-gray-500 uppercase">
                          {opportunity.priority} priority
                        </span>
                      </div>
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => handleViewDetails(opportunity.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {opportunity.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {opportunity.description}
                    </p>
                    
                                         <div className="flex items-center justify-between">
                       <div>
                         <p className="text-sm text-gray-500">Potential Savings</p>
                         <p className="text-xl font-bold text-green-600">
                           ${opportunity.potential.toLocaleString()}
                         </p>
                       </div>
                       {opportunity.status === 'pending' ? (
                         <button 
                           className="btn-primary text-sm"
                           onClick={() => handleTakeAction(opportunity)}
                         >
                           Take Action
                         </button>
                       ) : opportunity.status === 'in-progress' ? (
                         <button 
                           className="btn-secondary text-sm flex items-center"
                           disabled
                         >
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                           In Progress
                         </button>
                       ) : (
                         <button 
                           className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium"
                           disabled
                         >
                           Completed
                         </button>
                       )}
                     </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Recommended Action:</strong> {opportunity.action}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Profit Rescue Reports</h2>
                                 <button 
                   className="btn-primary flex items-center"
                   onClick={handleDownloadReport}
                   data-report-button
                 >
                   <Download className="w-4 h-4 mr-2" />
                   Export All
                 </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Analysis</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={subscriptionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {subscriptionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {subscriptionData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-gray-600">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="font-semibold">$155,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Costs</span>
                      <span className="font-semibold">$87,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Net Profit</span>
                      <span className="font-semibold text-green-600">$68,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Profit Margin</span>
                      <span className="font-semibold text-green-600">43.9%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cost Savings</span>
                      <span className="font-semibold text-green-600">$12,400</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Data Integrations</h2>
                <button 
                  className="btn-primary flex items-center"
                  onClick={handleAddIntegration}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Integration
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {integrations.map((integration) => (
                  <div key={integration.name} className="card text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">{integration.icon}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{integration.name}</h3>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      integration.status === 'connected' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {integration.status === 'connected' ? 'Connected' : 'Not Connected'}
                    </div>
                    <button 
                      className="mt-4 w-full btn-secondary text-sm"
                      onClick={() => handleIntegrationAction(
                        integration.name, 
                        integration.status === 'connected' ? 'manage' : 'connect'
                      )}
                    >
                      {integration.status === 'connected' ? 'Manage' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
                 </main>
       </div>

       {/* Action Confirmation Modal */}
       {showActionModal && selectedOpportunity && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-semibold text-gray-900">Confirm Action</h3>
               <button 
                 onClick={() => setShowActionModal(false)}
                 className="text-gray-400 hover:text-gray-600"
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>
             
             <div className="mb-6">
               <h4 className="font-medium text-gray-900 mb-2">{selectedOpportunity.title}</h4>
               <p className="text-gray-600 mb-4">{selectedOpportunity.description}</p>
               
               <div className="bg-blue-50 p-4 rounded-lg mb-4">
                 <h5 className="font-medium text-blue-900 mb-2">What will happen:</h5>
                 <ul className="text-sm text-blue-800 space-y-1">
                   <li>• Our team will review your current setup</li>
                   <li>• Analyze the specific opportunity in detail</li>
                   <li>• Create a customized action plan</li>
                   <li>• Implement the recommended changes</li>
                   <li>• Monitor results and provide updates</li>
                 </ul>
               </div>
               
               <div className="flex items-center justify-between">
                 <span className="text-sm text-gray-600">Potential Savings:</span>
                 <span className="text-lg font-bold text-green-600">
                   ${selectedOpportunity.potential.toLocaleString()}
                 </span>
               </div>
             </div>
             
             <div className="flex space-x-3">
               <button
                 onClick={() => setShowActionModal(false)}
                 className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
               >
                 Cancel
               </button>
               <button
                 onClick={handleConfirmAction}
                 className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
               >
                 Confirm Action
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   )
 }
