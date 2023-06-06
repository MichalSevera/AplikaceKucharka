import { Component } from "react";
import Modal from "react-bootstrap/Modal";

import RecipeForm from "./recipeForm";

class RecipeEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClose = () => {
    this.props.handleClose();
  };

  handleSubmit = (data) => {
    this.props.handleSubmit({ ...data, id: this.props.item.id });
  };

  render() {
    const { item } = this.props;

    return (
      <Modal show={true} size="lg" onHide={this.handleClose}>
        <RecipeForm
          item={item}
          title="Upravit recept"
          submitTitle="Upravit"
          ingredientData={this.props.ingredientData}
          handleClose={this.handleClose}
          handleSubmit={this.handleSubmit}
          handleIngredientCreate={this.props.handleIngredientCreate}
        />
      </Modal>
    );
  }
}

export default RecipeEdit;
