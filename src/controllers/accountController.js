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
  const id = req.params.id;

  const result = await prisma.accounts.findFirst({
    where: { id },
    include: { transactions: true },
  });

  let receitas = 0;
  let despesas = 0;

  result.transactions.map((elem) => {
    if (elem.type === 0) {
      receitas += elem.value;
    }

    if (elem.type === 1) {
      despesas += elem.value;
    }
  });

  const saldo = (receitas - despesas) | 0;

  const data = { ...result, receitas, despesas, saldo };

  res.status(200).json(data);
});

router.post("/", async (req, res) => {
  const { name, slug, icon, type, description, status, id_user } = req.body;

  const result = await prisma.accounts.create({
    data: { name, slug, icon, type, description, status, id_user },
  });

  res.status(200).json(result);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json("Id não informado!");
  }

  const result = await prisma.accounts.delete({ where: { id } });
  res.status(200).json(result);
});

module.exports = (app) => app.use("/api/v1/account", router);
