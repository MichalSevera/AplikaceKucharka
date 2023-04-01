const path = require("path");
const Ajv = require("ajv").default;
const dao = require("../../dao/recipe-dao");
const UserUtils = require("../UserUtils");

let schema = {
  type: "object",
  properties: {},
  required: [],
};

async function RecipeAbl(req, res) {

  if (UserUtils.hasAuthority( "1-1" /* change to real user ID from incoming HTTP request  */, UserUtils.CREATOR)){
    console.log("this example user is OK")
  } else {
    console.log("this example user is not authorized!")
  }

  try {
    const recipes = await dao.listRecipes();
    setTimeout(()=>res.json(recipes), 1500); // <--- only simulates DB data fetch delay
  } catch (e) {
    res.status(500).send(e);
  }
}

module.exports = RecipeAbl;
