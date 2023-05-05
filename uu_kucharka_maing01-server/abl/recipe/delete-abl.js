const path = require("path");
const Ajv = require("ajv").default;
const dao = require("../../dao/recipe-dao");

const userUtils = require("../UserUtils");

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    userId: { type: "string" },
  },
  required: ["id", "userId"],
};

async function DeleteAbl(req, res) {
  const ajv = new Ajv();
  const valid = ajv.validate(schema, req.body);

  if (!valid) {
    res.status(400).json({
      errorSaussage: "Validation of input failed.",
      params: req.body,
      reason: ajv.errors,
    });
    return;
  }

  try {
    const { id, userId } = req.body;
    const recipe = await dao.getRecipe(id);

    if (!recipe) {
      res.status(404).json({ errorMessage: `Recipe with id '${id}' doesn't exist.` });
      return;
    }

    const isAdmin = userUtils.hasAuthority(userId, userUtils.ADMIN);
    const isCreator = userUtils.hasAuthority(userId, userUtils.CREATOR);
    const isAuthor = recipe.createdBy === userId;

    if (isAdmin || (isCreator && isAuthor)) {
      await dao.deleteRecipe(id);
      res.json(recipe);
    } else {
      res.status(400).json({ errorMessage: "You are not allowed to delete this recipe." });
    }

  } catch (e) {
    res.status(500).send(e.message);
  }
}

module.exports = DeleteAbl;