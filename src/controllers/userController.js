const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const auth_middleware = require("../middleware/auth");
const prisma = require("../database");

router.use(auth_middleware);

router.get("/", async (req, res) => {
  const result = await prisma.user.findMany();
  res.status(200).json(result);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const result = await prisma.user.findUnique({ where: { id } });
  res.status(200).json(result);
});

router.post("/", async (req, res) => {
  const hashed_password = await bcrypt.hash(password);
  const { name, email, password } = req.body;

  const result = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });

  res.status(201).json(result);
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
