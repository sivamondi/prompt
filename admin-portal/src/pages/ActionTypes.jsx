import { useState } from 'react'
import JSONViewer from '../components/JSONViewer'
import SubmitModal from '../components/SubmitModal'
import './ActionTypes.css'

function ActionTypes({ onCancel, onSaveSuccess }) {
  const [formData, setFormData] = useState({
    // Action Type fields
    name: '',
    description: '',
    version: '1',
    schemaPayloadType: 'AVRO',
    schemaPayload: '',
    schemaARN: '',
    // Action Producers fields
    sealId: '',
    deploymentId: '',
    applicationName: '',
    // Destinations
    destinations: ''
  })

  const [showModal, setShowModal] = useState(false)
  const [jsonPayload, setJsonPayload] = useState(null)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNumberInputChange = (field, value) => {
    // Only allow numeric characters
    const numericValue = value.replace(/[^0-9]/g, '')
    setFormData(prev => ({
      ...prev,
      [field]: numericValue
    }))
  }

  const buildJsonPayload = () => {
    // Parse JSON fields if they exist
    let schemaPayloadParsed = null
    let destinationsParsed = null

    try {
      if (formData.schemaPayload && formData.schemaPayload.trim()) {
        schemaPayloadParsed = JSON.parse(formData.schemaPayload)
      }
    } catch (err) {
      throw new Error('Invalid JSON in Schema Payload')
    }

    try {
      if (formData.destinations && formData.destinations.trim()) {
        destinationsParsed = JSON.parse(formData.destinations)
      }
    } catch (err) {
      throw new Error('Invalid JSON in Destinations')
    }

    // Build the JSON payload according to the specified format
    const payload = {
      id: "0",
      actionType: {
        name: formData.name,
        description: formData.description,
        Version: formData.version,
        schemaPayloadType: formData.schemaPayloadType,
        schemaPayload: formData.schemaPayload ? schemaPayloadParsed : null,
        schemaArn: formData.schemaARN
      },
      actionTypeProducer: {
        sealId: formData.sealId ? Number(formData.sealId) : null,
        deploymentId: formData.deploymentId ? Number(formData.deploymentId) : null,
        applicationName: formData.applicationName
      },
      actionTypeConsumers: destinationsParsed
    }

    return payload
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name || !formData.version) {
      alert('Please fill in all required fields (Name and Version)')
      return
    }

    // Validate JSON fields
    try {
      const payload = buildJsonPayload()
      setJsonPayload(payload)
      setShowModal(true)
    } catch (err) {
      alert(`Error: ${err.message}`)
      return
    }
  }

  const handleSave = async () => {
    try {
      console.log('Submitting payload (MOCKED):', jsonPayload)
      
      // MOCK API CALL - Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock successful response
      console.log('Action Type created successfully (MOCKED)')
      
      // Call onSaveSuccess callback with the new action type
      if (onSaveSuccess) {
        onSaveSuccess(jsonPayload)
      }
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        version: '1',
        schemaPayloadType: 'AVRO',
        schemaPayload: '',
        schemaARN: '',
        sealId: '',
        deploymentId: '',
        applicationName: '',
        destinations: ''
      })
      
      setShowModal(false)
      setJsonPayload(null)
      
      // Note: Navigation back to list is handled by onSaveSuccess callback
    } catch (error) {
      alert(`Error submitting form: ${error.message}`)
      console.error('Submission error:', error)
      console.error('Payload that failed:', jsonPayload)
    }
  }

  const handleCancel = () => {
    setShowModal(false)
    setJsonPayload(null)
  }

  return (
    <div className="action-types-page">
      <div className="page-container">
        <div className="form-page-header">
          <button className="back-btn" onClick={onCancel}>
            ← Back to List
          </button>
          <h1 className="page-title">Create Action Type</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="action-types-form">
          {/* Action Type Section */}
          <section className="form-section">
            <h2 className="section-title">Action Type</h2>
            
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                className="form-input"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                placeholder="Enter action type name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <input
                type="text"
                id="description"
                className="form-input"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="version" className="form-label">
                Version <span className="required">*</span>
              </label>
              <select
                id="version"
                className="form-select"
                value={formData.version}
                onChange={(e) => handleInputChange('version', e.target.value)}
                required
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={String(num)}>{num}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="schemaPayloadType" className="form-label">
                Schema Payload Type
              </label>
              <select
                id="schemaPayloadType"
                className="form-select"
                value={formData.schemaPayloadType}
                onChange={(e) => handleInputChange('schemaPayloadType', e.target.value)}
              >
                <option value="JSON">JSON</option>
                <option value="AVRO">AVRO</option>
                <option value="ProtoBuf">ProtoBuf</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="schemaPayload" className="form-label">
                Schema Payload
              </label>
              <JSONViewer
                value={formData.schemaPayload}
                onChange={(value) => handleInputChange('schemaPayload', value)}
                placeholder='{"key": "value"}'
              />
            </div>

            <div className="form-group">
              <label htmlFor="schemaARN" className="form-label">
                Schema ARN
              </label>
              <input
                type="text"
                id="schemaARN"
                className="form-input"
                value={formData.schemaARN}
                onChange={(e) => handleInputChange('schemaARN', e.target.value)}
                placeholder="Enter schema ARN"
              />
            </div>
          </section>

          {/* Action Producers Section */}
          <section className="form-section">
            <h2 className="section-title">Action Producers</h2>
            
            <div className="form-group">
              <label htmlFor="sealId" className="form-label">
                SEAL ID
              </label>
              <input
                type="text"
                id="sealId"
                className="form-input"
                value={formData.sealId}
                onChange={(e) => handleNumberInputChange('sealId', e.target.value)}
                placeholder="Enter SEAL ID"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>

            <div className="form-group">
              <label htmlFor="deploymentId" className="form-label">
                Deployment ID
              </label>
              <input
                type="text"
                id="deploymentId"
                className="form-input"
                value={formData.deploymentId}
                onChange={(e) => handleNumberInputChange('deploymentId', e.target.value)}
                placeholder="Enter deployment ID"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>

            <div className="form-group">
              <label htmlFor="applicationName" className="form-label">
                Application Name
              </label>
              <input
                type="text"
                id="applicationName"
                className="form-input"
                value={formData.applicationName}
                onChange={(e) => handleInputChange('applicationName', e.target.value)}
                placeholder="Enter application name"
              />
            </div>
          </section>

          {/* Destinations Section */}
          <section className="form-section">
            <h2 className="section-title">Destinations</h2>
            
            <div className="form-group">
              <JSONViewer
                value={formData.destinations}
                onChange={(value) => handleInputChange('destinations', value)}
                placeholder='[{"destination": "value"}]'
              />
            </div>
          </section>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              SUBMIT
            </button>
          </div>
        </form>

        {showModal && jsonPayload && (
          <SubmitModal
            jsonPayload={jsonPayload}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  )
}

export default ActionTypes

