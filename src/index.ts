import mongoose from "mongoose";

import { createApp } from "./app.js";
import { config } from "./config.js";

await mongoose.connect(config.mongoUri);

createApp().listen(config.port, () => {
  console.log(`Trim API listening on http://localhost:${config.port}`);
});
