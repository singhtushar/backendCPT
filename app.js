require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./db/connectDB");
const app = express();
app.use(express.json());
app.use(cors());
const authRoute = require("./routes/auth");
app.use("/Api", authRoute);
app.get("/*", (req, res) => {
    res.send("server is working,Enter a correct endpoint for the url");
  });
const port = process.env.PORT || 8004;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});