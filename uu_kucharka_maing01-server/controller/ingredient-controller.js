const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/ingredient/create-abl");
const ReadAbl = require("../abl/ingredient/read-abl");
const ListAbl = require("../abl/ingredient/list-abl");
const DeleteAbl = require("../abl/ingredient/delete-abl");

router.post("/create", async (req, res) => {
  await CreateAbl(req, res);
});

router.get("/read", async (req, res) => {
  await ReadAbl(req, res);
});

router.get("/list", async (req, res) => {
  await ListAbl(req, res);
});

/*
router.post("/update", async (req, res) => {
  await UpdateAbl(req, res);
});
*/

router.delete("/delete", async (req, res) => {
  await DeleteAbl(req, res);
});

module.exports = router;
