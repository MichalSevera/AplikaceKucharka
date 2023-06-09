const Ajv = require("ajv").default;
const dao = require("../../dao/recipe-dao");

let schema = {
  type: "object",
  properties: {
    "page-size": {
      type: "string",
      pattern: "^[0-9]{1,3}$",
    },
    "page-number": {
      type: "string",
      pattern: "^[0-9]{1,5}$",
    },
    ingredient: {
      type: "string",
    },
    starred: {
      type: "string",
    },
    text: { type: "string" },
  },
  required: [],
};

function paginate(array, pageSize, pageNumber) {
  // pagination je od jedne, ale pole cislujeme od nuly
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

async function ListAbl(req, res) {
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

  let pageNumber = req.query["page-number"]
    ? parseInt(req.query["page-number"], 10)
    : 1;
  let pageSize = req.query["page-size"]
    ? parseInt(req.query["page-size"], 10)
    : 24;

  let filter = {};
  const { text, ingredient, starred } = req.query;
  if (text) {
    filter.text = text.toLowerCase();
  }
  if (ingredient) {
    filter.ingredient = ingredient;
  }
  if (starred) {
    filter.starred = starred;
  }

  try {
    let recipes = await dao.listRecipes(filter);
    recipesPage = paginate(recipes, pageSize, pageNumber);

    let result = {
      data: recipesPage,
      pagination: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        totalItems: recipes.length,
        totalPages: Math.ceil(recipes.length / pageSize),
      },
    };

    setTimeout(() => res.json(result), 150); // <--- only simulates DB data fetch delay
  } catch (e) {
    res.status(500).send(e);
  }
}

module.exports = ListAbl;
