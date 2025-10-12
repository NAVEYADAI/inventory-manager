import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [react()],
    server: {
      port: Number(env.VITE_PORT) || 3000, // תואם ל-fly.toml
      host: "0.0.0.0", // מאפשר גישה מבחוץ (נדרש ל-Fly)
      allowedHosts: [
        "inventory-manager-frontend.fly.dev", // הדומיין שלך ב-Fly
        "localhost",
        "0.0.0.0", // מוסיף תמיכה בגישה ישירה על כתובת פנימית
      ],
    },
  });
};
