const express = require("express");
const router = express.Router();
const auth_middleware = require("../middleware/auth");
const prisma = require("../database");

router.use(auth_middleware);

router.get("/", async (req, res) => {
  try {
    const result = await prisma.transactions.findMany();
    res.status(200).json(result);
  } catch (error) {
    console.log("Error => ", error);
    res.status(403).json({ error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await prisma.transactions.findUnique({ where: { id: id } });

    if (!result) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.log("Error => ", error);
    res.status(403).json({ error });
  }
});

router.post("/", async (req, res) => {
  const {
    value,
    type,
    status,
    description,
    image,
    date,
    id_account,
    id_category,
    id_user,
  } = req.body;

  const result = await prisma.transactions.create({
    data: {
      value,
      type,
      status,
      description,
      image,
      date,
      id_account,
      id_category,
      id_user,
    },
  });
  res.status(200).json(result);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json("ID não informado!");
  }

  const result = await prisma.transactions.delete({ where: { id } });
  res.status(200).json(result);
});
module.exports = (app) => app.use("/api/v1/transaction", router);
