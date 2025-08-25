import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET)
      
      // In a real application, you would fetch the user from a database
      // const user = await db.users.findUnique({ where: { id: decoded.userId } })
      // if (!user) {
      //   return res.status(401).json({ message: 'User not found' })
      // }

      // For demo purposes, return mock user data
      const mockUser = {
        id: decoded.userId,
        email: decoded.email,
        name: 'Demo User',
        createdAt: '2024-01-01T00:00:00.000Z'
      }

      res.status(200).json(mockUser)
    } catch (jwtError) {
      return res.status(401).json({ message: 'Invalid token' })
    }
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
