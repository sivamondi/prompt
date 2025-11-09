import { useState } from 'react'
import './SubmitModal.css'

function SubmitModal({ jsonPayload, onSave, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      await onSave()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Review Action Type JSON</h2>
          <button className="modal-close" onClick={onCancel}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="json-viewer-container">
            <pre className="json-display">{JSON.stringify(jsonPayload, null, 2)}</pre>
          </div>
        </div>
        <div className="modal-footer">
          <button 
            className="modal-btn cancel-btn" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            className="modal-btn save-btn" 
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubmitModal

