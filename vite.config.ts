import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const githubPagesBase = repoName ? `/${repoName}/` : '/';
const base = process.env.GITHUB_ACTIONS === 'true' ? githubPagesBase : '/';

export default defineConfig({
  base,
  plugins: [inspectAttr(), react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
