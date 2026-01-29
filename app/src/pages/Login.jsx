
import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthProvider'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()
  const loc = useLocation()
  const { setToken, setUser } = useAuth()

  async function submit(e){
    e.preventDefault(); setErr('')
    try{
      const { token, user } = await api.login({ email, password })
      setToken(token); setUser(user)
      nav(loc.state?.from?.pathname || '/')
    }catch(e){ setErr(String(e.message||e)) }
  }

  return (
    <div>
      <h2>Log in</h2>
      <form className="form" onSubmit={submit}>
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn" type="submit">Log in</button>
        {err && <div className="muted">{err}</div>}
        <div className="muted">No account? <Link to="/signup">Sign up</Link></div>
      </form>
    </div>
  )
}
