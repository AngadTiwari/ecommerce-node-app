
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

export default function NavBar(){
  const { isAuthed, user, setToken, setUser } = useAuth()
  const nav = useNavigate()

  function logout(){ setToken(null); setUser(null); nav('/') }

  return (
    <nav className="nav">
      <div className="nav-inner container">
        <div className="nav-links">
          <Link className="brand" to="/">Shop</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/cart">Cart</Link>
          {/* New links */}
          <a href="/docs" target="_blank" rel="noopener noreferrer">API Docs</a>
          <a href="/health" target="_blank" rel="noopener noreferrer">Check API Health</a>

        </div>
        <div className="nav-links">
          {!isAuthed ? (
            <>
              <Link className="btn secondary" to="/login">Log in</Link>
              <Link className="btn" to="/signup">Sign up</Link>
            </>
          ) : (
            <div className="flex" style={{gap:'.5rem'}}>
              <span className="badge">{user?.name || user?.email}</span>
              <button className="btn danger" onClick={logout}>Log out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
