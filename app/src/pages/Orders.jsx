
import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Orders(){
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(()=>{
    api.listOrders().then(setOrders).catch(e=>setErr(String(e.message||e))).finally(()=>setLoading(false))
  },[])

  if(loading) return <p>Loading orders…</p>
  if(err) return <p className="muted">{err}</p>

  return (
    <div>
      <h2>Orders</h2>
      {orders.length===0 ? (
        <p className="muted">No orders yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr><th>Order</th><th>Items</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{o.items?.length || 0}</td>
                <td>₹ {o.total}</td>
                <td><span className="badge">{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
