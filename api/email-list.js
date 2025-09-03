import express from 'express'
import { 
  addToEmailList, 
  removeFromEmailList, 
  getEmailList, 
  getEmailListStats, 
  exportEmailList,
  bulkAddToEmailList,
  updateEmailListEntry
} from './lib/email-list.js'

const router = express.Router()

// GET /api/email-list - Get all email list entries
router.get('/', async (req, res) => {
  try {
    const { subscribed, source, tags, limit = 100, offset = 0 } = req.query
    
    const filters = {}
    if (subscribed !== undefined) filters.subscribed = subscribed === 'true'
    if (source) filters.source = source
    if (tags) filters.tags = tags
    
    const emails = await getEmailList(filters)
    
    // Apply pagination
    const startIndex = parseInt(offset)
    const endIndex = startIndex + parseInt(limit)
    const paginatedEmails = emails.slice(startIndex, endIndex)
    
    res.json({
      success: true,
      emails: paginatedEmails,
      pagination: {
        total: emails.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: endIndex < emails.length
      }
    })
  } catch (error) {
    console.error('Error fetching email list:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch email list',
      error: error.message
    })
  }
})

// POST /api/email-list - Add email to list
router.post('/', async (req, res) => {
  try {
    const { email, name, source, tags, notes } = req.body
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      })
    }
    
    const emailData = {
      email,
      name,
      source: source || 'manual',
      tags,
      notes
    }
    
    const result = await addToEmailList(emailData)
    
    res.status(201).json({
      success: true,
      message: 'Email added to list successfully',
      email: result
    })
  } catch (error) {
    console.error('Error adding email to list:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add email to list',
      error: error.message
    })
  }
})

// DELETE /api/email-list/:email - Remove email from list
router.delete('/:email', async (req, res) => {
  try {
    const { email } = req.params
    
    const success = await removeFromEmailList(email)
    
    if (success) {
      res.json({
        success: true,
        message: 'Email removed from list successfully'
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'Email not found in list'
      })
    }
  } catch (error) {
    console.error('Error removing email from list:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to remove email from list',
      error: error.message
    })
  }
})

// PUT /api/email-list/:email - Update email list entry
router.put('/:email', async (req, res) => {
  try {
    const { email } = req.params
    const updates = req.body
    
    const result = await updateEmailListEntry(email, updates)
    
    if (result) {
      res.json({
        success: true,
        message: 'Email list entry updated successfully',
        email: result
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'Email not found in list'
      })
    }
  } catch (error) {
    console.error('Error updating email list entry:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update email list entry',
      error: error.message
    })
  }
})

// GET /api/email-list/stats - Get email list statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await getEmailListStats()
    
    res.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Error fetching email list stats:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch email list statistics',
      error: error.message
    })
  }
})

// GET /api/email-list/export - Export email list
router.get('/export', async (req, res) => {
  try {
    const { format = 'csv', subscribed, source, tags } = req.query
    
    const filters = {}
    if (subscribed !== undefined) filters.subscribed = subscribed === 'true'
    if (source) filters.source = source
    if (tags) filters.tags = tags
    
    const exportResult = await exportEmailList(format, filters)
    
    res.json({
      success: true,
      message: 'Email list exported successfully',
      export: exportResult
    })
  } catch (error) {
    console.error('Error exporting email list:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to export email list',
      error: error.message
    })
  }
})

// POST /api/email-list/bulk - Bulk add emails to list
router.post('/bulk', async (req, res) => {
  try {
    const { emails } = req.body
    
    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Emails array is required'
      })
    }
    
    const results = await bulkAddToEmailList(emails)
    
    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length
    
    res.json({
      success: true,
      message: `Bulk operation completed: ${successCount} successful, ${failureCount} failed`,
      results,
      summary: {
        total: emails.length,
        successful: successCount,
        failed: failureCount
      }
    })
  } catch (error) {
    console.error('Error bulk adding emails:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to bulk add emails',
      error: error.message
    })
  }
})

export default router
