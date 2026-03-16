import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

export default defineConfig({
  base: "/Storio-agent-checkout/",
  plugins: [react()],
  server: {
    port: 5174
  }
})
