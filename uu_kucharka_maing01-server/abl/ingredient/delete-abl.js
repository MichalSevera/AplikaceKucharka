const Ajv = require("ajv").default;
const dao = require("../../dao/ingredient-dao");
const recipeDao = require("../../dao/recipe-dao");

const userUtils = require("../UserUtils");

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    userId: { type: "string" },
  },
  required: ["id", "userId"],
};

function hasIngredient(recipe, id) {
  const ingItem = recipe.ingredients
    ? recipe.ingredients.find((i) => i.id == id)
    : undefined;
  return ingItem !== undefined;
}

async function DeleteAbl(req, res) {
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

  try {
    const { id, userId } = req.body;
    const ingredient = await dao.getIngredient(id);

    if (!ingredient) {
      res
        .status(404)
        .json({ errorMessage: `Ingredient with id '${id}' doesn't exist.` });
      return;
    }

    const isAdmin = userUtils.hasAuthority(userId, userUtils.ADMIN);

    if (isAdmin) {
      const recipes = await recipeDao._loadAllRecipes();
      const recipeWithIngredient = recipes.find((recipe) =>
        hasIngredient(recipe, id)
      );

      if (recipeWithIngredient !== undefined) {
        res.status(400).json({
          errorMessage:
            "This ingredient is in use. Delete it from recipes first.",
        });
        return;
      }

      await dao.deleteIngredient(id);
      res.json(ingredient);
    } else {
      res.status(400).json({
        errorMessage: "You are not allowed to delete this ingredient.",
      });
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
}

module.exports = DeleteAbl;
