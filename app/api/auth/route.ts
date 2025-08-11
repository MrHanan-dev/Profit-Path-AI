import { NextRequest, NextResponse } from 'next/server'
import { createUser, authenticateUser, generateToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'login') {
      const { email, password } = data
      
      // Authenticate user
      const user = await authenticateUser(email, password)
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      // Generate JWT token
      const token = generateToken({ userId: user.id, email: user.email })

      // Set HTTP-only cookie
      const response = NextResponse.json({ 
        success: true, 
        user,
        message: 'Login successful'
      })
      
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      })

      return response

    } else if (action === 'signup') {
      const { email, password, firstName, lastName, company, companySize } = data
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 })
      }

      // Create new user
      const user = await createUser({
        email,
        password,
        firstName,
        lastName,
        company,
        companySize
      })

      // Generate JWT token
      const token = generateToken({ userId: user.id, email: user.email })

      // Set HTTP-only cookie
      const response = NextResponse.json({ 
        success: true, 
        user,
        message: 'Account created successfully'
      })
      
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      })

      return response

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  // Logout - clear the auth cookie
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' })
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0
  })
  
  return response
}
