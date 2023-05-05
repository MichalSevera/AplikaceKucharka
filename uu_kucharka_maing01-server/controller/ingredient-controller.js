const express = require("express");
const router = express.Router();

//const DeleteAbl = require("../abl/recipe/delete-abl");
const ListAbl = require("../abl/ingredient/list-abl");

/*
const CreateAbl = require("../abl/student/create-abl");
const GetAbl = require("../abl/student/get-abl");
const UpdateAbl = require("../abl/student/update-abl");

router.post("/create", async (req, res) => {
  await CreateAbl(req, res);
});

router.get("/get", async (req, res) => {
  await GetAbl(req, res);
});

router.post("/update", async (req, res) => {
  await UpdateAbl(req, res);
});
*/
/*
router.delete("/delete", async (req, res) => {
  await DeleteAbl(req, res);
});
*/
router.get("/list", async (req, res) => {
  await ListAbl(req, res);
});

module.exports = router;
