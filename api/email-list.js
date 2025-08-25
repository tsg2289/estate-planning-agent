import { 
  addToEmailList, 
  removeFromEmailList, 
  getEmailList, 
  getEmailListStats, 
  exportEmailList,
  bulkAddToEmailList,
  updateEmailListEntry
} from './lib/email-list.js';

export default async function handler(req, res) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }

  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  try {
    switch (req.method) {
      case 'GET':
        return handleGet(req, res);
      case 'POST':
        return handlePost(req, res);
      case 'PUT':
        return handlePut(req, res);
      case 'DELETE':
        return handleDelete(req, res);
      default:
        return res.status(405).json({ 
          success: false, 
          message: 'Method not allowed' 
        });
    }
  } catch (error) {
    console.error('Email list API error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

const handleGet = async (req, res) => {
  const { action, format, ...filters } = req.query;
  
  try {
    if (action === 'stats') {
      const stats = getEmailListStats();
      return res.status(200).json({
        success: true,
        data: stats
      });
    }
    
    if (action === 'export') {
      const exportResult = exportEmailList(format || 'csv', filters);
      return res.status(200).json({
        success: true,
        message: `Email list exported successfully. ${exportResult.count} emails exported.`,
        data: exportResult
      });
    }
    
    // Default: get email list
    const emails = getEmailList(filters);
    return res.status(200).json({
      success: true,
      data: emails,
      count: emails.length
    });
  } catch (error) {
    console.error('GET email list error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve email list'
    });
  }
};

const handlePost = async (req, res) => {
  const { action, ...data } = req.body;
  
  try {
    if (action === 'bulk-add') {
      if (!Array.isArray(data.emails)) {
        return res.status(400).json({
          success: false,
          message: 'emails array is required for bulk add'
        });
      }
      
      const results = bulkAddToEmailList(data.emails);
      return res.status(200).json({
        success: true,
        message: 'Bulk add completed',
        data: results
      });
    }
    
    // Default: add single email
    if (!data.email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const result = addToEmailList(data);
    return res.status(201).json({
      success: true,
      message: 'Email added to list successfully',
      data: result
    });
  } catch (error) {
    console.error('POST email list error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add email to list'
    });
  }
};

const handlePut = async (req, res) => {
  const { email, ...updates } = req.body;
  
  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const result = updateEmailListEntry(email, updates);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in list'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Email list entry updated successfully',
      data: result
    });
  } catch (error) {
    console.error('PUT email list error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update email list entry'
    });
  }
};

const handleDelete = async (req, res) => {
  const { email } = req.query;
  
  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const result = removeFromEmailList(email);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in list'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Email removed from list successfully'
    });
  } catch (error) {
    console.error('DELETE email list error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove email from list'
    });
  }
};
