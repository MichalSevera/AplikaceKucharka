import React from "react";
import { Component } from "react";
import Uu5Elements from "uu5g05-elements";

import Calls from "calls";

class DataProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recipeData: [],
      recipePageData: {
        pageNumber: 1,
        pageSize: 3,
        totalItems: 0,
        totalPages: 0,
      },
      ingredientData: [],
    };
  }

  listRecipesCall = (dtoIn) => {
    Calls.listRecipes(dtoIn)
      .then((responseData) => {
        this.setState({ recipeData: responseData.data.data, recipePageData: responseData.data.pagination });
      })
      .catch((err) => console.log("RECIPE ERROR HAPPENED", err));
  };

  createRecipeCall = (dtoIn, callback, errorCallback) => {
    Calls.createRecipe(dtoIn)
      .then((responseData) => {
        callback && callback(responseData.data);
      })
      .catch((err) => {
        console.log("RECIPE ERROR HAPPENED", err);
        errorCallback && errorCallback(err);
      });
  };

  updateRecipeCall = (dtoIn, callback, errorCallback) => {
    Calls.updateRecipe(dtoIn)
      .then((responseData) => {
        callback && callback(responseData.data);
      })
      .catch((err) => {
        console.log("RECIPE ERROR HAPPENED", err);
        errorCallback && errorCallback(err);
      });
  };

  deleteRecipeCall = (dtoIn, callback, errorCallback) => {
    Calls.deleteRecipe(dtoIn)
      .then((responseData) => {
        callback && callback(responseData.data);
      })
      .catch((err) => {
        console.log("RECIPE ERROR HAPPENED", err);
        errorCallback && errorCallback(err);
      });
  };

  setStarCall = (dtoIn, callback, errorCallback) => {
    Calls.setStar(dtoIn)
      .then((responseData) => {
        const arr = [];
        this.state.recipeData.forEach((recipe) => {
          if (recipe.id === responseData.data.id) {
            arr.push(responseData.data);
          } else {
            arr.push(recipe);
          }
        });
        this.setState({ recipeData: arr });

        callback && callback(responseData.data);
      })
      .catch((err) => {
        console.log("RECIPE ERROR HAPPENED", err);
        errorCallback && errorCallback(err);
      });
  };

  _sortIngredients = (data) => {
    data.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
    return data;
  };

  createIngredientCall = (dtoIn, callback, errorCallback) => {
    Calls.createIngredient(dtoIn)
      .then((responseData) => {
        this.setState({ ingredientData: this._sortIngredients([...this.state.ingredientData, responseData.data]) });
        callback && callback(responseData.data);
      })
      .catch((err) => {
        console.log("INGREDIENT ERROR HAPPENED", err);
        errorCallback && errorCallback(err);
      });
  };

  listIngedientCall = (dtoIn) => {
    Calls.listIngredients(dtoIn)
      .then((responseData) => {
        this.setState({ ingredientData: this._sortIngredients(responseData.data) });
      })
      .catch((err) => console.log("INGREDIENT ERROR HAPPENED", err));
  };

  addAlert = (data) => {
    this.props.addAlert(data);
  };

  render() {
    const { recipeData, ingredientData, recipePageData } = this.state;

    const props = {
      recipeData,
      recipePageData,
      ingredientData,
      calls: {
        listRecipes: this.listRecipesCall,
        createRecipe: this.createRecipeCall,
        updateRecipe: this.updateRecipeCall,
        deleteRecipe: this.deleteRecipeCall,
        setStar: this.setStarCall,
        createIngredient: this.createIngredientCall,
        listIngredients: this.listIngedientCall,
        addAlert: this.addAlert,
      },
    };

    return <>{React.Children.map(this.props.children, (child) => React.cloneElement(child, { ...props }))}</>;
  }
}

const withAlert = (Component) => (props) => {
  const { addAlert } = Uu5Elements.useAlertBus();
  return <Component addAlert={addAlert} {...props} />;
};

const AlertedDataProvider = withAlert(DataProvider);

export default AlertedDataProvider;
