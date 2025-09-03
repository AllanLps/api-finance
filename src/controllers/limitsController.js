const express = require("express");
const router = express.Router();
const auth_middleware = require("../middleware/auth");
const prisma = require("../database");

router.use(auth_middleware);

router.get("/", async (req, res) => {
  try {
    const result = prisma.limits.findMany();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar limites" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await prisma.limits.findUnique({
      where: { id },
      include: { category: true, user: true },
    });
    if (!result) {
      return res.status(404).json({ error: "Limite não encontrado" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar limite" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { value, status, id_user, id_category } = req.body;

    // valida campos obrigatórios
    if (!value || !status || !id_user || !id_category) {
      return res
        .status(400)
        .json({ error: "Dados obrigatórios não informados" });
    }

    // valida se o valor é um número válido
    if (isNaN(value) || value <= 0) {
      return res.status(400).json({ error: "Valor inválido" });
    }
    // verifica se o usuário e a categoria existem
    const [user, category] = await Promise.all([
      prisma.user.findUnique({ where: { id: id_user } }),
      prisma.category.findUnique({ where: { id: id_category } }),
    ]);
    if (!user) return res.status(400).json("User não encontrado!");
    if (!category) return res.status(400).json("Categoria não encontrada!");

    const result = await prisma.limits.create({
      data: {
        value: Number(value),
        status: status || "active",
        notice,
        id_user,
        id_category,
      },
      include: { category: true, user: true },
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar limite" });
  }
});

module.exports = (app) => app.use("/api/v1/limit", router);
