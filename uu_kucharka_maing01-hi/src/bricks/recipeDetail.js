import { Component } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import Plus4U5Elements from "uu_plus4u5g02-elements";

import IdentityContext from "../core/identity-context.js";

const SERVING_MIN = 1;
const SERVING_MAX = 12;
const SERVING_DEFAULT = 4;

class RecipeDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serving: SERVING_DEFAULT,
    };
  }

  renderIngredientRow(item, ingredientMap) {
    const { serving } = this.state;

    let ingredient = { name: "Chybná ingredience" };

    if (ingredientMap.has(item.id)) {
      ingredient = ingredientMap.get(item.id);
    }

    return (
      <div key={item.id}>
        {this.recountAmount(item.amount, serving)} {item.unit} {ingredient.name}
      </div>
    );
  }

  recountAmount(amount, serving) {
    if (!amount) return "";
    return Math.round(100 * amount * serving) / SERVING_DEFAULT / 100;
  }

  onChangeServing = (event) => {
    const { serving } = this.state;
    const newValue = event.target.value;
    if (newValue !== serving) {
      this.setState({ serving: newValue });
    }
  };

  renderIngredients() {
    const { item, ingredientData } = this.props;
    const { serving } = this.state;
    const ingredientMap = new Map(ingredientData.map((obj) => [obj.id, obj]));

    return (
      <>
        <Form.Label>Počet porcí: {serving} </Form.Label>
        <Form.Range min={SERVING_MIN} max={SERVING_MAX} value={serving} step="1" onChange={this.onChangeServing} />
        {item.ingredients.map((ing) => this.renderIngredientRow(ing, ingredientMap))}
      </>
    );
  }

  handleDelete = () => {
    const { item, handleDelete } = this.props;
    handleDelete(item);
  };

  handleEdit = () => {
    const { item, handleEdit } = this.props;
    handleEdit(item);
  };

  render() {
    const { identity } = this.context;
    const { item, handleClose } = this.props;

    const isEditable = item.createdBy === identity.uuIdentity || identity.authorities.includes("ADMIN");

    return (
      <Modal show={true} size="md" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{item.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {item.description}
          <br />
          {item.longDesc}
        </Modal.Body>
        <hr />
        <Modal.Body className={"pre"}>{item.text}</Modal.Body>
        <hr />
        {item.ingredients && item.ingredients.length > 0 ? <Modal.Body>{this.renderIngredients()}</Modal.Body> : ""}
        <Modal.Body>
          <Plus4U5Elements.PersonItem uuIdentity={item.createdBy} />
        </Modal.Body>

        <Modal.Footer>
          {isEditable && (
            <Button variant="secondary" onClick={this.handleEdit}>
              Edit
            </Button>
          )}
          {isEditable && (
            <Button variant="secondary" onClick={this.handleDelete}>
              Smazat
            </Button>
          )}
          <Button variant="primary" onClick={handleClose}>
            Zavřít
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

RecipeDetail.contextType = IdentityContext;

export default RecipeDetail;
