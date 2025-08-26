import { useState } from 'react';
import './EmailSignup.css';
import API_CONFIG from '../config/api.js';

const EmailSignup = ({ 
  title = "Stay Updated", 
  subtitle = "Get the latest estate planning tips and updates",
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  source = "landing_page",
  tags = "estate-planning, newsletter",
  onSuccess,
  onError
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // API base URL - use centralized configuration
  const API_BASE = API_CONFIG.BASE_URL.replace('/api', '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Please enter your email address');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE}/api/email-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || null,
          source,
          tags,
          notes: `Signed up from ${source}`
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Thank you for subscribing!');
        setMessageType('success');
        setEmail('');
        setName('');
        
        if (onSuccess) {
          onSuccess(data.data);
        }
      } else {
        setMessage(data.message || 'Subscription failed. Please try again.');
        setMessageType('error');
        
        if (onError) {
          onError(data.message);
        }
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
      setMessageType('error');
      
      if (onError) {
        onError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="email-signup">
      <div className="signup-content">
        <h3 className="signup-title">{title}</h3>
        <p className="signup-subtitle">{subtitle}</p>
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="signup-input name-input"
              disabled={isLoading}
            />
            <input
              type="email"
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="signup-input email-input"
              required
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            className="signup-button"
            disabled={isLoading}
          >
            {isLoading ? 'Subscribing...' : buttonText}
          </button>
        </form>
        
        {message && (
          <div className={`signup-message ${messageType}`}>
            {message}
          </div>
        )}
        
        <p className="signup-privacy">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};

export default EmailSignup;
