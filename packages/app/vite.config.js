import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
     build: {
         rollupOptions: {
             input: {
                 main: resolve(__dirname, 'index.html')
            },
         },
     },

    server: {
        proxy: {
            "/api": "http://localhost:3000",
            "/auth": "http://localhost:3000",
            "/images": "http://localhost:3000",
            "/login": "http://localhost:3000",
            "/register": "http://localhost:3000"
        }
    }
});



