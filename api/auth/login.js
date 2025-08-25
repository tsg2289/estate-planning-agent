import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // In a real application, you would fetch the user from a database
    // const user = await db.users.findUnique({ where: { email } })
    // if (!user) {
    //   return res.status(401).json({ message: 'Invalid credentials' })
    // }

    // For demo purposes, we'll simulate a user lookup
    // In production, you would have a real database with hashed passwords
    const mockUsers = [
      {
        id: '1',
        email: 'demo@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzqKqK', // 'password123'
        name: 'Demo User',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ]

    const user = mockUsers.find(u => u.email === email)
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
