import { Component } from "react";

import IdentityContext from "../core/identity-context.js";

import Button from "react-bootstrap/Button";

import RecipeFilter from "./recipeFilter.js";
import RecipeTable from "./recipeTable.js";
import RecipeDetail from "./recipeDetail.js";
import RecipeCreate from "./recipeCreate.js";
import RecipeEdit from "./recipeEdit.js";
import RecipeDelete from "./recipeDelete.js";
import Pagination from "./pagination.js";

import "./recipes.css";

const ALERT_SUCCESS_DURATION = 2500;
const PAGE_SIZE = 12;

class Recipes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterData: { text: "", starred: false },
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

  search = (page = 1) => {
    const { filterData } = this.state;
    const data = { "page-size": PAGE_SIZE, "page-number": page };
    if (filterData.text.length > 0) {
      data.text = filterData.text;
    }
    if (filterData.starred) {
      data.starred = this.context.identity.uuIdentity;
    }

    this.props.calls.listRecipes(data);
  };

  onPageChange = (page) => {
    this.search(page);
  };

  onRefresh = () => {
    this.search(this.props.recipePageData.pageNumber);
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

      this.onRefresh();
    };

    const errorCallback = (data) => {
      this.props.calls.addAlert({ header: "Chyba", message: "Vytvoření receptu selhalo.", priority: "error" });
    };

    this.props.calls.createRecipe(dtoIn, callback, errorCallback);
  };

  handleSubmitUpdate = (data) => {
    const { identity } = this.context;
    let dtoIn = {
      userId: identity.uuIdentity,
      data: data,
    };

    const callback = (data) => {
      this.setState({ editModal: false });
      this.props.calls.addAlert({
        message: 'Recept "' + data.name + '" byl změněn.',
        priority: "success",
        durationMs: ALERT_SUCCESS_DURATION,
      });

      this.onRefresh();
    };

    const errorCallback = (data) => {
      this.props.calls.addAlert({ header: "Chyba", message: "Úprava receptu selhala.", priority: "error" });
    };

    this.props.calls.updateRecipe(dtoIn, callback, errorCallback);
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
    let newData = { ...this.state.filterData };
    newData[event.target.id] = event.target.id === "starred" ? event.target.checked : event.target.value;

    this.setState({ filterData: newData });
  };

  handleShowDetail = (data) => this.setState({ detailModal: data });

  handleCloseDetail = () => this.setState({ detailModal: false });

  handleShowDelete = (data) => {
    this.setState({ deleteModal: data, detailModal: false });
    // todo save detail data pro návrat?
  };

  handleShowEdit = (data) => {
    this.setState({ editModal: data, detailModal: false });
  };

  handleCloseEdit = () => this.setState({ editModal: false });

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

      this.onRefresh();
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
          handleEdit={this.handleShowEdit}
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

  renderEdit = () => {
    const { ingredientData } = this.props;
    if (this.state.editModal) {
      return (
        <RecipeEdit
          item={this.state.editModal}
          ingredientData={ingredientData}
          handleSubmit={this.handleSubmitUpdate}
          handleClose={this.handleCloseEdit}
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
    const { identity } = this.context;
    const { recipeData, ingredientData, recipePageData } = this.props;

    const { filterData } = this.state;

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
        <Pagination data={recipePageData} onPageChange={this.onPageChange} />
        <br />
        {this.renderDetail()}
        {this.renderCreate()}
        {this.renderEdit()}
        {this.renderDelete()}
        <br />
      </div>
    );
  }
}
Recipes.contextType = IdentityContext;

export default Recipes;
