import { Component } from "react";
import CreatableSelect from "react-select/creatable";
import IdentityContext from "../core/identity-context.js";

import RecipeFilter from "./recipeFilter.js";
import RecipeTable from "./recipeTable.js";
import RecipeDetail from "./recipeDetail.js";

import "./recipes.css";

class Recipes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterData: { text: "" },
      detailModal: false,
      currentPage: 1,
      recipesPerPage: 12,
      // todo modal + modaldata
      ingredientOptions: [
        { value: "jedna", label: "buřt" },
        { value: "druha", label: "cibule" },
      ],
    };
  }

  componentDidMount = function () {
    console.log("componentDidMount");
    this.props.calls.listIngredients();
  };

  printRights = () => {
    const { identity } = this.context;

    if (identity.authorities.length == 0) {
      return "Nemáš nastavena žádná práva. Smůla.";
    } else {
      return "Máš práva: " + identity.authorities.join(", ");
    }
  };

  search = () => {
    this.props.calls.listRecipes(this.state.filterData);
  };

  onPageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  handleCreate(value) {
    console.log("handleCreate", value);
    //

    return;
    setTimeout(() => {
      const newOption = { value: "123", label: value };
      setIsLoading(false);
      setOptions((prev) => [...prev, newOption]);
      setValue(newOption);
    }, 1000);
  }

  handleChange = (event) => {
    //console.log("handleChang ", event.target.id, event.target.value);

    let newData = { ...this.state.filterData };
    newData[event.target.id] = event.target.value;
    this.setState({ filterData: newData });
  };

  formatCreateLabel(label) {
    //return "Chci vyrobit " + label;
  }

  handleShowDetail = (data) => this.setState({ detailModal: data });

  handleCloseDetail = () => this.setState({ detailModal: false });

  render() {
    console.log("recipes props", this.props);
    //console.log("context", this.context);

    const { identity } = this.context;
    //console.log(identity);

    const { recipeData, ingredientData } = this.props;

    const { ingredientOptions, filterData, detailModal } = this.state;

    const { currentPage, recipesPerPage } = this.state;
    const lastRecipe = currentPage * recipesPerPage;
    const firstRecipe = lastRecipe - recipesPerPage;
    const currentRecipes = recipeData.slice(firstRecipe, lastRecipe);
    const totalPages = Math.ceil(recipeData.length / recipesPerPage);

    const toPreviousPage = () => {
      if (currentPage > 1) {
        console.log("toPreviousPage - Current Page:", currentPage);
        this.setState({ currentPage: currentPage - 1 });
      }
    };

    const toNextPage = () => {
      if (currentPage < totalPages) {
        console.log("toNextPage - Current Page:", currentPage);
        this.setState({ currentPage: currentPage + 1 });
      }
    };


    return (
      <div className="page">
        <div>
          Jsi ověřený uživatel: {identity.name} ({identity.uuIdentity})
        </div>
        <div>{this.printRights()}</div>
        <br />
        <RecipeFilter search={this.search} handleChange={this.handleChange} inputValues={filterData} />
        <RecipeTable recipeData={recipeData} ingredientData={ingredientData} handleShowDetail={this.handleShowDetail} />
        <br />
        <div className="pagination">
          <button onClick={toPreviousPage}>Předchozí</button>
          <button onClick={toNextPage}>Další</button>
        </div>
        <br />
        {detailModal ? (
          <RecipeDetail item={detailModal} ingredientData={ingredientData} handleClose={this.handleCloseDetail} />
        ) : (
          ""
        )}

        <br />
        <div>testovací select</div>

        <CreatableSelect
          isClearable
          isMulti
          options={ingredientOptions}
          onCreateOption={this.handleCreate}
          onChange={this.handleChange}
          formatCreateLabel={this.formatCreateLabel}
          isValidNewOption={() => false}
        />

        <br />
        <br />
        <br />
        <br />
      </div>
    );
  }
}
Recipes.contextType = IdentityContext;

export default Recipes;
