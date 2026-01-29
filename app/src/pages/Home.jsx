
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

export default function Home(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(()=>{
    let mounted = true
    api.getProducts().then(d=>{ if(!mounted) return; setItems(d.items||[]) })
      .catch(e=>setError(String(e.message||e))).finally(()=>setLoading(false))
    return ()=>{ mounted=false }
  },[])

  if(loading) return <p>Loading products…</p>
  if(error) return <p className="muted">{error}</p>

  const fallbackSrc = './images/no-product.jpg'; // hosted from /public

  return (
    <div>
      <h2>Products</h2>
      <div className="card-grid">
        {items.map(p => (
          <div className="card" key={p._id}>
            <div style={{height:150, background:'#0f172a', borderRadius:8}}>
              <img
                src={p.url}
                alt={p.name || 'Product image'}
                onError={(e) => {
                  if (e.currentTarget.src !== window.location.origin + fallbackSrc) {
                    e.currentTarget.src = fallbackSrc;
                  }
                }}
                style={{
                  width: '100%',
                  height: 150,
                  objectFit: 'cover',
                  borderRadius: 8,
                  background: '#f6f7f9'
                }}
                loading="lazy"
                decoding="async"
              />
            </div>
            <h3>{p.name}</h3>
            <div className="muted">SKU: {p.sku}</div>
            <div className="price">₹ {p.price}</div>
            <Link className="btn" to={`/product/${p._id}`}>View</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
