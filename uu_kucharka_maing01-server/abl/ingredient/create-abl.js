const Ajv = require("ajv").default;
const dao = require("../../dao/ingredient-dao");
const userUtils = require("../UserUtils");

let schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    userId: { type: "string" },
  },
  required: ["name", "userId"],
};

async function CreateAbl(req, res) {
  const ajv = new Ajv();
  const valid = ajv.validate(schema, req.body);

  if (!valid) {
    res.status(400).json({
      errorMessage: "Validation of input failed.",
      params: req.body,
      reason: ajv.errors,
    });
    return;
  }

  const allowed =
    userUtils.hasAuthority(req.body.userId, userUtils.CREATOR) ||
    userUtils.hasAuthority(req.body.userId, userUtils.ADMIN);
  if (!allowed) {
    res
      .status(400)
      .json({ errorMessage: "You are not allowed to create ingredients." });
    return;
  }

  try {
    let ingredient = {
      name: req.body.name,
      created: new Date().toISOString(),
      createdBy: req.body.userId,
    };
    ingredient = await dao.createIngredient(ingredient);
    res.json(ingredient);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

module.exports = CreateAbl;
