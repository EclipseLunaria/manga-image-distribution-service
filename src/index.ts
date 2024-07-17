import router from "./routes/routes";
import express from "express";
import process from "process";
import commonRouter from "./routes/shared";
import { closeBrowser } from "./utils/browserGlobal";

const app = express();
const port = process.env.PORT || 6967;
app.use("/extract/", router);
app.use("/common/", commonRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// Handle server shutdown
const gracefulShutdown = async () => {
  console.log('Shutting down server...');
  await closeBrowser();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);