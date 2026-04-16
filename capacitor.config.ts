import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mtdiesel.esquemas",
  appName: "MT DIESEL ESQUEMAS",
  webDir: "public",
  server: {
    url: "https://mt-diesel-esquemas.vercel.app",
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
