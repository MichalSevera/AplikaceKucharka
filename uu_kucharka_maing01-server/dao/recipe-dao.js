"use strict";
const fs = require("fs");
const path = require("path");

const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "../storage/recipes.json");

class RecipesDao {
  constructor(storagePath) {
    this.recipeStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
  }

  async listRecipes() {
    let recipesList = await this._loadAllRecipes();
    return recipesList;
  }

  async getRecipe(id) {
    let recipesList = await this._loadAllRecipes();
    const result = recipesList.find((b) => b.id === id);
    return result;
  }

  async deleteRecipe(id) {
    let recipesList = await this._loadAllRecipes();
    recipesList = recipesList.filter(recipe => recipe.id !== id);

    await wf(this._getStorageLocation(), JSON.stringify(recipesList, null, 2));
    return;
  }

  async _loadAllRecipes() {
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
    return this.recipeStoragePath;
  }
}

module.exports = new RecipesDao();
