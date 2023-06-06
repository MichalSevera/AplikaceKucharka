const Ajv = require("ajv").default;
const dao = require("../../dao/recipe-dao");
const ingredientDao = require("../../dao/ingredient-dao");

const userUtils = require("../UserUtils");

const URL_PATTERN = "^(https:|http:)\\S*$"; //pls synchronizovat s FE :)

let schema = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string", maxLength: 80 },
        description: { type: "string", maxLength: 1000 },
        text: { type: "string", maxLength: 5000 },
        photoUrl: { type: "string", maxLength: 255 },
        ingredients: { type: "array" }, //TODO validate ingredients size and : {type: "integer"...}}
      },
      required: ["id", "name", "description", "text", "ingredients"],
      additionalProperties: false,
    },
    userId: { type: "string" },
  },
  required: ["data", "userId"],
};

async function UpdateAbl(req, res) {
  const ajv = new Ajv();
  const { data, userId } = req.body;
  const valid = ajv.validate(schema, req.body);

  if (!valid) {
    res.status(400).json({
      errorMessage: "Validation of input failed.",
      params: req.body,
      reason: ajv.errors,
    });
    return;
  }

  const re = new RegExp(URL_PATTERN, "i");
  const validUrl = re.test(data.photoUrl);
  if (data.photoUrl && data.photoUrl.length > 0 && !validUrl) {
    res.status(400).json({
      errorMessage: "Validation of input failed.",
      params: req.body,
      reason: "Invalid photoUrl",
    });
    return;
  }

  try {
    const recipe = await dao.getRecipe(data.id);

    const isAdmin = userUtils.hasAuthority(userId, userUtils.ADMIN);
    const isCreator = userUtils.hasAuthority(userId, userUtils.CREATOR);
    const isAuthor = recipe.createdBy === userId;

    if (!isAdmin && !(isCreator && isAuthor)) {
      res
        .status(400)
        .json({ errorMessage: "You are not allowed to update this recipe." });
      return;
    }

    let ingredients = await ingredientDao.listIngredients();

    for (element of data.ingredients) {
      const match = ingredients.find((ing) => ing.id === element.id);
      if (match === undefined) {
        res.status(400).json({
          errorMessage: "Ingredient with ID:" + element.id + " is missing.",
        });
        return;
      }
    }

    const ids = new Set(data.ingredients.map((ing) => ing.id));
    if (ids.size !== data.ingredients.length) {
      res.status(400).json({
        errorMessage: "Recipe has ingredient duplicates.",
      });
      return;
    }

    let newRecipe = {
      ...data,
      ingredients: data.ingredients.map((i) => ({
        ...i,
        amount: i.amount ? parseInt(i.amount, 10) : 0,
      })),
    };

    newRecipe = await dao.updateRecipe(newRecipe);
    res.json(newRecipe);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

module.exports = UpdateAbl;
