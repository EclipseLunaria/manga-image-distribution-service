import router from "./routes/routes";
import express from "express";
import process from "process";
import commonRouter from "./routes/shared";

const app = express();
const port = process.env.PORT || 6903;
app.use("/", router);
app.use("/common/", commonRouter);

app.get("/", (req, res) => {
  res.send("Distribution Service is online.");
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// Handle server shutdown
