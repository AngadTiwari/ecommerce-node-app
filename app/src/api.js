
const BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''

function getToken(){
  return localStorage.getItem('token')
}

async function req(path, { method='GET', body, auth=false }={}){
  const headers = { 'Content-Type': 'application/json' }
  if(auth){
    const token = getToken()
    if(token) headers['Authorization'] = `Bearer ${token}`
  }
  console.log('API Request:', { BASE, path, method, body, headers })
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  console.log('Raw Response:', res)
  const text = await res.text()
  let data
  try { 
    data = text ? JSON.parse(text) : {} 
    console.log('API Response:', { path, data })
  } catch {
     data = { error: text } 
     console.log('API Response (non-JSON):', { path, data })
  }
  if(!res.ok) throw new Error(data?.error || res.statusText)
  return data
}

export const api = {
  // Auth
  signup: ({ name, email, password }) => req('/api/auth/signup', { method: 'POST', body: { name, email, password } }),
  login:  ({ email, password })        => req('/api/auth/login',  { method: 'POST', body: { email, password } }),

  // Users
  me: () => req('/api/users/me', { auth: true }),

  // Products
  getProducts: ({ page=1, pageSize=20 }={}) => req(`/api/products?${new URLSearchParams({ page: String(page), pageSize: String(pageSize) })}`),
  getProduct: (id) => req(`/api/products/${id}`),

  // Cart
  getCart: () => req('/api/cart', { auth: true }),
  addToCart: ({ productId, qty }) => req('/api/cart/items', { method: 'POST', body: { productId, qty }, auth: true }),
  removeFromCart: (productId) => req(`/api/cart/items/${productId}`, { method: 'DELETE', auth: true }),

  // Orders
  placeOrder: () => req('/api/orders', { method: 'POST', auth: true }),
  listOrders: () => req('/api/orders', { auth: true }),
}
