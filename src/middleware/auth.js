const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const headers = req.headers;
  const authorization = headers.authorization;

  if (!authorization) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const parts = authorization.split(" ");
  if (!parts.length === 2) {
    return res.status(401).json({ error: "Token inválido" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: "Token mal formatado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido" });
    }

    req.userId = decoded.id;
    req.role = decoded.role;

    return next();
  });
};
