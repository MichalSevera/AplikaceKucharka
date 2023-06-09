"use strict";
const fs = require("fs");
const path = require("path");

const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(
  __dirname,
  "../storage/ingredients.json"
);

class IngredientsDao {
  constructor(storagePath) {
    this.ingredientsStoragePath = storagePath
      ? storagePath
      : DEFAULT_STORAGE_PATH;
  }

  async createIngredient(ingredient) {
    let ingredientsList = await this._loadAllIngredients();
    let duplicate = ingredientsList.find(
      (item) => item.name === ingredient.name
    );

    if (duplicate) {
      throw `Ingredient with name ${ingredient.name} already exists in db.`;
    }

    ingredient.id = crypto.randomBytes(8).toString("hex");
    ingredientsList.push(ingredient);

    await this._saveAllIngredients(ingredientsList);
    return ingredient;
  }

  async listIngredients() {
    let ingredientsList = await this._loadAllIngredients();
    return ingredientsList;
  }

  async getIngredient(id) {
    let ingredientsList = await this._loadAllIngredients();
    const result = ingredientsList.find((b) => b.id === id);
    return result;
  }

  async updateIngredient(ingredient) {
    let ingredientsList = await this._loadAllIngredients();

    const igredientIndex = ingredientsList.findIndex(
      (b) => b.id === ingredient.id
    );
    if (igredientIndex < 0) {
      throw new Error(`Student with given id ${student.id} does not exists.`);
    } else {
      ingredientsList[igredientIndex] = {
        ...ingredientsList[igredientIndex],
        ...ingredient,
      };
    }
    await this._saveAllIngredients(ingredientsList);
    return;
  }

  async deleteIngredient(id) {
    let ingredientsList = await this._loadAllIngredients();
    ingredientsList = ingredientsList.filter(
      (ingredient) => ingredient.id !== id
    );

    await this._saveAllIngredients(ingredientsList);
    return;
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

  async _saveAllIngredients(ingredientsList) {
    await wf(
      this._getStorageLocation(),
      JSON.stringify(ingredientsList, null, 2)
    );
  }

  _getStorageLocation() {
    return this.ingredientsStoragePath;
  }
}

module.exports = new IngredientsDao();
