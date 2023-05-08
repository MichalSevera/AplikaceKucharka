const Ajv = require("ajv").default;
const dao = require("../../dao/recipe-dao");

const userUtils = require("../UserUtils");

let schema = { // todo some more checks, add properties!
  type: "object",
  properties: {
    data: { 
      type: "object",
      properties: {
        name: { type: "string", maxLength: 80}, 
        description: { type: "string", maxLength: 2000}
      },
      required: ["name", "description"],
      additionalProperties: false
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
      res.status(400).json({ errorMessage: "You are not allowed to create recipes." });
      return;
    } 

    // todo some more checks!

    // todo add other attributes!

    let recipe = {
      ...data,
      starred: [],
      created: new Date().toISOString(),
      createdBy: userId
    }

    recipe = await dao.createRecipe(recipe);
    res.json(recipe);

  } catch (e) {
    res.status(500).send(e.message);
  }
}

module.exports = CreateAbl;