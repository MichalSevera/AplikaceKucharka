"use strict";
const fs = require("fs");
const path = require("path");

const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "../storage/ingredients.json");

class IngredientsDao {
  constructor(storagePath) {
    this.ingredientsStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
  }

  async listIngredients() {
    let ingredientsList = await this._loadAllIngredients();
    return ingredientsList;
  }

  async _loadAllIngredients() {
    let resultList;
    try {
      resultList = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === "ENOENT") {
        console.error("No storage found at " + this._getStorageLocation());
      }
      throw new Error(
          "Unable to read from storage. " + this._getStorageLocation()
      );
    }
    return resultList;
  }

  _getStorageLocation() {
    return this.ingredientsStoragePath;
  }
}

module.exports = new IngredientsDao();
