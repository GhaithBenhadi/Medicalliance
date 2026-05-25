import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:'24px', fontFamily:'system-ui', color:'#111' }}>
          <p style={{ fontWeight:600, marginBottom:8 }}>Une erreur est survenue</p>
          <p style={{ fontSize:13, color:'#666', maxWidth:360, textAlign:'center' }}>{this.state.error.message}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop:20, padding:'8px 20px', background:'#0272c5', color:'#fff', border:'none', borderRadius:8, cursor:'pointer' }}>
            Recharger
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
