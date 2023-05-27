import { Component } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import RecipeForm from "./recipeForm";

class RecipeCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClose = () => {
    this.props.handleClose();
  };

  handleSubmit = (data) => {
    this.props.handleSubmit(data);
  };

  render() {
    const { item, handleClose } = this.props;

    return (
      <Modal show={true} size="lg" onHide={this.handleClose}>
        <RecipeForm
          title="Vytvořit recept"
          submitTitle="Vytvořit"
          ingredientData={this.props.ingredientData}
          handleClose={this.handleClose}
          handleSubmit={this.handleSubmit}
          handleIngredientCreate={this.props.handleIngredientCreate}
        />
      </Modal>
    );
  }
}

export default RecipeCreate;
