import React from 'react';
import './ProgressIndicator.css';

const ProgressIndicator = ({ 
  saveStatus, 
  progressPercentage, 
  lastSaved, 
  onSaveClick, 
  onClearClick,
  showClearButton = true 
}) => {
  const getStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return '⏳';
      case 'saved':
        return '✅';
      case 'error':
        return '❌';
      default:
        return lastSaved ? '💾' : '📝';
    }
  };

  const getStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Progress saved!';
      case 'error':
        return 'Save failed';
      default:
        return lastSaved ? `Last saved: ${new Date(lastSaved).toLocaleString()}` : 'Not saved yet';
    }
  };

  const getStatusColor = () => {
    switch (saveStatus) {
      case 'saving':
        return '#ffa500'; // Orange
      case 'saved':
        return '#4caf50'; // Green
      case 'error':
        return '#f44336'; // Red
      default:
        return lastSaved ? '#2196f3' : '#757575'; // Blue if saved, Gray if not
    }
  };

  return (
    <div className="progress-indicator">
      <div className="progress-header">
        <div className="progress-status">
          <span className="status-icon">{getStatusIcon()}</span>
          <span className="status-text">{getStatusText()}</span>
        </div>
        
        <div className="progress-actions">
          <button 
            className="save-button"
            onClick={onSaveClick}
            disabled={saveStatus === 'saving'}
            title="Save progress manually"
          >
            💾 Save Now
          </button>
          
          {showClearButton && (
            <button 
              className="clear-button"
              onClick={onClearClick}
              title="Clear saved progress"
            >
              🗑️ Clear
            </button>
          )}
        </div>
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${progressPercentage}%`,
              backgroundColor: getStatusColor()
            }}
          />
        </div>
        <span className="progress-percentage">{progressPercentage}%</span>
      </div>
      
      {progressPercentage > 0 && (
        <div className="progress-details">
          <span className="progress-label">
            {progressPercentage === 100 ? 'Form completed!' : 'Form progress'}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;
