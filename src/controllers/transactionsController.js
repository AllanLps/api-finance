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

    const result = await prisma.transactions.findUnique({
      where: { id: id },
      include: { category: true, account: true, user: true },
    });

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
  try {
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

    if (!value || !type || !status || !date || !id_account || !id_user) {
      return res
        .status(400)
        .json({ error: "Dados obrigatórios não informados" });
    }

    // Valida se a transação possui um valor válido, ou está zerado.
    if (isNaN(value) || value === 0) {
      return res.status(400).json({ error: "Valor inválido" });
    }

    // verifica se o tipo é válido
    const [user, account, category] = await Promise.all(
      prisma.user.findUnique({ where: { id: id_user }, select: { id: true } }),
      prisma.accounts.findUnique({
        where: { id: id_account },
        select: { id: true },
      }),
      prisma.category.findUnique({
        where: { id: id_category },
        select: { id: true },
      })
    );

    if (!user) return res.status(400).json("User não encontrado!");
    if (!account) return res.status(400).json("Conta não encontrada!");
    if (!category) return res.status(400).json("Conta não encontrada!");

    const result = await prisma.transactions.create({
      data: {
        value,
        type,
        status,
        description,
        image,
        date: new Date(date),
        id_account,
        id_category,
        id_user,
      },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar transação" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const update_data = req.body;

    delete update_data.id_user;
    delete update_data.id;

    const exists = await prisma.transactions.findUnique({ where: { id } });
    if (!exists) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }

    const result = await prisma.transactions.update({
      where: { id },
      data: update_data,
      include: { category: true, account: true },
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar transação" + error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(req.params.id);

    if (!id) {
      return res.status(400).json("ID não informado!");
    }

    const result = await prisma.transactions.delete({ where: { id } });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar transação" });
  }
});
module.exports = (app) => app.use("/api/v1/transaction", router);
