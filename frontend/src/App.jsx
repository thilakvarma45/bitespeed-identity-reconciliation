import { useState } from 'react'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResponse(null)

    const body = {}
    if (email.trim()) body.email = email.trim()
    if (phoneNumber.trim()) body.phoneNumber = phoneNumber.trim()

    if (!body.email && !body.phoneNumber) {
      setError('Please provide at least an email or phone number.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('http://localhost:8080/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`Server responded with ${res.status}`)
      const data = await res.json()
      setResponse(data)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setEmail('')
    setPhoneNumber('')
    setResponse(null)
    setError(null)
  }

  return (
    <div className="app">
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
      <div className="bg-glow bg-glow-3"></div>

      <header className="header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">BiteSpeed</span>
        </div>
        <p className="subtitle">Identity Reconciliation Service</p>
      </header>

      <main className="main">
        <div className="card form-card">
          <h2 className="card-title">
            <span className="card-icon">🔍</span>
            Identify Contact
          </h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="e.g. lorraine@hillvalley.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="text"
                placeholder="e.g. 123456"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="button-group">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <><span className="spinner"></span> Processing...</>
                ) : (
                  'Identify'
                )}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleClear}>
                Clear
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="card error-card">
            <div className="error-header">
              <span>⚠️</span>
              <span>Error</span>
            </div>
            <p>{error}</p>
          </div>
        )}

        {response && (
          <div className="card response-card">
            <h2 className="card-title">
              <span className="card-icon">✅</span>
              Consolidated Contact
            </h2>

            <div className="result-grid">
              <div className="result-item primary-id">
                <span className="result-label">Primary Contact ID</span>
                <span className="result-value highlight">{response.contact.primaryContatctId}</span>
              </div>

              <div className="result-item">
                <span className="result-label">Emails</span>
                <div className="tag-list">
                  {response.contact.emails.map((em, i) => (
                    <span key={i} className={`tag ${i === 0 ? 'tag-primary' : 'tag-secondary'}`}>
                      {em}
                      {i === 0 && <span className="tag-badge">primary</span>}
                    </span>
                  ))}
                </div>
              </div>

              <div className="result-item">
                <span className="result-label">Phone Numbers</span>
                <div className="tag-list">
                  {response.contact.phoneNumbers.map((ph, i) => (
                    <span key={i} className={`tag ${i === 0 ? 'tag-primary' : 'tag-secondary'}`}>
                      {ph}
                      {i === 0 && <span className="tag-badge">primary</span>}
                    </span>
                  ))}
                </div>
              </div>

              <div className="result-item">
                <span className="result-label">Secondary Contact IDs</span>
                <div className="tag-list">
                  {response.contact.secondaryContactIds.length > 0 ? (
                    response.contact.secondaryContactIds.map((id, i) => (
                      <span key={i} className="tag tag-id">{id}</span>
                    ))
                  ) : (
                    <span className="empty-text">None</span>
                  )}
                </div>
              </div>
            </div>

            <details className="raw-json">
              <summary>View Raw JSON</summary>
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </details>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>BiteSpeed Identity Reconciliation • Built with Spring Boot & React</p>
      </footer>
    </div>
  )
}

export default App
