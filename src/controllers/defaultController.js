const express = require("express");
const router = express.Router();
const auth_middleware = require("../middleware/auth");

router.use(auth_middleware);

router.get("/", (req, res) => {
  res.send("Allan");
});

module.exports = (app) => app.use("/api/v1", router);
