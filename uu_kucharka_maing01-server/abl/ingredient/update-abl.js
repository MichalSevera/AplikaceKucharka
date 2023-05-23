const Ajv = require("ajv").default;
const dao = require("../../dao/ingredient-dao");
const userUtils = require("../UserUtils");

let schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    id: { type: "string" },
    userId: { type: "string" },
  },
  required: ["name", "id", "userId"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
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

  const allowed = userUtils.hasAuthority(req.body.userId, userUtils.ADMIN);
  if (!allowed) {
    res
      .status(400)
      .json({ errorMessage: "You are not allowed to update ingredients." });
    return;
  }

  try {
    const ingredient = await dao.getIngredient(req.body.id);

    if (!ingredient) {
      res.status(404).json({
        errorMessage: `Ingredient with id '${req.body.id}' doesn't exist.`,
      });
      return;
    }

    ingredient.name = req.body.name;
    await dao.updateIngredient(ingredient);

    res.json(ingredient);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

module.exports = UpdateAbl;
