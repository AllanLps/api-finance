const express = require("express");
const router = express.Router();
const auth_middleware = require("../middleware/auth");
const prisma = require("../database");

router.use(auth_middleware);

router.get("/", async (req, res) => {
  const result = await prisma.category.findMany({ include: { user: true } });
  res.status(200).json(result);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const result = await prisma.category.findFirst({
    where: { id },
    include: { user: true, transactions: true },
  });

  let saldo = 0;

  result.transactions.map((elem) => (saldo += elem.value));

  const data = { ...result, saldo };

  res.status(200).json(data);
});

router.post("/", async (req, res) => {
  const { name, slug, icon, color, type, description, id_user, id_category } =
    req.body;

  const result = await prisma.category.create({
    data: {
      name,
      slug,
      icon,
      color,
      type,
      description,
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

  const result = await prisma.category.delete({ where: { id } });
  res.status(200).json(result);
});

module.exports = (app) => app.use("/api/v1/category", router);
