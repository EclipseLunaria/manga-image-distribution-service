import router from "./routes/routes";
import express from "express";
import process from "process";
import commonRouter from "./routes/shared";

const app = express();
const port = process.env.PORT || 6967;
app.use("/", router);
app.use("/common/", commonRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// Handle server shutdown
