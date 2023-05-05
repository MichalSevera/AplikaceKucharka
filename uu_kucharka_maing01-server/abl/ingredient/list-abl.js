const dao = require("../../dao/ingredient-dao");

async function IngredientAbl(req, res) {

  try {
    const recipes = await dao.listIngredients();
    res.json(recipes);
  } catch (e) {
    res.status(500).send(e);
  }
}

module.exports = IngredientAbl;
