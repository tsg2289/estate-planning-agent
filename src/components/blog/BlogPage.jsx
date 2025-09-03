import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './BlogPage.css'
import BlogList from './BlogList'
import BlogPost from './BlogPost'

const BlogPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog')
        const data = await response.json()
        
        if (data.success) {
          setPosts(data.posts)
        } else {
          console.error('Failed to fetch posts:', data.message)
          // Fallback to empty array
          setPosts([])
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
        // Fallback to empty array
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
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
