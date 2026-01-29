
import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Cart(){
  const [cart, setCart] = useState({ items: [] })
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  async function load(){
    try{ const c = await api.getCart(); setCart(c||{ items: [] }) }
    catch(e){ setErr(String(e.message||e)) }
    finally{ setLoading(false) }
  }

  useEffect(()=>{ load() },[])

  async function removeItem(productId){
    try{ await api.removeFromCart(productId); load() }
    catch(e){ alert(String(e.message||e)) }
  }

  async function placeOrder(){
    try{ const o = await api.placeOrder(); alert(`Order placed! Total: ₹ ${o.total}`); load() }
    catch(e){ alert(String(e.message||e)) }
  }

  if(loading) return <p>Loading cart…</p>
  if(err) return <p className="muted">{err}</p>

  const total = (cart.items||[]).reduce((s,i)=> s + i.price * i.qty, 0)

  return (
    <div>
      <h2>Cart</h2>
      {(!cart.items || cart.items.length===0) && <p className="muted">Your cart is empty.</p>}
      {cart.items && cart.items.length>0 && (
        <>
          <table className="table">
            <thead>
              <tr><th>Product</th><th>Qty</th><th>Price</th><th></th></tr>
            </thead>
            <tbody>
              {cart.items.map(i=> (
                <tr key={i.productId}>
                  <td>{i.name}</td>
                  <td>{i.qty}</td>
                  <td>₹ {i.price * i.qty}</td>
                  <td><button className="btn danger" onClick={()=>removeItem(i.productId)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex" style={{marginTop:'1rem'}}>
            <div className="spacer" />
            <strong>Total: ₹ {total}</strong>
            <button className="btn" onClick={placeOrder}>Place Order</button>
          </div>
        </>
      )}
    </div>
  )
}
