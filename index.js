require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// routes
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
// dbConnect
const dbConnect = require("./db/connect");
// authentication middleware protect
const protect = require("./middleware/authentication");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
// extra packages
// Troubleshooting Proxy Issues - we add this because we want to deploy this to heroku then we get an IP
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());

app.get("/", (req, res) => {
  res.send("jobs api");
});

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", protect, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await dbConnect(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Your Server Is Running on PORT ${port}!`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
