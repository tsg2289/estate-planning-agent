import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { addUser, findUserByEmail } from '../lib/users.js'

export default async (req, res) => {
  try {
    const { email, password, name } = req.body
    
    console.log('=== REGISTRATION REQUEST ===')
    console.log('Headers:', req.headers)
    console.log('Body:', { email, name, passwordLength: password?.length })
    console.log('===========================')
    
    if (!email || !password || !name) {
      console.log('❌ Validation failed - missing fields')
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      })
    }

    const existingUser = findUserByEmail(email)
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        message: 'User already exists' 
      })
    }

    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
      twoFactorEnabled: false
    }

    const createdUser = addUser(newUser)
    if (!createdUser) {
      return res.status(409).json({ 
        success: false,
        message: 'User already exists' 
      })
    }

    const response = {
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    }
    
    console.log('✅ Sending response:', response)
    console.log('===========================')
    
    res.status(201).json(response)
    
  } catch (error) {
    console.error('❌ Registration error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    })
  }
}
