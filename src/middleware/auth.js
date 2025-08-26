module.exports = (req, res, next) => {
  const headers = req.headers;
  console.log("Entrou no middleware", headers["ip-address"]);

  if (headers["ip-address"] === "10.4.145.00") {
    return res.json({ erro: 404, msg: "IP bloqueado." });
  }

  return next();
};
