import { useState } from 'react'
import Header from './components/Header'
import ActionTypesList from './pages/ActionTypesList'
import ActionTypes from './pages/ActionTypes'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('action-types')
  const [showCreateForm, setShowCreateForm] = useState(false)

  const handleActionTypeCreated = (newActionType) => {
    // Store the new action type in window so ActionTypesList can access it
    window.newActionTypeCreated = newActionType
    setShowCreateForm(false)
    setCurrentPage('action-types')
    // Force re-render of ActionTypesList
    setTimeout(() => {
      window.dispatchEvent(new Event('actionTypeCreated'))
    }, 100)
  }

  const renderPage = () => {
    if (showCreateForm) {
      return (
        <ActionTypes 
          onCancel={() => {
            setShowCreateForm(false)
            setCurrentPage('action-types')
          }}
          onSaveSuccess={handleActionTypeCreated}
        />
      )
    }

    switch (currentPage) {
      case 'action-types':
        return (
          <ActionTypesList 
            onCreateNew={() => setShowCreateForm(true)}
            onActionTypeCreated={handleActionTypeCreated}
          />
        )
      case 'schemas':
        return (
          <div className="main-content">
            <div className="content-container">
              <h2>Schemas</h2>
              <p>Schemas page coming soon...</p>
            </div>
          </div>
        )
      default:
        return (
          <ActionTypesList 
            onCreateNew={() => setShowCreateForm(true)}
            onActionTypeCreated={handleActionTypeCreated}
          />
        )
    }
  }

  return (
    <div className="app">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderPage()}
    </div>
  )
}

export default App
