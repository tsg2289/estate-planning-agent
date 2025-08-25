import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const SALT_ROUNDS = 12

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, password, name } = req.body

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' })
    }

    // Check password complexity
    const hasLowercase = /[a-z]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)

    if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecial) {
      return res.status(400).json({ 
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
      })
    }

    if (!email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    // In a real application, you would check if the user already exists
    // For this demo, we'll simulate a database check
    // const existingUser = await db.users.findUnique({ where: { email } })
    // if (existingUser) {
    //   return res.status(400).json({ message: 'User already exists' })
    // }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    // In a real application, you would save the user to a database
    // const user = await db.users.create({
    //   data: {
    //     email,
    //     password: hashedPassword,
    //     name
    //   }
    // })

    // For demo purposes, create a mock user object
    const user = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date().toISOString()
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword,
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
