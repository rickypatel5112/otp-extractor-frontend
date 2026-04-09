import fs from "node:fs";
import path from "node:path";
import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Paths to your certs
const keyPath = path.resolve(__dirname, "localhost-key.pem");
const certPath = path.resolve(__dirname, "localhost.pem");

const httpsOptions =
	fs.existsSync(keyPath) && fs.existsSync(certPath)
		? {
				key: fs.readFileSync(keyPath),
				cert: fs.readFileSync(certPath),
			}
		: undefined;

console.log(httpsOptions ? "Starting Vite in HTTPS mode 🔒" : "Starting Vite in HTTP mode 🌐");

export default defineConfig({
	plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
	server: {
		https: httpsOptions,
	},
});
