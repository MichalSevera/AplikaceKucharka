const Ajv = require("ajv").default;
const dao = require("../../dao/ingredient-dao");

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

async function ReadAbl(req, res) {
  const ajv = new Ajv();
  const valid = ajv.validate(schema, req.query);
  if (!valid) {
    res.status(400).json({
      errorMessage: "Validation of input failed.",
      params: req.body,
      reason: ajv.errors,
    });
    return;
  }

  try {
    const { id } = req.query;
    const ingredient = await dao.getIngredient(id);

    if (!ingredient) {
      res
        .status(404)
        .json({ errorMessage: `Ingredient with id '${id}' doesn't exist.` });
      return;
    }

    res.json(ingredient);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

module.exports = ReadAbl;
