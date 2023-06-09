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

  async createRecipe(recipe) {
    let recipesList = await this._loadAllRecipes();

    recipe.id = crypto.randomBytes(8).toString("hex");
    recipesList.push(recipe);
    await this._saveAllRecipes(recipesList);
    return recipe;
  }

  async getRecipe(id) {
    let recipesList = await this._loadAllRecipes();
    const result = recipesList.find((b) => b.id === id);
    return result;
  }

  async updateRecipe(recipe) {
    let recipesList = await this._loadAllRecipes();
    const recipeIndex = recipesList.findIndex((b) => b.id === recipe.id);
    if (recipeIndex < 0) {
      throw new Error(`Recipe with given id ${recipe.id} does not exists`);
    } else {
      recipesList[recipeIndex] = {
        ...recipesList[recipeIndex],
        ...recipe,
      };
    }
    await this._saveAllRecipes(recipesList);
    return recipesList[recipeIndex];
  }

  async deleteRecipe(id) {
    let recipesList = await this._loadAllRecipes();
    recipesList = recipesList.filter((recipe) => recipe.id !== id);

    await this._saveAllRecipes(recipesList);
    return;
  }

  async listRecipes(filter) {
    let recipesList = await this._loadAllRecipes();

    if (filter && Object.keys(filter).length > 0) {
      recipesList = this._filterRecipes(recipesList, filter);
    }

    recipesList.sort((a, b) => b.created.localeCompare(a.created));

    return recipesList;
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

  _filterRecipes(recipesList, filter) {
    if (filter.text) {
      recipesList = recipesList.filter(
        (item) =>
          (item.name && item.name.toLowerCase().includes(filter.text)) ||
          (item.description &&
            item.description.toLowerCase().includes(filter.text)) ||
          (item.text && item.text.toLowerCase().includes(filter.text))
      );
    }
    if (filter.ingredient) {
      recipesList = recipesList.filter(
        (item) =>
          item.ingredients &&
          item.ingredients.some((ing) => ing.id === filter.ingredient)
      );
    }
    if (filter.starred) {
      recipesList = recipesList.filter(
        (item) => item.starred && item.starred.includes(filter.starred)
      );
    }
    return recipesList;
  }

  async _saveAllRecipes(recipesList) {
    await wf(this._getStorageLocation(), JSON.stringify(recipesList, null, 2));
  }

  _getStorageLocation() {
    return this.recipeStoragePath;
  }
}

module.exports = new RecipesDao();
