import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

const LandingPage = () => {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/login')
  }

  const handleLearnMore = () => {
    // Scroll to features section
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' })
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
