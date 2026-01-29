
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthProvider'

export default function Signup(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()
  const { setToken, setUser } = useAuth()

  async function submit(e){
    e.preventDefault(); setErr('')
    try{
      const { token, user } = await api.signup({ name, email, password })
      setToken(token); setUser(user)
      nav('/')
    }catch(e){ setErr(String(e.message||e)) }
  }

  return (
    <div>
      <h2>Sign up</h2>
      <form className="form" onSubmit={submit}>
        <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn" type="submit">Create account</button>
        {err && <div className="muted">{err}</div>}
        <div className="muted">Already have an account? <Link to="/login">Log in</Link></div>
      </form>
    </div>
  )
}
