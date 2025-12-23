import serverless from "serverless-http";
import { app } from "../index.js";

// Export a serverless handler for Vercel
export default serverless(app);
