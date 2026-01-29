
# E‑commerce API — Node.js 24 + Azure Cosmos DB (Mongo API) + Swagger

A minimal but production‑ready e‑commerce API implementing **users, products, carts, and orders** with **JWT auth** and **Swagger/OpenAPI** docs.

## Features
- Node.js 24 + Express
- Azure Cosmos DB for MongoDB integration (official mongodb driver)
- Collections: `users`, `products`, `carts`, `orders`
- JWT auth (signup/login)
- Swagger UI at `/docs`

## Quickstart

```bash
# 1) Install
npm i

# 2) Configure env
cp .env.dev .env
# set AZURE_COSMOS_MONGO_URI, JWT_SECRET, etc.

# 3) Seed demo products (optional)
npm run seed

# 4) Run
npm run dev
# API -> http://localhost:8080
# Docs -> http://localhost:8080/docs
```

## Notes for Cosmos DB
- Ensure your App/host IP is allowed by Cosmos DB firewall.
- TLS 1.2+ required; SRV URIs handle TLS automatically; for `mongodb://` add `tls=true`.
- If using older RU‑based accounts (compat 3.6/4.0), set `COSMOS_RETRY_WRITES=false`.
- Choose shard keys when creating collections (e.g., `sku` for products, `userId` for carts/orders).
