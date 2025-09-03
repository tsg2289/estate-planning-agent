import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'
import EmailSignup from './EmailSignup'

const LandingPage = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [assessmentAnswers, setAssessmentAnswers] = useState({
    hasWill: null,
    hasTrust: null,
    hasPOA: null,
    hasAHD: null
  })
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/login')
  }

  const handleLearnMore = () => {
    // Scroll to features section
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' })
  }

  const handleAssessmentAnswer = (question, answer) => {
    setAssessmentAnswers(prev => ({
      ...prev,
      [question]: answer
    }))
  }

  const handleAssessmentComplete = () => {
    // Navigate to login with assessment results
    navigate('/login', { state: { assessmentAnswers } })
  }

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">EstatePlan Pro</span>
          </div>
          <div className="nav-actions">
            <button 
              className="nav-button secondary"
              onClick={() => navigate('/blog')}
            >
              Blog
            </button>
            <button 
              className="nav-button secondary"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
            <button 
              className="nav-button primary"
              onClick={handleGetStarted}
            >
              Get Started
            </button>
            <button 
              className="nav-button admin"
              onClick={() => navigate('/admin')}
              title="Admin Access"
            >
              🔐 Admin
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Secure Estate Planning
              <span className="title-accent"> Made Simple</span>
            </h1>
            <p className="hero-description">
              Create comprehensive estate plans, wills, trusts, and power of attorney documents 
              with bank-level security. Your sensitive information is protected with enterprise-grade encryption.
            </p>
            <div className="hero-actions">
              <button 
                className="hero-button primary"
                onClick={handleGetStarted}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Start Your Estate Plan
                <span className="button-arrow">→</span>
              </button>
              <button 
                className="hero-button secondary"
                onClick={handleLearnMore}
              >
                Learn More
              </button>
            </div>
            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>Bank-Level Security</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>15-Minute Setup</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <span>Mobile Friendly</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="security-badge">
              <div className="badge-icon">🔐</div>
              <div className="badge-text">
                <div className="badge-title">256-bit Encryption</div>
                <div className="badge-subtitle">Military Grade Security</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Section */}
      <section className="assessment-section">
        <div className="assessment-container">
          <div className="section-header">
            <h2>What Do You Need?</h2>
            <p>Answer a few quick questions to get personalized recommendations for your estate planning</p>
          </div>
          
          <div className="assessment-questions">
            <div className="question-card">
              <div className="question-header">
                <span className="question-icon">📜</span>
                <h3>Do you have a Last Will and Testament?</h3>
              </div>
              <p className="question-description">
                A will specifies how your assets should be distributed and who should care for minor children.
              </p>
              <div className="question-options">
                <button 
                  className={`option-button ${assessmentAnswers.hasWill === true ? 'selected' : ''}`}
                  onClick={() => handleAssessmentAnswer('hasWill', true)}
                >
                  Yes, I have one
                </button>
                <button 
                  className={`option-button ${assessmentAnswers.hasWill === false ? 'selected' : ''}`}
                  onClick={() => handleAssessmentAnswer('hasWill', false)}
                >
                  No, I need one
                </button>
                <button 
                  className={`option-button ${assessmentAnswers.hasWill === 'unsure' ? 'selected' : ''}`}
                  onClick={() => handleAssessmentAnswer('hasWill', 'unsure')}
                >
                  I'm not sure
                </button>
              </div>
            </div>

            <div className="question-card">
              <div className="question-header">
                <span className="question-icon">🏛️</span>
                <h3>Do you have a Living Trust?</h3>
              </div>
              <p className="question-description">
                A trust can help avoid probate and provide more control over asset distribution.
              </p>
              <div className="question-options">
                <button 
                  className={`option-button ${assessmentAnswers.hasTrust === true ? 'selected' : ''}`}
                  onClick={() => handleAssessmentAnswer('hasTrust', true)}
                >
                  Yes, I have one
                </button>
                <button 
                  className={`option-button ${assessmentAnswers.hasTrust === false ? 'selected' : ''}`}
                  onClick={() => handleAssessmentAnswer('hasTrust', false)}
                >
                  No, I need one
                </button>
                <button 
                  className={`option-button ${assessmentAnswers.hasTrust === 'unsure' ? 'selected' : ''}`}
                  onClick={() => handleAssessmentAnswer('hasTrust', 'unsure')}
                >
                  I'm not sure
                </button>
              </div>
            </div>

            <div className="question-card">
              <div className="question-header">
                <span className="question-icon">⚖️</span>
                <h3>Do you have a Power of Attorney?</h3>
              </div>
              <p className="question-description">
                A POA allows someone to make financial and legal decisions on your behalf if you become incapacitated.
              </p>
              <div className="question-options">
                <button 
                  className={`option-button ${assessmentAnswers.hasPOA === true ? 'selected' : ''}`}
                  onClick={() => handleAssessmentAnswer('hasPOA', true)}
                >
                  Yes, I have one
                </button>
                <button 
                  className={`option-button ${assessmentAnswers.hasPOA === false ? 'selected' : ''}`}
                  onClick={() => handleAssessmentAnswer('hasPOA', false)}
                >
                  No, I need one
                </button>
                <button 
                  className={`option-button ${assessmentAnswers.hasPOA === 'unsure' ? 'selected' : ''}`}
                  onClick={() => handleAssessmentAnswer('hasPOA', 'unsure')}
                >
                  I'm not sure
                </button>
              </div>
            </div>

            <div className="question-card">
              <div className="question-header">
                <span className="question-icon">🏥</span>
                <h3>Do you have an Advanced Healthcare Directive?</h3>
              </div>
              <p className="question-description">
                An AHD (living will) specifies your medical treatment preferences if you can't communicate.
              </p>
              <div className="question-options">
                <button 
                  className={`option-button ${assessmentAnswers.hasAHD === true ? 'selected' : ''}`}
                  onClick={() => handleAssessmentAnswer('hasAHD', true)}
                >
                  Yes, I have one
                </button>
                <button 
                  className={`option-button ${assessmentAnswers.hasAHD === false ? 'selected' : ''}`}
                  onClick={() => handleAssessmentAnswer('hasAHD', false)}
                >
                  No, I need one
                </button>
                <button 
                  className={`option-button ${assessmentAnswers.hasAHD === 'unsure' ? 'selected' : ''}`}
                  onClick={() => handleAssessmentAnswer('hasAHD', 'unsure')}
                >
                  I'm not sure
                </button>
              </div>
            </div>
          </div>

          <div className="assessment-actions">
            <button 
              className="assessment-button primary"
              onClick={handleAssessmentComplete}
              disabled={Object.values(assessmentAnswers).some(answer => answer === null)}
            >
              Get My Personalized Plan
            </button>
            <p className="assessment-note">
              Your answers help us create the most relevant estate planning documents for your situation.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2>Why Choose EstatePlan Pro?</h2>
            <p>Professional-grade estate planning with enterprise security</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Bank-Level Security</h3>
              <p>Your data is encrypted with AES-256 encryption and stored securely. We use the same security standards as major financial institutions.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Quick & Easy</h3>
              <p>Complete your estate plan in as little as 15 minutes with our guided, step-by-step process. No legal jargon, just clear questions.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Comprehensive Documents</h3>
              <p>Generate legally-sound wills, trusts, power of attorney, and healthcare directives. All documents are state-specific and up-to-date.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Professional Quality</h3>
              <p>Created by legal experts and reviewed by attorneys. Your documents meet the same standards as those prepared by law firms.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Always Accessible</h3>
              <p>Access your estate plan from any device, anywhere. Your documents are securely stored and available 24/7.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Easy Updates</h3>
              <p>Life changes? Update your estate plan anytime. No need to start over - just modify what needs to change.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Get answers to common questions about estate planning and our services</p>
          </div>
          
          <div className="faq-grid">
            <div className="faq-item">
              <div className="faq-question">
                <span className="faq-icon">❓</span>
                <h3>What documents do I need for estate planning?</h3>
              </div>
              <p className="faq-answer">
                Most people need a Last Will and Testament, Power of Attorney, and Advanced Healthcare Directive. Depending on your situation, a Living Trust might also be beneficial. Our assessment tool will help determine what's right for you.
              </p>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                <span className="faq-icon">❓</span>
                <h3>How long does it take to complete my estate plan?</h3>
              </div>
              <p className="faq-answer">
                You can complete your estate plan in as little as 15 minutes. The process is guided and straightforward, asking clear questions about your wishes and circumstances.
              </p>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                <span className="faq-icon">❓</span>
                <h3>Are the documents legally valid?</h3>
              </div>
              <p className="faq-answer">
                Yes, all documents are created using state-specific legal templates and reviewed by legal professionals. However, we recommend having a local attorney review your final documents before signing.
              </p>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                <span className="faq-icon">❓</span>
                <h3>Can I update my estate plan later?</h3>
              </div>
              <p className="faq-answer">
                Absolutely! Life changes, and so can your estate plan. You can update your documents anytime through your account, and we'll generate new versions for you to sign.
              </p>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                <span className="faq-icon">❓</span>
                <h3>What happens to my data if I cancel my account?</h3>
              </div>
              <p className="faq-answer">
                Your data is securely stored and you can download your documents anytime. If you cancel, your documents remain accessible for 30 days, after which they're permanently deleted from our servers.
              </p>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                <span className="faq-icon">❓</span>
                <h3>Do you offer customer support?</h3>
              </div>
              <p className="faq-answer">
                Yes! We provide comprehensive customer support via email and chat. Our team is available to help with any questions about the estate planning process or technical issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="section-header">
            <h2>What Our Users Say</h2>
            <p>Join thousands of families who trust EstatePlan Pro with their estate planning needs</p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"EstatePlan Pro made creating our family's estate plan incredibly simple. The guided process was clear and comprehensive, and we felt confident in the legal quality of our documents."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍👩‍👧‍👦</div>
                <div className="author-info">
                  <h4>Sarah & Michael Chen</h4>
                  <span>Family of 4, California</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"As a small business owner, I needed comprehensive estate planning that covered both personal and business assets. EstatePlan Pro delivered exactly what I needed with enterprise-level security."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">💼</div>
                <div className="author-info">
                  <h4>David Rodriguez</h4>
                  <span>Business Owner, Texas</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"I was overwhelmed by the thought of estate planning, but the step-by-step process made it feel manageable. The security features gave me peace of mind knowing my sensitive information was protected."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👵</div>
                <div className="author-info">
                  <h4>Margaret Thompson</h4>
                  <span>Retired, Florida</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="testimonials-cta">
            <p>Ready to join our satisfied customers?</p>
            <button 
              className="testimonials-button"
              onClick={handleGetStarted}
            >
              Start Your Estate Plan Today
            </button>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="security-section">
        <div className="security-container">
          <div className="security-content">
            <h2>Your Security is Our Priority</h2>
            <p>We understand that estate planning involves sensitive personal and financial information. That's why we've implemented enterprise-grade security measures to protect your data.</p>
            
            <div className="security-features">
              <div className="security-feature">
                <div className="security-icon">🔒</div>
                <div>
                  <h4>256-bit AES Encryption</h4>
                  <p>All data is encrypted using military-grade encryption algorithms</p>
                </div>
              </div>
              
              <div className="security-feature">
                <div className="security-icon">🌐</div>
                <div>
                  <h4>Secure HTTPS Connection</h4>
                  <p>All communications are protected with SSL/TLS encryption</p>
                </div>
              </div>
              
              <div className="security-feature">
                <div className="security-icon">🔐</div>
                <div>
                  <h4>Two-Factor Authentication</h4>
                  <p>Optional 2FA for additional account security</p>
                </div>
              </div>
              
              <div className="security-feature">
                <div className="security-icon">📊</div>
                <div>
                  <h4>Regular Security Audits</h4>
                  <p>Continuous monitoring and third-party security assessments</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="security-visual">
            <div className="security-shield">
              <div className="shield-icon">🛡️</div>
              <div className="shield-text">Enterprise Security</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Secure Your Legacy?</h2>
          <p>Join thousands of families who trust EstatePlan Pro with their estate planning needs.</p>
          <div className="cta-actions">
            <button 
              className="cta-button primary"
              onClick={handleGetStarted}
            >
              Start Your Estate Plan Today
            </button>
            <button 
              className="cta-button secondary"
              onClick={() => navigate('/login')}
            >
              Sign In to Existing Account
            </button>
          </div>
          <div className="cta-guarantee">
            <span className="guarantee-icon">✅</span>
            <span>30-day money-back guarantee • No hidden fees</span>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="blog-preview-section">
        <div className="blog-preview-container">
          <div className="section-header">
            <h2>Latest Estate Planning Insights</h2>
            <p>Stay informed with expert advice, legal updates, and practical tips for protecting your family's future</p>
          </div>
          
          <div className="blog-preview-grid">
            <div className="blog-preview-card">
              <div className="preview-image">
                <img src="/api/placeholder/400/250" alt="Estate Planning Basics" />
              </div>
              <div className="preview-content">
                <div className="preview-meta">
                  <span className="category">Estate Planning</span>
                  <span className="date">Jan 15, 2024</span>
                </div>
                <h3>Estate Planning Basics: A Complete Guide for 2024</h3>
                <p>Learn the fundamentals of estate planning, including wills, trusts, and power of attorney documents.</p>
                <button 
                  className="read-more-button"
                  onClick={() => navigate('/blog/estate-planning-basics-2024')}
                >
                  Read More →
                </button>
              </div>
            </div>

            <div className="blog-preview-card">
              <div className="preview-image">
                <img src="/api/placeholder/400/250" alt="Digital Assets" />
              </div>
              <div className="preview-content">
                <div className="preview-meta">
                  <span className="category">Digital Assets</span>
                  <span className="date">Jan 10, 2024</span>
                </div>
                <h3>Protecting Your Digital Assets in Estate Planning</h3>
                <p>Learn how to include online accounts, cryptocurrencies, and digital files in your estate plan.</p>
                <button 
                  className="read-more-button"
                  onClick={() => navigate('/blog/digital-assets-estate-planning')}
                >
                  Read More →
                </button>
              </div>
            </div>

            <div className="blog-preview-card">
              <div className="preview-image">
                <img src="/api/placeholder/400/250" alt="Tax Planning" />
              </div>
              <div className="preview-content">
                <div className="preview-meta">
                  <span className="category">Tax Planning</span>
                  <span className="date">Jan 5, 2024</span>
                </div>
                <h3>Understanding Tax Implications in Estate Planning</h3>
                <p>Navigate estate taxes, gift taxes, and income taxes to minimize your family's tax burden.</p>
                <button 
                  className="read-more-button"
                  onClick={() => navigate('/blog/tax-implications-estate-planning')}
                >
                  Read More →
                </button>
              </div>
            </div>
          </div>

          <div className="blog-cta">
            <button 
              className="view-all-posts-button"
              onClick={() => navigate('/blog')}
            >
              View All Posts
            </button>
          </div>
        </div>
      </section>

      {/* Email Signup Section */}
      <section className="email-signup-section">
        <div className="email-signup-container">
          <EmailSignup 
            title="Stay Updated on Estate Planning"
            subtitle="Get expert tips, legal updates, and exclusive content delivered to your inbox. Join our community of estate planning professionals and families."
            source="landing_page"
            tags="estate-planning, newsletter, tips"
            onSuccess={(data) => console.log('Email signup successful:', data)}
            onError={(error) => console.error('Email signup error:', error)}
          />
        </div>
      </section>

      {/* Disclaimer */}
      <section className="disclaimer-section">
        <div className="disclaimer-container">
          <div className="disclaimer-content">
            <h3>Disclaimer</h3>
            <p>
              This application is provided for informational and educational purposes only. It does not constitute legal advice, nor does it create an attorney–client relationship. Estate planning laws vary by state, and each individual's circumstances are unique. Any documents generated through this application should be carefully reviewed by a licensed attorney in your jurisdiction before being signed or relied upon.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>EstatePlan Pro</h4>
              <p>Professional estate planning made simple and secure.</p>
            </div>
            
            <div className="footer-section">
              <h4>Security</h4>
              <ul>
                <li>256-bit Encryption</li>
                <li>SSL/TLS Protection</li>
                <li>Two-Factor Auth</li>
                <li>Regular Audits</li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li>Help Center</li>
                <li>Contact Support</li>
                <li>Documentation</li>
                <li>FAQ</li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Security Policy</li>
                <li>GDPR Compliance</li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 EstatePlan Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
