const Ajv = require("ajv").default;
const dao = require("../../dao/recipe-dao");
const ingredientDao = require("../../dao/ingredient-dao");

const userUtils = require("../UserUtils");

const URL_PATTERN = "^(https:|http:)S*$"; //pls synchronizovat s FE :)

let schema = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        name: { type: "string", maxLength: 80 },
        description: { type: "string", maxLength: 2000 },
        photoUrl: { type: "string", maxLength: 255, pattern: URL_PATTERN },
        ingredients: { type: "array" }, //TODO validate ingredients size and : {type: "integer"...}}
      },
      required: ["name", "description", "ingredients"],
      additionalProperties: false,
    },
    userId: { type: "string" },
  },
  required: ["data", "userId"],
};

async function CreateAbl(req, res) {
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

  try {
    const isCreator = userUtils.hasAuthority(userId, userUtils.CREATOR);

    if (!isCreator) {
      res
        .status(400)
        .json({ errorMessage: "You are not allowed to create recipes." });
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

    // todo add other attributes!

    let recipe = {
      ...data,
      starred: [],
      ingredients: data.ingredients.map((i) => ({
        ...i,
        amount: i.amount ? parseInt(i.amount, 10) : 0,
      })),
      created: new Date().toISOString(),
      createdBy: userId,
    };

    recipe = await dao.createRecipe(recipe);
    res.json(recipe);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

module.exports = CreateAbl;
