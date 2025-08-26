const express = require("express");
const router = express.Router();
const auth_middleware = require("../middleware/auth");
const prisma = require("../database");

router.use(auth_middleware);

router.get("/", async (req, res) => {
  const result = await prisma.goals.findMany();
  res.status(200).json(result);
});

router.get("/:id", async (req, res) => {
  const result = await prisma.goals.findFirst({ where: id });
  res.status(200).json(result);
});

router.post("/", async (req, res) => {
  const {
    name,
    slug,
    icon,
    description,
    value,
    color,
    status,
    deadline,
    id_user,
    id_category,
  } = req.body;

  const result = await prisma.goals.create({
    data: {
      name,
      slug,
      icon,
      description,
      value,
      color,
      status,
      deadline,
      id_user,
      id_category,
    },
  });
  res.status(201).json(result);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json("ID não informado!");
  }
  const result = await prisma.goals.delete({ where: { id } });
  res.status(200).json(result);
});
module.exports = (app) => app.use("/api/v1/goal", router);
