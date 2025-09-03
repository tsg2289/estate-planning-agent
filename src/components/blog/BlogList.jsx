import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './BlogList.css'

const BlogList = ({ posts }) => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  // Get unique categories
  const categories = ['All', ...new Set(posts.map(post => post.category))]

  // Filter posts based on category and search term
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handlePostClick = (slug) => {
    navigate(`/blog/${slug}`)
  }

  return (
    <div className="blog-list">
      <div className="blog-header">
        <div className="blog-hero">
          <h1>Estate Planning Blog</h1>
          <p>Expert insights, legal updates, and practical advice for protecting your family's future</p>
        </div>
      </div>

      <div className="blog-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="blog-content">
        <div className="posts-grid">
          {filteredPosts.map(post => (
            <article key={post.id} className="post-card" onClick={() => handlePostClick(post.slug)}>
              <div className="post-content">
                <div className="post-meta">
                  <span className="category">{post.category}</span>
                  <span className="date">{formatDate(post.publishDate)}</span>
                  <span className="read-time">{post.readTime}</span>
                </div>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{post.excerpt}</p>
                <div className="post-tags">
                  {post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="no-posts">
            <h3>No posts found</h3>
            <p>Try adjusting your search terms or category filter.</p>
          </div>
        )}
      </div>

      <div className="blog-newsletter">
        <div className="newsletter-content">
          <h3>Stay Updated</h3>
          <p>Get the latest estate planning insights delivered to your inbox.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogList
