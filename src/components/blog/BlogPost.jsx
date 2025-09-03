import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './BlogPost.css'
import { blogPosts } from '../../data/blogPosts'

const BlogPost = ({ post: propPost }) => {
  const navigate = useNavigate()
  const { slug } = useParams()
  const [post, setPost] = useState(propPost)
  const [loading, setLoading] = useState(!propPost)

  useEffect(() => {
    if (!propPost && slug) {
      // Find post from hardcoded data since API is not deployed on Vercel
      const foundPost = blogPosts.find(p => p.slug === slug)
      if (foundPost) {
        setPost(foundPost)
      }
      setLoading(false)
    }
  }, [slug, propPost])

  if (loading) {
    return (
      <div className="blog-post">
        <div className="blog-loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading blog post...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="blog-post">
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

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleBackClick = () => {
    navigate('/blog')
  }

  return (
    <div className="blog-post">
      <div className="post-header">
        <button onClick={handleBackClick} className="back-button">
          ← Back to Blog
        </button>
        
        <div className="post-meta">
          <span className="category">{post.category}</span>
          <span className="date">{formatDate(post.publishDate)}</span>
          <span className="read-time">{post.readTime}</span>
        </div>
        
        <h1 className="post-title">{post.title}</h1>
        
        <div className="post-excerpt">
          <p>{post.excerpt}</p>
        </div>
        
        <div className="post-author-info">
          <div className="author-avatar">
            {post.author.split(' ').map(name => name[0]).join('')}
          </div>
          <div className="author-details">
            <h4 className="author-name">{post.author}</h4>
            <p className="author-title">{post.authorTitle}</p>
          </div>
        </div>
        
        <div className="post-tags">
          {post.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      </div>

      <div className="post-image">
        <img src={post.image} alt={post.title} />
      </div>

      <div className="post-content">
        <div 
          className="post-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      <div className="post-footer">
        <div className="post-actions">
          <button className="action-button">
            <span>💬</span>
            Share
          </button>
          <button className="action-button">
            <span>🔖</span>
            Save
          </button>
          <button className="action-button">
            <span>📤</span>
            Print
          </button>
        </div>
        
        <div className="related-posts">
          <h3>Related Articles</h3>
          <div className="related-grid">
            <div className="related-post">
              <h4>Understanding Trusts: A Beginner's Guide</h4>
              <p>Learn the basics of different types of trusts and when to use them.</p>
            </div>
            <div className="related-post">
              <h4>Power of Attorney: What You Need to Know</h4>
              <p>Everything you need to know about creating and managing power of attorney documents.</p>
            </div>
            <div className="related-post">
              <h4>Healthcare Directives: Planning for Medical Decisions</h4>
              <p>How to ensure your medical wishes are respected when you can't speak for yourself.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="post-newsletter">
        <div className="newsletter-content">
          <h3>Found this helpful?</h3>
          <p>Subscribe to our newsletter for more estate planning insights and legal updates.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPost
