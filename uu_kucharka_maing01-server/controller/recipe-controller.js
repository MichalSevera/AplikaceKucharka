const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/recipe/create-abl");
const ReadAbl = require("../abl/recipe/read-abl");
const UpdateAbl = require("../abl/recipe/update-abl");
const DeleteAbl = require("../abl/recipe/delete-abl");
const ListAbl = require("../abl/recipe/list-abl");
const SetStarAbl = require("../abl/recipe/setStar-abl");

router.post("/create", async (req, res) => {
  await CreateAbl(req, res);
});

router.get("/read", async (req, res) => {
  await ReadAbl(req, res);
});

router.put("/update", async (req, res) => {
  await UpdateAbl(req, res);
});

router.delete("/delete", async (req, res) => {
  await DeleteAbl(req, res);
});

router.get("/list", async (req, res) => {
  await ListAbl(req, res);
});

router.put("/setstar", async (req, res) => {
  await SetStarAbl(req, res);
});

module.exports = router;
