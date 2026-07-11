const { z } = require("zod");

exports.validation = (schema) => {
  return (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send({ message: "ریکوعست بادی خالی است" });
    }

    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      return res
        .status(401)
        .json({ err: validationResult.error.flatten().fieldErrors });
    }

    next();
  };
};
