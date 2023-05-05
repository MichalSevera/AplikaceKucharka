const Ajv = require("ajv").default;
const dao = require("../../dao/recipe-dao");

const userUtils = require("../UserUtils");

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    userId: { type: "string" },
    starred: { type: "boolean" }
  },
  required: ["id", "userId", "starred"],
};

function _getStars(recipe, userId, starred) {
  stars = recipe.starred ? recipe.starred : [];
  if (starred && !stars.includes(userId)){
    stars.push(userId);
  } else if (!starred) {
    stars = stars.filter(s => s !== userId);
  }
  return stars;
} 

async function SetStarAbl(req, res) {
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
    const { id, userId, starred } = req.body;
    let recipe = await dao.getRecipe(id);

    if (!recipe) {
      res.status(404).json({ errorMessage: `Recipe with id '${id}' doesn't exist.` });
      return;
    }

    recipe = await dao.updateRecipe({id: recipe.id, starred: _getStars(recipe, userId, starred)});
    res.json(recipe);

  } catch (e) {
    res.status(500).send(e.message);
  }
}

module.exports = SetStarAbl;