const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const auth_middleware = require("../middleware/auth");
const prisma = require("../database");

router.use(auth_middleware);

router.get("/", async (req, res) => {
  try {
    const result = await prisma.usesr.findMany();
    res.status(200).json(result);
  } catch (error) {
    console.log("Error => ", error);
    res.status(403).json({ error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    // Recebe o id na requisição
    const { id } = req.params;
    // Busca o usuário unico pelo id no banco
    const result = await prisma.user.findUnique({ where: { id } });
    // caso esse usuário não exista, retorna que o mesmo não foi encontrado
    if (!result) {
      return res.status(404).json({ error: "Usuário não encontrado" + error });
    }
    // Por segurança, deletamos a senha na hora de buscar os dados.
    delete result.password;
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

router.post("/", async (req, res) => {
  try {
    // constante que recebe do corpo da requisição os dados solicitados
    const { name, email, password } = req.body;
    // condicional que verifica se os campos estão preenchidos
    if (!name || !email || !password) {
      return res.status(400).json("Dados incompletos!");
    }
    // verifica se já existe o usuário, com base no e-mail
    const existing_user = await prisma.user.findUnique({ where: { email } });
    // se já existe, retorna "email já cadastrado"
    if (existing_user) {
      return res.status(400).json({ error: "Email já cadastrado!" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashed_password = await bcrypt.hash(password, salt);

    const result = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed_password,
      },
    });

    // Remove a senha da resposta
    delete result.password;
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const update_data = {};
    const salt = await bcrypt.genSalt(12);

    if (name) update_data.name = name;
    if (email) update_data.email = email;
    if (password) update_data.password = await bcrypt.hash(password, salt);

    const result = await prisma.user.update({
      where: { id },
      data: update_data,
    });
    delete result.password;
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário:" + error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(req.params.id);

    if (!id) {
      return res.status(400).json("ID não informado!");
    }

    const result = await prisma.user.delete({ where: { id } });
    res.status(200).json(result);
  } catch (error) {
    console.log("erro => ", error);
    res.status(500).json(error);
  }
});

module.exports = (app) => app.use("/api/v1/user", router);
