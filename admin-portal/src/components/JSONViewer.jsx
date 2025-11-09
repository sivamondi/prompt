import { useState } from 'react'
import './JSONViewer.css'

function JSONViewer({ value, onChange, placeholder = 'Enter JSON...' }) {
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const newValue = e.target.value
    onChange(newValue)
    
    // Validate JSON
    if (newValue.trim() === '') {
      setError(null)
      return
    }
    
    try {
      JSON.parse(newValue)
      setError(null)
    } catch (err) {
      setError('Invalid JSON format')
    }
  }

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(value)
      const formatted = JSON.stringify(parsed, null, 2)
      onChange(formatted)
      setError(null)
    } catch (err) {
      setError('Cannot format: Invalid JSON')
    }
  }

  return (
    <div className="json-viewer-container">
      <div className="json-viewer-header">
        <span className="json-label">JSON</span>
        {value && (
          <button 
            type="button" 
            className="format-btn" 
            onClick={formatJSON}
            title="Format JSON"
          >
            Format
          </button>
        )}
      </div>
      <textarea
        className={`json-textarea ${error ? 'error' : ''}`}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        spellCheck={false}
      />
      {error && <div className="json-error">{error}</div>}
    </div>
  )
}

export default JSONViewer

