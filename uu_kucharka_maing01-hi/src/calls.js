import { Environment } from "uu5g05";
import axios from "axios";

const CALLS_BASE_URI =
  (process.env.NODE_ENV !== "production" ? Environment.get("callsBaseUri") : null) || Environment.appBaseUri;

const instance = axios.create({
  baseURL: CALLS_BASE_URI,
});

const Calls = {
  listRecipes(dtoIn) {
    console.log("calling listRecipes", dtoIn);
    //const commandUri = Calls.getCommandUri("recipe/list");

    return instance.get("recipe/list", { params: dtoIn });
    // takhle se posilaji params:  return instance.get("recipe/list", {params: {msg: "buřt"}} );
    //return Calls.call("put", commandUri, dtoIn);
  },

  createRecipe(dtoIn) {
    console.log("calling createRecipe", dtoIn);
    return instance.post("recipe/create", dtoIn);
  },

  listIngredients(dtoIn) {
    console.log("calling listIngredients", dtoIn);
    return instance.get("ingredient/list");
  },
};

export default Calls;
