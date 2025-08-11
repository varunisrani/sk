import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/ai-webhook': {
        target: 'https://ssdsdss.app.n8n.cloud',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai-webhook/, '/webhook/d630644b-f449-4b4a-ac21-3fd3c69e2ee7'),
        secure: true,
      },
      '/api/ai-pastor-alert': {
        target: 'https://ssdsdss.app.n8n.cloud',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai-pastor-alert/, '/webhook-test/6f7b288e-1efe-4504-a6fd-660931327269'),
        secure: true,
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
