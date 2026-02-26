import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'react-hot-toast'
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlineClipboardCopy,
  HiOutlineChevronDown,
  HiOutlineLink,
  HiOutlineUser,
  HiOutlineIdentification,
  HiOutlineLightningBolt,
} from 'react-icons/hi'
import './App.css'

const API_URL = 'http://localhost:8080'

function App() {
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [showJson, setShowJson] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResponse(null)

    const body = {}
    if (email.trim()) body.email = email.trim()
    if (phoneNumber.trim()) body.phoneNumber = phoneNumber.trim()

    if (!body.email && !body.phoneNumber) {
      toast.error('Please provide at least an email or phone number')
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_URL}/identify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`Server responded with ${res.status}`)
      const data = await res.json()
      setResponse(data)
      setHistory((prev) => [
        { request: body, response: data, timestamp: new Date() },
        ...prev.slice(0, 9),
      ])
      toast.success('Contact identified successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setEmail('')
    setPhoneNumber('')
    setResponse(null)
    setShowJson(false)
  }

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2))
    toast.success('JSON copied to clipboard!')
  }

  const loadExample = (ex) => {
    setEmail(ex.email || '')
    setPhoneNumber(ex.phone || '')
    setResponse(null)
  }



  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1a1d2e',
            border: '1px solid #e2e4ed',
            borderRadius: '12px',
            fontSize: '0.88rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <div className="app-container">
        {/* Animated Background */}
        <div className="bg-pattern" />
        <div className="bg-gradient-orb bg-orb-1" />
        <div className="bg-gradient-orb bg-orb-2" />
        <div className="bg-gradient-orb bg-orb-3" />

        {/* Navigation */}
        <motion.nav
          className="navbar"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="nav-brand">
            <img
              src="https://cdn.prod.website-files.com/679630f35dce1b20dcba7777/689ca581121dd0a7fd555a4c_Logo%20Neutral%20White.svg"
              alt="BiteSpeed"
              className="nav-logo-img"
            />
          </div>
          <div className="nav-badge">Identity Reconciliation</div>
        </motion.nav>

        {/* Hero Section */}
        <motion.section
          className="hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="hero-title">
            <span className="hero-gradient">Identify</span> & Reconcile
            <br />Customer Contacts
          </h1>
          <p className="hero-subtitle">
            Link customer identities across multiple purchases using email and phone number matching
          </p>
        </motion.section>

        {/* Main Content */}
        <div className="content-grid">
          {/* Left Column — Form */}
          <motion.div
            className="panel form-panel"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="panel-header">
              <div className="panel-icon">
                <HiOutlineSearch />
              </div>
              <div>
                <h2 className="panel-title">Identify Contact</h2>
                <p className="panel-desc">Enter email or phone to find linked contacts</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="identify-form">
              <div className="field">
                <label className="field-label">
                  <HiOutlineMail className="field-icon" />
                  Email Address
                </label>
                <input
                  type="email"
                  className="field-input"
                  placeholder="lorraine@hillvalley.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="field-label">
                  <HiOutlinePhone className="field-icon" />
                  Phone Number
                </label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="123456"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="form-actions">
                <motion.button
                  type="submit"
                  className="btn-identify"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <span className="btn-loading">
                      <span className="loader" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <HiOutlineSearch />
                      Identify
                    </>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  className="btn-clear"
                  onClick={handleClear}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <HiOutlineTrash />
                  Clear
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Right Column — Result */}
          <motion.div
            className="panel result-panel"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {response ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="panel-header">
                    <div className="panel-icon panel-icon-success">
                      <HiOutlineIdentification />
                    </div>
                    <div>
                      <h2 className="panel-title">Consolidated Contact</h2>
                      <p className="panel-desc">All linked identities merged</p>
                    </div>
                  </div>

                  {/* Primary Contact ID */}
                  <div className="result-block primary-block">
                    <div className="result-block-header">
                      <HiOutlineUser className="result-block-icon" />
                      <span>Primary Contact</span>
                    </div>
                    <div className="primary-id-display">
                      #{response.contact.primaryContatctId}
                    </div>
                  </div>

                  {/* Emails */}
                  <div className="result-block">
                    <div className="result-block-header">
                      <HiOutlineMail className="result-block-icon" />
                      <span>Emails</span>
                      <span className="count-badge">{response.contact.emails.length}</span>
                    </div>
                    <div className="tags-container">
                      {response.contact.emails.map((em, i) => (
                        <motion.span
                          key={em}
                          className={`result-tag ${i === 0 ? 'tag-primary' : 'tag-linked'}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <HiOutlineMail />
                          {em}
                          {i === 0 && <span className="primary-marker">PRIMARY</span>}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Phone Numbers */}
                  <div className="result-block">
                    <div className="result-block-header">
                      <HiOutlinePhone className="result-block-icon" />
                      <span>Phone Numbers</span>
                      <span className="count-badge">{response.contact.phoneNumbers.length}</span>
                    </div>
                    <div className="tags-container">
                      {response.contact.phoneNumbers.map((ph, i) => (
                        <motion.span
                          key={ph}
                          className={`result-tag ${i === 0 ? 'tag-primary' : 'tag-linked'}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <HiOutlinePhone />
                          {ph}
                          {i === 0 && <span className="primary-marker">PRIMARY</span>}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Secondary IDs */}
                  <div className="result-block">
                    <div className="result-block-header">
                      <HiOutlineLink className="result-block-icon" />
                      <span>Secondary Contacts</span>
                      <span className="count-badge">{response.contact.secondaryContactIds.length}</span>
                    </div>
                    <div className="tags-container">
                      {response.contact.secondaryContactIds.length > 0 ? (
                        response.contact.secondaryContactIds.map((id, i) => (
                          <motion.span
                            key={id}
                            className="result-tag tag-secondary-id"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <HiOutlineIdentification />
                            #{id}
                          </motion.span>
                        ))
                      ) : (
                        <span className="empty-state-text">No secondary contacts linked</span>
                      )}
                    </div>
                  </div>

                  {/* JSON Toggle */}
                  <div className="json-section">
                    <button
                      className="json-toggle"
                      onClick={() => setShowJson(!showJson)}
                    >
                      <HiOutlineChevronDown
                        className={`json-chevron ${showJson ? 'open' : ''}`}
                      />
                      Raw JSON Response
                    </button>
                    {showJson && (
                      <button className="json-copy" onClick={copyJson}>
                        <HiOutlineClipboardCopy /> Copy
                      </button>
                    )}
                  </div>
                  <AnimatePresence>
                    {showJson && (
                      <motion.pre
                        className="json-block"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {JSON.stringify(response, null, 2)}
                      </motion.pre>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="empty-icon">
                    <HiOutlineIdentification />
                  </div>
                  <h3>No Results Yet</h3>
                  <p>Submit an email or phone number to identify and reconcile customer contacts</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Request History */}
        {history.length > 0 && (
          <motion.section
            className="history-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <h3 className="history-title">Recent Requests</h3>
            <div className="history-list">
              {history.map((item, i) => (
                <motion.div
                  key={i}
                  className="history-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    setEmail(item.request.email || '')
                    setPhoneNumber(item.request.phoneNumber || '')
                    setResponse(item.response)
                  }}
                >
                  <div className="history-info">
                    {item.request.email && (
                      <span className="history-tag">
                        <HiOutlineMail /> {item.request.email}
                      </span>
                    )}
                    {item.request.phoneNumber && (
                      <span className="history-tag">
                        <HiOutlinePhone /> {item.request.phoneNumber}
                      </span>
                    )}
                  </div>
                  <div className="history-meta">
                    <span className="history-primary">
                      #{item.response.contact.primaryContatctId}
                    </span>
                    <span className="history-time">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}


      </div>
    </>
  )
}

export default App
