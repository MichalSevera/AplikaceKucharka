const Ajv = require("ajv").default;
const dao = require("../../dao/recipe-dao");

let schema = {
  type: "object",
  properties: {
    "page-size": {
      type: "string", 
      pattern: "^[0-9]{1,3}$"
    },
    "page-number": {
      type: "string", 
      pattern: "^[0-9]{1,5}$"
    },
    "text": {type: "string"}
  },
  required: [],
};

function paginate(array, pageSize, pageNumber) {
  // pagination je od jedne, ale pole cislujeme od nuly
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

async function ListAbl(req, res) {

  //console.log("Query params", req.query);

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

  let pageNumber = req.query["page-number"] ? parseInt(req.query["page-number"], 10) : 1; // todo make named constants
  let pageSize = req.query["page-size"] ? parseInt(req.query["page-size"], 10) : 24;
  //console.log("page", pageNumber, pageSize);

  let filter = {};
  const { text } = req.query;
  if (text) {
    filter.text = text.toLowerCase();
  }

  try {
    let recipes = await dao.listRecipes(filter); // todo some filtering
    recipesPage = paginate(recipes, pageSize, pageNumber);

    let result = {
      data: recipesPage,
      pagination: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        totalItems: recipes.length,
        totalPages: Math.ceil(recipes.length / pageSize)
      }
    };

    setTimeout(()=>res.json(result), 750); // <--- only simulates DB data fetch delay

  } catch (e) {
    res.status(500).send(e);
  }
}

module.exports = ListAbl;
