const express = require("express");
const router = express.Router();
const auth_middleware = require("../middleware/auth");
const prisma = require("../database");

router.use(auth_middleware);

router.get("/", async (req, res) => {
  const result = await prisma.accounts.findMany();
  res.status(200).json(result);
});

router.get("/:id", async (req, res) => {
  const result = await prisma.accounts.findFirst({ where: id });
  res.status(200).json(result);
});

router.post("/", async (req, res) => {
  const { name, slug, icon, type, description, status, id_user } = req.body;

  const result = await prisma.accounts.create({
    data: { name, slug, icon, type, description, status, id_user },
  });

  res.status(200).json(result);
});

module.exports = (app) => app.use("/api/v1/account", router);
