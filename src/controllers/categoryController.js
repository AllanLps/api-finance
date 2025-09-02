const express = require("express");
const router = express.Router();
const auth_middleware = require("../middleware/auth");
const prisma = require("../database");

router.use(auth_middleware);

router.get("/", async (req, res) => {
  try {
    const result = await prisma.category.findMany();
    res.status(200).json(result);
  } catch (error) {
    console.log("Error => ", error);
    res.status(403).json({ error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    console.log("userID> ", req.userId);
    console.log(req.role);

    const id = req.params.id;
    const result = await prisma.category.findFirst({
      where: { id },
      include: { user: true, transactions: true },
    });
    if (!result) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }
    const saldo = result.transactions.reduce(
      (acc, trans) => acc + trans.value,
      0
    );

    const data = { ...result, saldo };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar categoria" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, slug, icon, color, type, description, id_user, id_category } =
      req.body;

    // Verifica se campos obrigatórios estão preenchidos
    if (!name || !type || !id_user) {
      return res.status(400).json("Dados incompletos!");
    }

    // Verificação para saber se o usu[ario existe
    const user_exists = await prisma.user.findUnique({
      where: { id: id_user },
    });
    if (!user_exists) {
      return res.status(400).json({ error: "Usuário não encontrado!" });
    }
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
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar categoria" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json("ID não informado!");
    }

    const result = await prisma.category.delete({ where: { id } });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar categoria" });
  }
});

module.exports = (app) => app.use("/api/v1/category", router);
