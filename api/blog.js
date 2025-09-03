import express from 'express'
import { getDatabase } from './lib/database.js'

const router = express.Router()

// Sample blog posts data
const samplePosts = [
  {
    id: 1,
    slug: 'estate-planning-basics-2024',
    title: 'Estate Planning Basics: A Complete Guide for 2024',
    excerpt: 'Learn the fundamentals of estate planning, including wills, trusts, and power of attorney documents. This comprehensive guide covers everything you need to know to protect your family\'s future.',
    content: `
      <h2>Understanding Estate Planning</h2>
      <p>Estate planning is the process of arranging for the management and disposal of your assets after your death or in the event of your incapacity. It's not just for the wealthy—everyone can benefit from proper estate planning.</p>
      
      <h3>Key Components of Estate Planning</h3>
      <ul>
        <li><strong>Last Will and Testament:</strong> Specifies how your assets should be distributed and who should care for minor children.</li>
        <li><strong>Living Trust:</strong> Helps avoid probate and provides more control over asset distribution.</li>
        <li><strong>Power of Attorney:</strong> Allows someone to make financial and legal decisions on your behalf.</li>
        <li><strong>Advanced Healthcare Directive:</strong> Specifies your medical treatment preferences.</li>
      </ul>
      
      <h3>Why Estate Planning Matters</h3>
      <p>Without proper estate planning, your assets may not be distributed according to your wishes. State laws will determine how your property is divided, which may not align with your intentions. Additionally, the probate process can be lengthy and expensive for your loved ones.</p>
      
      <h3>Getting Started</h3>
      <p>The first step in estate planning is taking inventory of your assets and understanding your goals. Consider what you want to happen to your property, who should care for your children, and who should make decisions if you become incapacitated.</p>
    `,
    author: 'Sarah Johnson',
    authorTitle: 'Estate Planning Attorney',
    publishDate: '2024-01-15',
    readTime: '8 min read',
    category: 'Estate Planning',
    tags: ['wills', 'trusts', 'estate-planning', 'legal-documents'],
    featured: true,
    image: '/api/placeholder/800/400',
    views: 1250,
    likes: 89
  },
  {
    id: 2,
    slug: 'digital-assets-estate-planning',
    title: 'Protecting Your Digital Assets in Estate Planning',
    excerpt: 'In today\'s digital world, your online accounts, cryptocurrencies, and digital files are valuable assets that need protection. Learn how to include digital assets in your estate plan.',
    content: `
      <h2>The Digital Estate Challenge</h2>
      <p>As our lives become increasingly digital, estate planning must evolve to include digital assets. From social media accounts to cryptocurrency holdings, these assets require special consideration in your estate plan.</p>
      
      <h3>Types of Digital Assets</h3>
      <ul>
        <li><strong>Financial Accounts:</strong> Online banking, investment accounts, cryptocurrency wallets</li>
        <li><strong>Digital Media:</strong> Photos, videos, music, e-books</li>
        <li><strong>Business Assets:</strong> Websites, domain names, online stores</li>
        <li><strong>Social Media:</strong> Facebook, Instagram, LinkedIn accounts</li>
        <li><strong>Cloud Storage:</strong> Google Drive, Dropbox, iCloud files</li>
      </ul>
      
      <h3>Creating a Digital Asset Inventory</h3>
      <p>Start by creating a comprehensive list of all your digital assets, including usernames, passwords, and account recovery information. Store this information securely and update it regularly.</p>
      
      <h3>Legal Considerations</h3>
      <p>Many digital assets are governed by terms of service agreements that may restrict transferability. It's important to understand these limitations and plan accordingly.</p>
    `,
    author: 'Michael Chen',
    authorTitle: 'Digital Estate Specialist',
    publishDate: '2024-01-10',
    readTime: '6 min read',
    category: 'Digital Assets',
    tags: ['digital-assets', 'cryptocurrency', 'online-accounts', 'estate-planning'],
    featured: false,
    image: '/api/placeholder/800/400',
    views: 890,
    likes: 67
  },
  {
    id: 3,
    slug: 'tax-implications-estate-planning',
    title: 'Understanding Tax Implications in Estate Planning',
    excerpt: 'Navigate the complex world of estate taxes, gift taxes, and income taxes to minimize your family\'s tax burden and maximize wealth transfer.',
    content: `
      <h2>Estate Tax Fundamentals</h2>
      <p>Estate taxes can significantly impact the wealth you pass on to your heirs. Understanding the current tax laws and planning strategies can help minimize this burden.</p>
      
      <h3>Federal Estate Tax</h3>
      <p>The federal estate tax applies to estates exceeding the exemption amount, which is adjusted annually for inflation. For 2024, the exemption is $13.61 million per person.</p>
      
      <h3>State Estate Taxes</h3>
      <p>Some states impose their own estate taxes with lower exemption amounts. It's important to understand your state's specific requirements.</p>
      
      <h3>Gift Tax Planning</h3>
      <p>Strategic gifting can help reduce your taxable estate while providing immediate benefits to your loved ones. The annual gift tax exclusion allows you to give up to $18,000 per recipient without tax consequences.</p>
      
      <h3>Trust Strategies</h3>
      <p>Various trust structures can help minimize taxes while achieving your estate planning goals. Consult with a qualified attorney to determine the best approach for your situation.</p>
    `,
    author: 'David Rodriguez',
    authorTitle: 'Tax Attorney',
    publishDate: '2024-01-05',
    readTime: '10 min read',
    category: 'Tax Planning',
    tags: ['estate-tax', 'gift-tax', 'tax-planning', 'trusts'],
    featured: false,
    image: '/api/placeholder/800/400',
    views: 1100,
    likes: 78
  },
  {
    id: 4,
    slug: 'family-business-succession-planning',
    title: 'Family Business Succession Planning: Ensuring Continuity',
    excerpt: 'Learn how to plan for the successful transfer of your family business to the next generation while minimizing taxes and family conflicts.',
    content: `
      <h2>The Importance of Business Succession Planning</h2>
      <p>Family businesses face unique challenges when it comes to succession planning. Without proper planning, the business may not survive the transition to the next generation.</p>
      
      <h3>Key Succession Planning Steps</h3>
      <ul>
        <li><strong>Identify Successors:</strong> Determine who will take over the business</li>
        <li><strong>Develop Leadership:</strong> Provide training and mentorship opportunities</li>
        <li><strong>Create Buy-Sell Agreements:</strong> Establish clear terms for ownership transfer</li>
        <li><strong>Plan for Taxes:</strong> Minimize tax burden on the transfer</li>
      </ul>
      
      <h3>Common Challenges</h3>
      <p>Family dynamics, valuation disputes, and tax implications are common challenges in business succession planning. Early planning and professional guidance can help address these issues.</p>
      
      <h3>Legal Structures</h3>
      <p>Various legal structures, including family limited partnerships and dynasty trusts, can facilitate business succession while providing tax benefits and asset protection.</p>
    `,
    author: 'Jennifer Martinez',
    authorTitle: 'Business Succession Attorney',
    publishDate: '2024-01-01',
    readTime: '7 min read',
    category: 'Business Planning',
    tags: ['business-succession', 'family-business', 'leadership', 'tax-planning'],
    featured: false,
    image: '/api/placeholder/800/400',
    views: 750,
    likes: 54
  },
  {
    id: 5,
    slug: 'trust-fundamentals-guide',
    title: 'Trust Fundamentals: A Complete Guide to Different Trust Types',
    excerpt: 'Understanding the various types of trusts and when to use them can help you make informed decisions about your estate planning strategy.',
    content: `
      <h2>What is a Trust?</h2>
      <p>A trust is a legal arrangement where one party (the trustee) holds and manages assets for the benefit of another party (the beneficiary). Trusts can be powerful tools in estate planning.</p>
      
      <h3>Types of Trusts</h3>
      <ul>
        <li><strong>Revocable Living Trust:</strong> Can be modified or revoked during your lifetime</li>
        <li><strong>Irrevocable Trust:</strong> Cannot be changed once established</li>
        <li><strong>Testamentary Trust:</strong> Created through your will</li>
        <li><strong>Special Needs Trust:</strong> Provides for disabled beneficiaries</li>
      </ul>
      
      <h3>Benefits of Trusts</h3>
      <p>Trusts offer several advantages including probate avoidance, privacy protection, and potential tax benefits. They also provide more control over asset distribution.</p>
      
      <h3>Choosing the Right Trust</h3>
      <p>The type of trust you choose depends on your specific goals and circumstances. Consult with an estate planning attorney to determine the best approach for your situation.</p>
    `,
    author: 'Robert Kim',
    authorTitle: 'Trust and Estate Attorney',
    publishDate: '2023-12-28',
    readTime: '9 min read',
    category: 'Estate Planning',
    tags: ['trusts', 'estate-planning', 'legal-documents', 'asset-protection'],
    featured: false,
    image: '/api/placeholder/800/400',
    views: 950,
    likes: 72
  }
]

// GET /api/blog - Get all blog posts
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, limit = 10, offset = 0 } = req.query
    
    let filteredPosts = [...samplePosts]
    
    // Filter by category
    if (category && category !== 'All') {
      filteredPosts = filteredPosts.filter(post => post.category === category)
    }
    
    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase()
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }
    
    // Filter by featured status
    if (featured === 'true') {
      filteredPosts = filteredPosts.filter(post => post.featured)
    }
    
    // Sort by publish date (newest first)
    filteredPosts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    
    // Apply pagination
    const total = filteredPosts.length
    const paginatedPosts = filteredPosts.slice(parseInt(offset), parseInt(offset) + parseInt(limit))
    
    res.json({
      success: true,
      posts: paginatedPosts,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < total
      }
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog posts',
      error: error.message
    })
  }
})

// GET /api/blog/:slug - Get a specific blog post by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    
    const post = samplePosts.find(p => p.slug === slug)
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      })
    }
    
    // Increment view count (in a real app, this would be stored in database)
    post.views = (post.views || 0) + 1
    
    res.json({
      success: true,
      post
    })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog post',
      error: error.message
    })
  }
})

// GET /api/blog/categories - Get all blog categories
router.get('/categories', async (req, res) => {
  try {
    const categories = [...new Set(samplePosts.map(post => post.category))]
    
    res.json({
      success: true,
      categories
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    })
  }
})

// POST /api/blog/:slug/like - Like a blog post
router.post('/:slug/like', async (req, res) => {
  try {
    const { slug } = req.params
    
    const post = samplePosts.find(p => p.slug === slug)
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      })
    }
    
    // Increment like count (in a real app, this would be stored in database)
    post.likes = (post.likes || 0) + 1
    
    res.json({
      success: true,
      likes: post.likes
    })
  } catch (error) {
    console.error('Error liking blog post:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to like blog post',
      error: error.message
    })
  }
})

// GET /api/blog/featured - Get featured blog posts
router.get('/featured', async (req, res) => {
  try {
    const featuredPosts = samplePosts.filter(post => post.featured)
    
    res.json({
      success: true,
      posts: featuredPosts
    })
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured posts',
      error: error.message
    })
  }
})

export default router
