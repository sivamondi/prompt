import './Header.css'

function Header({ currentPage, onPageChange }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="header-title">Action Center - Admin Portal</h1>
        </div>
        <nav className="header-nav">
          <button 
            onClick={() => onPageChange('action-types')} 
            className={`nav-item ${currentPage === 'action-types' ? 'active' : ''}`}
          >
            Action Types
          </button>
          <button 
            onClick={() => onPageChange('schemas')} 
            className={`nav-item ${currentPage === 'schemas' ? 'active' : ''}`}
          >
            Schemas
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header

