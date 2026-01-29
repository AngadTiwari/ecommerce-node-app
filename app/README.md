
# React Frontend for E‑commerce API

A minimal React 18 + Vite app that connects to the Node.js e‑commerce API for **login, signup, products, cart and orders**.

## Setup

```bash
# 1) Install
npm i

# 2) Configure backend URL
cp .env.dev .env
# Set VITE_API_BASE_URL to your API, e.g. http://localhost:3000

# 3) Run
npm run dev
```

### Pages
- **Home** — product list
- **Product** — detail + add to cart *(login required to add)*
- **Login / Signup** — obtains/stores JWT
- **Cart** — view/remove items, place order *(auth)*
- **Orders** — order history *(auth)*

> The API endpoints expected are:
> `/api/auth/signup`, `/api/auth/login`, `/api/users/me`, `/api/products`, `/api/products/:id`, `/api/cart`, `/api/cart/items`, `/api/cart/items/:productId`, `/api/orders`.
