import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  base: "/birthday-reminder-system/",
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
    coverage: {
      provider: "v8",
      include: ["src/context/Authcontext.jsx", "src/components/AuthScreen.jsx"],
      reporter: ["text", "html"],
      thresholds: {
        statements: 69,
        branches: 69,
        functions: 69,
        lines: 69,
      },
    },
  },
})
