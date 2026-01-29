
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthProvider'

export default function Product(){
  const { id } = useParams()
  const [p, setP] = useState(null)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const { isAuthed } = useAuth()
  const nav = useNavigate()

  useEffect(()=>{
    api.getProduct(id).then(setP).catch(e=>setMsg(String(e.message||e))).finally(()=>setLoading(false))
  },[id])

  async function add(){
    try{ await api.addToCart({ productId: id, qty: Number(qty) }); setMsg('Added to cart'); nav('/cart') }
    catch(e){ setMsg(String(e.message||e)) }
  }

  if(loading) return <p>Loading…</p>
  if(!p) return <p className="muted">{msg||'Not found'}</p>

  return (
    <div className="card" style={{maxWidth:700}}>
      <h2>{p.name}</h2>
      <p className="muted">SKU: {p.sku} • Category: {p.category}</p>
      <p>{p.description || 'No description available.'}</p>
      <div className="flex">
        <div className="price" style={{fontSize:'1.3rem'}}>₹ {p.price}</div>
        <div className="spacer" />
        <input className="input" type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)} style={{width:90}} />
        <button className="btn" onClick={()=> isAuthed ? add() : nav('/login')}>Add to Cart</button>
      </div>
      {msg && <p className="muted">{msg}</p>}
    </div>
  )
}
