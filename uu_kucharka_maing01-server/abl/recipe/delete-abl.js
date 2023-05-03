const path = require("path");
const Ajv = require("ajv").default;
const dao = require("../../dao/recipe-dao");

const userUtils = require("../UserUtils");

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
      const { recipeId, userId } = req.body;
      const recipe = await dao.getRecipe(recipeId);

      if (!recipe) {
        res
          .status(404)
          .send({ error: `Recipe with id '${recipeId}' doesn't exist.` });
        return;
      }

      const isAdmin = userUtils.hasAuthority(userId, userUtils.ADMIN);
      const isCreator = userUtils.hasAuthority(userId, userUtils.CREATOR);
      const isAuthor = recipe.createdBy === userId;

      if (isAdmin || (isCreator && isAuthor)) {
        await dao.deleteRecipe(recipeId);

        res.json({ recipe });
      } else {
        res.json({ message: "You are not allowed to delete this recipe" });
      }
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
