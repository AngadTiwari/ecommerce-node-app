
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: __dirname,                 // default, helps clarity
  base: '/',                       // or './' if you will open from file system or subpath
  build: {
    outDir: path.resolve(__dirname, '../public'), // <-- go up to parent
    emptyOutDir: true,                           // important when outDir is outside root
    assetsDir: 'assets',                         // defaults to 'assets'; customize if needed
    sourcemap: true,                             // optional for debugging
  },
  publicDir: path.resolve(__dirname, 'public'),  // optional; default is `<root>/public`
  server: {
    port: 5173
  }
})
