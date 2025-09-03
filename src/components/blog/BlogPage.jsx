import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './BlogPage.css'
import BlogList from './BlogList'
import BlogPost from './BlogPost'

// Blog posts data
const blogPosts = [
  {
    id: 1,
    slug: 'what-is-power-of-attorney-why-you-need-one',
    title: 'What Is a Power of Attorney? Why You Need One Now',
    excerpt: 'Learn what a power of attorney is, the different types, and why you need one now. Protect your future with this essential estate planning tool.',
    content: `
      <p>When people think of estate planning, they often focus on wills and trusts. But one of the most important—and often overlooked—documents is the power of attorney. If you've ever wondered what is a power of attorney and why it matters, this guide will explain everything you need to know.</p>
      
      <h2>What Is a Power of Attorney?</h2>
      <p>A power of attorney (POA) is a legal document that gives someone you trust (called your "agent" or "attorney-in-fact") the authority to act on your behalf. Depending on the type of power of attorney, this can include handling your finances, managing your property, signing legal documents, or making healthcare decisions if you are unable to do so yourself.</p>
      
      <h2>Why Is a Power of Attorney Important?</h2>
      <p>Without a valid power of attorney, your family may be forced into a lengthy and expensive court process called conservatorship or guardianship. Having a POA in place ensures:</p>
      <ul>
        <li><strong>Continuity:</strong> Bills, investments, and taxes are still handled.</li>
        <li><strong>Healthcare choices:</strong> A healthcare power of attorney ensures doctors follow your wishes.</li>
        <li><strong>Peace of mind:</strong> You decide who makes decisions—not the courts.</li>
      </ul>
      
      <h2>Types of Power of Attorney</h2>
      
      <h3>General Power of Attorney</h3>
      <p>Grants broad authority over financial and legal decisions.</p>
      
      <h3>Durable Power of Attorney</h3>
      <p>Remains valid even if you become incapacitated. This is one of the most important estate planning documents.</p>
      
      <h3>Limited or Special Power of Attorney</h3>
      <p>Authorizes an agent only for specific actions, like signing paperwork while you travel.</p>
      
      <h3>Medical Power of Attorney</h3>
      <p>Also called a healthcare power of attorney, this allows someone to make medical decisions if you cannot.</p>
      
      <h2>When Should You Get a Power of Attorney?</h2>
      <p>The answer is simple: now. Accidents or illness can happen at any age. By creating a power of attorney today, you prevent stress, expense, and delays for your loved ones.</p>
      
      <h2>How to Set Up a Power of Attorney</h2>
      <ol>
        <li><strong>Choose your agent carefully</strong> – Pick someone trustworthy.</li>
        <li><strong>Decide what powers to grant</strong> – Broad or limited.</li>
        <li><strong>Use the correct form</strong> – Each state has its own requirements.</li>
        <li><strong>Sign and notarize</strong> – Most states require notarization or witnesses.</li>
        <li><strong>Share copies</strong> – Provide them to your agent, financial institutions, and healthcare providers.</li>
      </ol>
      
      <h2>Frequently Asked Questions About Power of Attorney</h2>
      
      <h3>Can I revoke a power of attorney?</h3>
      <p>Yes, you can revoke or change it at any time while mentally competent.</p>
      
      <h3>Is a power of attorney valid after death?</h3>
      <p>No. After death, your will or trust governs your estate.</p>
      
      <h3>Do I need both financial and medical powers of attorney?</h3>
      <p>Yes. A financial POA manages money, while a healthcare POA handles medical choices.</p>
      
      <h2>Final Thoughts</h2>
      <p>If you've ever asked, "What is a power of attorney and why do I need one?" the answer is simple: it's a crucial estate planning document. Protect your future and your family by creating one today.</p>
      
      <p><strong>Next Step:</strong> Contact an estate planning attorney to create a power of attorney tailored to your needs.</p>
    `,
    author: 'Sarah Johnson',
    authorTitle: 'Estate Planning Attorney',
    publishDate: '2024-01-20',
    readTime: '6 min read',
    category: 'Estate Planning',
    tags: ['power-of-attorney', 'estate-planning', 'legal-documents', 'poa'],
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
    views: 950,
    likes: 72
  }
]

const BlogPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Use hardcoded blog posts since API is not deployed on Vercel
    setTimeout(() => {
      setPosts(blogPosts)
      setLoading(false)
    }, 500)
  }, [])

  const getPostBySlug = (slug) => {
    return posts.find(post => post.slug === slug)
  }

  if (loading) {
    return (
      <div className="blog-page">
        <div className="blog-loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading blog posts...</p>
          </div>
        </div>
      </div>
    )
  }

  if (slug) {
    const post = getPostBySlug(slug)
    if (!post) {
      return (
        <div className="blog-page">
          <div className="blog-error">
            <h2>Post Not Found</h2>
            <p>The blog post you're looking for doesn't exist.</p>
            <button onClick={() => navigate('/blog')} className="back-button">
              ← Back to Blog
            </button>
          </div>
        </div>
      )
    }
    return <BlogPost post={post} />
  }

  return <BlogList posts={posts} />
}

export default BlogPage
