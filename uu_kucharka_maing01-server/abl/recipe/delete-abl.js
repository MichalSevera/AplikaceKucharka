const path = require("path");
const Ajv = require("ajv").default;
const dao = require("../../dao/recipe-dao");

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

async function DeleteAbl(req, res) {
  const ajv = new Ajv();
  const valid = ajv.validate(schema, req.body);
  try {
    if (valid) {
      const recipeId = req.body.id;
      await dao.deleteRecipe(recipeId);
      res.json({});
      if (!recipeId) {
        res
          .status(400)
          .send({ error: `Recipe with id '${recipeId}' doesn't exist.` });
      }
      res.json(recipeId);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: req.body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
}

module.exports = DeleteAbl;
