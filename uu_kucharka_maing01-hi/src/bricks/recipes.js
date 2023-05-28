import { Component } from "react";

import IdentityContext from "../core/identity-context.js";

import Button from "react-bootstrap/Button";

import RecipeFilter from "./recipeFilter.js";
import RecipeTable from "./recipeTable.js";
import RecipeDetail from "./recipeDetail.js";
import RecipeCreate from "./recipeCreate.js";
import RecipeDelete from "./recipeDelete.js";

import "./recipes.css";

const ALERT_SUCCESS_DURATION = 2500;

class Recipes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterData: { text: "" },
      detailModal: false,
      createModal: false,
      deleteModal: false,
    };
  }

  componentDidMount = function () {
    console.log("componentDidMount");
    this.props.calls.listIngredients();
    this.search();
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
    this.props.calls.listRecipes(this.state.filterData); // todo pagination
  };

  onPageChange = (page) => {
    //todo
  };

  handleShowCreate = () => {
    this.setState({ createModal: true });
  };

  handleCloseCreate = () => {
    this.setState({ createModal: false });
  };

  handleSubmitCreate = (data) => {
    const { identity } = this.context;
    let dtoIn = {
      userId: identity.uuIdentity,
      data: data,
    };

    const callback = (data) => {
      this.setState({ createModal: false });
      this.props.calls.addAlert({
        message: 'Recept "' + data.name + '" byl vytvořen.',
        priority: "success",
        durationMs: ALERT_SUCCESS_DURATION,
      });

      this.search(); // todo with current pagination
    };

    const errorCallback = (data) => {
      this.props.calls.addAlert({ header: "Chyba", message: "Vytvoření receptu selhalo.", priority: "error" });
    };

    this.props.calls.createRecipe(dtoIn, callback, errorCallback);
  };

  handleIngredientCreate = (data, formCallback) => {
    console.log("handleIngredientCreate CALLED", data);

    const { identity } = this.context;
    let dtoIn = {
      userId: identity.uuIdentity,
      name: data,
    };

    const callback = (data) => {
      this.props.calls.addAlert({
        message: 'Ingredience "' + data.name + '" byla vytvořena.',
        priority: "success",
        durationMs: ALERT_SUCCESS_DURATION,
      });
      formCallback(data);
    };

    const errorCallback = (data) => {
      this.props.calls.addAlert({ header: "Chyba", message: "Vytvoření ingredience selhalo.", priority: "error" });
    };

    this.props.calls.createIngredient(dtoIn, callback, errorCallback);
  };

  handleChange = (event) => {
    //console.log("handleChang ", event.target.id, event.target.value);

    let newData = { ...this.state.filterData };
    newData[event.target.id] = event.target.value;
    this.setState({ filterData: newData });
  };

  handleShowDetail = (data) => this.setState({ detailModal: data });

  handleCloseDetail = () => this.setState({ detailModal: false });

  handleShowDelete = (data) => {
    this.setState({ deleteModal: data, detailModal: false });
    // todo save detail data pro návrat?
  };

  handleCloseDelete = () => this.setState({ deleteModal: false });

  handleSubmitDelete = (data) => {
    const { identity } = this.context;
    let dtoIn = {
      userId: identity.uuIdentity,
      id: data.id,
    };

    const callback = (data) => {
      this.setState({ deleteModal: false });
      this.props.calls.addAlert({
        message: 'Recept "' + data.name + '" byl smazán.',
        priority: "success",
        durationMs: ALERT_SUCCESS_DURATION,
      });

      this.search(); // todo with current pagination
    };

    const errorCallback = (data) => {
      this.props.calls.addAlert({ header: "Chyba", message: "Smazání receptu selhalo.", priority: "error" });
    };

    this.props.calls.deleteRecipe(dtoIn, callback, errorCallback);
  };

  renderDetail = () => {
    const { ingredientData } = this.props;
    const { detailModal } = this.state;

    if (this.state.detailModal) {
      return (
        <RecipeDetail
          item={detailModal}
          ingredientData={ingredientData}
          handleClose={this.handleCloseDetail}
          handleDelete={this.handleShowDelete}
        />
      );
    }
  };

  renderCreate = () => {
    const { ingredientData } = this.props;
    if (this.state.createModal) {
      return (
        <RecipeCreate
          ingredientData={ingredientData}
          handleSubmit={this.handleSubmitCreate}
          handleClose={this.handleCloseCreate}
          handleIngredientCreate={this.handleIngredientCreate}
        />
      );
    }
  };

  renderDelete = () => {
    const { deleteModal } = this.state;
    if (deleteModal) {
      return (
        <RecipeDelete
          item={this.state.deleteModal}
          handleConfirm={this.handleSubmitDelete}
          handleClose={this.handleCloseDelete}
        />
      );
    }
  };

  render() {
    console.log("recipes props", this.props);
    //console.log("context", this.context);

    const { identity } = this.context;
    //console.log(identity);

    const { recipeData, ingredientData } = this.props;

    const { ingredientOptions, filterData, detailModal } = this.state;

    return (
      <div className="page">
        <div>
          Jsi ověřený uživatel: {identity.name} ({identity.uuIdentity})
        </div>
        <div>{this.printRights()}</div>
        <br />
        <Button variant="secondary" onClick={this.handleShowCreate}>
          + create
        </Button>
        <br />
        <RecipeFilter search={this.search} handleChange={this.handleChange} inputValues={filterData} />
        <RecipeTable recipeData={recipeData} ingredientData={ingredientData} handleShowDetail={this.handleShowDetail} />
        <br />
        <div>a tady bude Pagination</div>
        <br />
        {this.renderDetail()}
        {this.renderCreate()}
        {this.renderDelete()}
        <br />
      </div>
    );
  }
}
Recipes.contextType = IdentityContext;

export default Recipes;
