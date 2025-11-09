import React, { useState, useEffect } from 'react'
import './ActionTypesList.css'

// Mock data for action types
const mockActionTypes = [
  {
    id: "1",
    name: "User Registration",
    actionType: {
      name: "User Registration",
      description: "Action type for user registration events",
      Version: "1",
      schemaPayloadType: "JSON",
      schemaPayload: { "userId": "string", "email": "string" },
      schemaArn: "arn:aws:schemas:us-east-1:123456789012:user-registration"
    },
    actionTypeProducer: {
      sealId: 112200,
      deploymentId: 1,
      applicationName: "UserService"
    },
    actionTypeConsumers: [{ "destination": "email-service" }, { "destination": "analytics" }]
  },
  {
    id: "2",
    name: "Order Processing",
    actionType: {
      name: "Order Processing",
      description: "Action type for order processing events",
      Version: "2",
      schemaPayloadType: "AVRO",
      schemaPayload: { "orderId": "string", "amount": "number" },
      schemaArn: "arn:aws:schemas:us-east-1:123456789012:order-processing"
    },
    actionTypeProducer: {
      sealId: 112201,
      deploymentId: 2,
      applicationName: "OrderService"
    },
    actionTypeConsumers: [{ "destination": "payment-service" }, { "destination": "inventory" }]
  },
  {
    id: "3",
    name: "Payment Notification",
    actionType: {
      name: "Payment Notification",
      description: "Action type for payment notification events",
      Version: "1",
      schemaPayloadType: "ProtoBuf",
      schemaPayload: { "paymentId": "string", "status": "string" },
      schemaArn: "arn:aws:schemas:us-east-1:123456789012:payment-notification"
    },
    actionTypeProducer: {
      sealId: 112202,
      deploymentId: 3,
      applicationName: "PaymentService"
    },
    actionTypeConsumers: [{ "destination": "notification-service" }]
  }
]

function ActionTypesList({ onCreateNew, onActionTypeCreated }) {
  const [actionTypes, setActionTypes] = useState(mockActionTypes)
  const [selectedActionType, setSelectedActionType] = useState(actionTypes[0] || null)

  // Handle new action type creation - listen for new action types
  useEffect(() => {
    const handleNewActionType = () => {
      if (window.newActionTypeCreated) {
        const newActionType = window.newActionTypeCreated
        setActionTypes(prev => {
          const actionTypeToAdd = {
            id: String(prev.length + 1),
            name: newActionType.actionType.name,
            ...newActionType
          }
          setSelectedActionType(actionTypeToAdd)
          return [...prev, actionTypeToAdd]
        })
        window.newActionTypeCreated = null // Clear the flag
      }
    }

    window.addEventListener('actionTypeCreated', handleNewActionType)
    // Also check on mount in case action type was created before component mounted
    handleNewActionType()

    return () => {
      window.removeEventListener('actionTypeCreated', handleNewActionType)
    }
  }, [])

  return (
    <div className="action-types-list-page">
      <div className="list-page-header">
        <h1 className="list-page-title">Action Types</h1>
        <button className="create-action-btn" onClick={onCreateNew}>
          Create Action Type
        </button>
      </div>

      <div className="list-page-content">
        <div className="sidebar">
          <div className="sidebar-header">
            <h2>Action Types</h2>
            <span className="action-count">{actionTypes.length}</span>
          </div>
          <div className="action-type-list">
            {actionTypes.map((actionType) => (
              <div
                key={actionType.id}
                className={`action-type-item ${selectedActionType?.id === actionType.id ? 'active' : ''}`}
                onClick={() => setSelectedActionType(actionType)}
              >
                <div className="action-type-name">{actionType.name}</div>
                <div className="action-type-meta">
                  <span className="version-badge">v{actionType.actionType.Version}</span>
                  <span className="type-badge">{actionType.actionType.schemaPayloadType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="detail-panel">
          {selectedActionType ? (
            <div className="detail-content">
              <div className="detail-header">
                <h2 className="detail-title">{selectedActionType.name}</h2>
                <div className="detail-badges">
                  <span className="version-badge">Version {selectedActionType.actionType.Version}</span>
                  <span className="type-badge">{selectedActionType.actionType.schemaPayloadType}</span>
                </div>
              </div>
              <div className="json-viewer">
                <div className="json-viewer-header">
                  <h3>Action Type JSON</h3>
                </div>
                <pre className="json-display">{JSON.stringify(selectedActionType, null, 2)}</pre>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>No action type selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActionTypesList

