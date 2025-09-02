const express = require("express");
const router = express.Router();
//const auth_middleware = require("../middleware/auth");
const prisma = require("../database");
const jwt = require("jsonwebtoken");

let userTest = {
  login: 654321,
  senha: 1234,
};

router.get("/", async (req, res) => {
  const result = await prisma.user.create({
    data: {
      name: "LOPINHO",
      email: "lopinho@gmail.com",
      password: "123456789",
    },
  });
  //const users = await prisma.user.findMany();
  return res.json(result);
});

router.post("/", (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  console.log({ login, password });
  if (login != userTest.login) {
    res.send("login ou senha inválidos!");
  }
  if (password != userTest.senha) {
    res.send("login ou senha inválidos!");
  }
  const token = jwt.sign({ id: userTest.login, role: "user" }, "subcruz", {
    expiresIn: 600,
  });
  res.send(token);
});

module.exports = (app) => app.use("/api/v1/auth", router);
