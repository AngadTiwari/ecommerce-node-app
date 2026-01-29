
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthProvider'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Product from './pages/Product'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Cart from './pages/Cart'
import Orders from './pages/Orders'

function Protected({ children }){
  const { isAuthed } = useAuth()
  const loc = useLocation()
  if(!isAuthed) return <Navigate to="/login" replace state={{ from: loc }} />
  return children
}

export default function App(){
  return (
    <AuthProvider>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Protected><Cart /></Protected>} />
          <Route path="/orders" element={<Protected><Orders /></Protected>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <footer>E-Commerce React App• © {new Date().getFullYear()}</footer>
      </div>
    </AuthProvider>
  )
}
