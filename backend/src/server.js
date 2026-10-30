import { createApp } from "./app.js";
import { config } from "./config/env.js";

const server = createApp().listen(config.port, () => {
  console.log(`BrandGuard backend running on port ${config.port}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${config.port} is already in use. Stop the other BrandGuard server or run with PORT=<another-port> npm start.`
    );
    process.exit(1);
  }

  console.error("Failed to start the BrandGuard backend:", error.message);
  process.exit(1);
});
