import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mtdiesel.esquemas",
  appName: "MT DIESEL ESQUEMAS",
  webDir: "public",
  server: {
    url: "https://mt-diesel-esquemas.vercel.app",
    cleartext: false,
    allowNavigation: [
      "mt-diesel-esquemas.vercel.app",
      "motor-schema-ai.vercel.app",
      "raw.githubusercontent.com",
      "wikipedia.org",
      "*.wikipedia.org",
      "wikimedia.org",
      "*.wikimedia.org",
      "duckduckgo.com",
      "*.duckduckgo.com"
    ],
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
