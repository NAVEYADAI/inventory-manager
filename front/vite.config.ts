import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [react()],
    server: {
      port: Number(env.VITE_PORT) || 3000,
      host: "0.0.0.0",
      allowedHosts: [env.VITE_MY_DOMAIN ?? "", "localhost", "0.0.0.0"],
    },
  });
};
