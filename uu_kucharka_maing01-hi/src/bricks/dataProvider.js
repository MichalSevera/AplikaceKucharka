import React from "react";
import { Component } from "react";
import Uu5Elements from "uu5g05-elements";

import Calls from "calls";

class DataProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recipeData: [],
      ingredientData: [],
    };
  }

  listRecipesCall = (dtoIn) => {
    Calls.listRecipes(dtoIn)
      .then((responseData) => {
        //console.log("data:", responseData.data);

        this.setState({ recipeData: responseData.data.data }); // different incomming structure
        // todo set pagination to state!!!
      })
      .catch((err) => console.log("RECIPE ERROR HAPPENED", err));
    // todo set states // OK, PENDING, ERROR
    // todo handle errors
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

  listIngedientCall = (dtoIn) => {
    Calls.listIngredients(dtoIn)
      .then((responseData) => {
        this.setState({ ingredientData: responseData.data });
      })
      .catch((err) => console.log("INGREDIENT ERROR HAPPENED", err));
    // todo set states // OK, PENDING, ERROR
    // todo handle errors
  };

  // data provider bude poskytovat data pro recepty i ingredience, takže by měl data posílat v rozumné struktuře - TODO!
  // je potřeba dodržovat to, že změna v datech změní odkaz v paměti, jinak nedojde k re-renderu!

  // plus všechny obslužné metody samozřejmě odkaz nemění!

  addAlert = (data) => {
    this.props.addAlert(data);
  };

  render() {
    const { recipeData, ingredientData } = this.state;

    const props = {
      recipeData,
      ingredientData,
      calls: {
        listRecipes: this.listRecipesCall,
        createRecipe: this.createRecipeCall,
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
