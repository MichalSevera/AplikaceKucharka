import { Environment } from "uu5g05";
import Plus4U5 from "uu_plus4u5g02";
import axios from "axios";

// the base URI of calls for development / staging environments can be configured in *-hi/env/development.json
// (or <stagingEnv>.json), e.g.:
//   "uu5Environment": {
//     "callsBaseUri": "http://localhost:8080/vnd-app/awid"
//   }
const CALLS_BASE_URI =
  (process.env.NODE_ENV !== "production" ? Environment.get("callsBaseUri") : null) || Environment.appBaseUri;

const instance = axios.create({
    baseURL: CALLS_BASE_URI
});

const Calls = {
  async call(method, url, dtoIn, clientOptions) {
    const response = await Plus4U5.Utils.AppClient[method](url, dtoIn, clientOptions); // pouzivame AXIOS, ne AppClient
    return response.data;
  },

  // // example for mock calls
   loadContent(dtoIn) {
    console.log("calling backend with", dtoIn);
    //const commandUri = Calls.getCommandUri("recipe/list");


    return instance.get("recipe/list", {params: dtoIn});
    // takhle se posilaji params:  return instance.get("recipe/list", {params: {msg: "buřt"}} );
    //return Calls.call("put", commandUri, dtoIn);
  },

  /*
  loadIdentityProfiles() {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/initUve");
    return Calls.call("get", commandUri);
  },

  initWorkspace(dtoInData) {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/init");
    return Calls.call("post", commandUri, dtoInData);
  },

  getWorkspace() {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/get");
    return Calls.call("get", commandUri);
  },

  async initAndGetWorkspace(dtoInData) {
    await Calls.initWorkspace(dtoInData);
    return await Calls.getWorkspace();
  },
  */

  getCommandUri(useCase, baseUri = CALLS_BASE_URI) {
    return (!baseUri.endsWith("/") ? baseUri + "/" : baseUri) + (useCase.startsWith("/") ? useCase.slice(1) : useCase);
  },
};

export default Calls;
