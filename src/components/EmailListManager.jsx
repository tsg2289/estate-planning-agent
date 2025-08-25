import { useState, useEffect } from 'react';
import './EmailListManager.css';

const EmailListManager = () => {
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filters, setFilters] = useState({
    subscribed: undefined,
    source: '',
    tags: ''
  });
  
  const [newEmail, setNewEmail] = useState({
    email: '',
    name: '',
    source: 'manual',
    tags: '',
    notes: ''
  });

  // API base URL
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchEmailList();
    fetchStats();
  }, [filters]);

  const fetchEmailList = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.subscribed !== undefined) {
        queryParams.append('subscribed', filters.subscribed);
      }
      if (filters.source) {
        queryParams.append('source', filters.source);
      }
      if (filters.tags) {
        queryParams.append('tags', filters.tags);
      }

      const response = await fetch(`${API_BASE}/api/email-list?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setEmails(data.data);
      } else {
        setError(data.message || 'Failed to fetch email list');
      }
    } catch (err) {
      setError('Failed to fetch email list: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/email-list?action=stats`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleAddEmail = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_BASE}/api/email-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmail),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNewEmail({
          email: '',
          name: '',
          source: 'manual',
          tags: '',
          notes: ''
        });
        setShowAddForm(false);
        fetchEmailList();
        fetchStats();
        setError('');
      } else {
        setError(data.message || 'Failed to add email');
      }
    } catch (err) {
      setError('Failed to add email: ' + err.message);
    }
  };

  const handleRemoveEmail = async (email) => {
    if (!confirm(`Are you sure you want to remove ${email} from the email list?`)) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/api/email-list?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchEmailList();
        fetchStats();
        setError('');
      } else {
        setError(data.message || 'Failed to remove email');
      }
    } catch (err) {
      setError('Failed to remove email: ' + err.message);
    }
  };

  const handleExport = async (format) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('action', 'export');
      queryParams.append('format', format);
      
      if (filters.subscribed !== undefined) {
        queryParams.append('subscribed', filters.subscribed);
      }
      if (filters.source) {
        queryParams.append('source', filters.source);
      }
      if (filters.tags) {
        queryParams.append('tags', filters.tags);
      }

      const response = await fetch(`${API_BASE}/api/email-list?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        // For CSV export, we'll download the file
        if (format === 'csv') {
          const link = document.createElement('a');
          link.href = `${API_BASE}/data/email-list-export.csv`;
          link.download = 'email-list-export.csv';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        
        alert(`Export completed! ${data.data.count} emails exported.`);
      } else {
        setError(data.message || 'Export failed');
      }
    } catch (err) {
      setError('Export failed: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && emails.length === 0) {
    return (
      <div className="email-list-manager">
        <div className="email-manager-loading">
          Loading email list...
        </div>
      </div>
    );
  }

  return (
    <div className="email-list-manager">
      <div className="email-manager-header">
        <h1>Email List Manager</h1>
        <p>Manage your email subscribers and export your email list</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-number">{stats.totalSubscribed || 0}</div>
          <div className="stat-label">Active Subscribers</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalEmails || 0}</div>
          <div className="stat-label">Total Emails</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.recentAdditions || 0}</div>
          <div className="stat-label">New This Month</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.bySource?.length || 0}</div>
          <div className="stat-label">Sources</div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="actions-section">
        <div className="filters">
          <label>
            <input
              type="checkbox"
              checked={filters.subscribed === true}
              onChange={(e) => setFilters(prev => ({ ...prev, subscribed: e.target.checked ? true : undefined }))}
            />
            Subscribed Only
          </label>
          <label>
            <input
              type="text"
              placeholder="Filter by source..."
              value={filters.source}
              onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
            />
          </label>
          <label>
            <input
              type="text"
              placeholder="Filter by tags..."
              value={filters.tags}
              onChange={(e) => setFilters(prev => ({ ...prev, tags: e.target.value }))}
            />
          </label>
        </div>
        
        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add Email'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleExport('csv')}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Export Section */}
      <div className="export-section">
        <label>Export Format:</label>
        <select onChange={(e) => handleExport(e.target.value)}>
          <option value="">Select format...</option>
          <option value="csv">CSV</option>
          <option value="json">JSON</option>
          <option value="txt">TXT</option>
        </select>
        <span>Export {emails.length} emails</span>
      </div>

      {/* Add Email Form */}
      {showAddForm && (
        <div className="add-email-form">
          <h3>Add New Email to List</h3>
          <form onSubmit={handleAddEmail}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  value={newEmail.email}
                  onChange={(e) => setNewEmail(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={newEmail.name}
                  onChange={(e) => setNewEmail(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="source">Source</label>
                <select
                  id="source"
                  value={newEmail.source}
                  onChange={(e) => setNewEmail(prev => ({ ...prev, source: e.target.value }))}
                >
                  <option value="manual">Manual Entry</option>
                  <option value="registration">User Registration</option>
                  <option value="landing_page">Landing Page</option>
                  <option value="referral">Referral</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="tags">Tags</label>
                <input
                  type="text"
                  id="tags"
                  value={newEmail.tags}
                  onChange={(e) => setNewEmail(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., estate-planning, interested, follow-up"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                value={newEmail.notes}
                onChange={(e) => setNewEmail(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes about this subscriber..."
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Add to Email List
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Email List Table */}
      <div className="email-list-table">
        <h3>Email Subscribers ({emails.length})</h3>
        
        {emails.length === 0 ? (
          <div className="no-emails">
            <p>No emails found matching your filters.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Source</th>
                <th>Status</th>
                <th>Subscribed</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email) => (
                <tr key={email.id}>
                  <td>{email.email}</td>
                  <td>{email.name || '-'}</td>
                  <td>{email.source}</td>
                  <td>
                    <span className={`status ${email.subscribed ? 'subscribed' : 'unsubscribed'}`}>
                      {email.subscribed ? 'Subscribed' : 'Unsubscribed'}
                    </span>
                  </td>
                  <td>{formatDate(email.subscribed_at)}</td>
                  <td>{email.tags || '-'}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveEmail(email.email)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmailListManager;
