import React from 'react'

const PlanChecklist = ({ onFormSelect, completedForms, activeForm, progressStatus }) => {
  const checklistItems = [
    {
      id: 'will',
      title: 'Will',
      icon: '📜'
    },
    {
      id: 'trust',
      title: 'Trust',
      icon: '🏛️'
    },
    {
      id: 'poa',
      title: 'Power of Attorney',
      icon: '⚖️'
    },
    {
      id: 'ahcd',
      title: 'Advance Health Care Directive',
      icon: '🏥'
    }
  ]

  const handleItemClick = (itemId) => {
    onFormSelect(itemId)
  }

  return (
    <div className="plan-checklist">
      <h2>Estate Planning Checklist</h2>
      {checklistItems.map((item) => {
        const isCompleted = completedForms.includes(item.id)
        const isActive = activeForm === item.id
        const progress = progressStatus[item.id]
        const progressPercentage = progress?.progressPercentage || 0
        const hasProgress = progress?.hasProgress || false
        
        return (
          <div
            key={item.id}
            className={`checklist-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
            onClick={() => handleItemClick(item.id)}
          >
            <div className="checklist-icon">
              {isCompleted ? '✓' : item.icon}
            </div>
            <div className="checklist-text">
              <h3>{item.title}</h3>
            </div>
            <div className="checklist-progress-info">
              {hasProgress && (
                <span className="progress-percentage">{progressPercentage}% filled</span>
              )}
            </div>
          </div>
        )
      })}
      
      <div className="checklist-progress">
        <p className="text-center mb-2">
          {completedForms.length} of {checklistItems.length} completed
        </p>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${(completedForms.length / checklistItems.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default PlanChecklist
