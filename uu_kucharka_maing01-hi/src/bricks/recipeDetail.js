import { Component } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import Plus4U5Elements from "uu_plus4u5g02-elements";

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
        {this.recountAmount(item.amount, serving)} {ingredient.name}
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
    // should use preprepared map...
    const { item, ingredientData } = this.props;
    const { serving } = this.state;

    const ingredientMap = new Map(ingredientData.map((obj) => [obj.id, obj]));

    //console.log("im", ingredientMap);

    return (
      <>
        <Form.Label>Počet porcí: {serving} </Form.Label>
        <Form.Range min={SERVING_MIN} max={SERVING_MAX} value={serving} step="1" onChange={this.onChangeServing} />
        {item.ingredients.map((ing) => this.renderIngredientRow(ing, ingredientMap))}
      </>
    );
  }

  render() {
    // todo nicer spaces
    const { item, handleClose } = this.props;

    //console.log(item.ingredients);

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
        {item.ingredients && item.ingredients.length > 0 ? <Modal.Body>{this.renderIngredients()}</Modal.Body> : ""}
        <Modal.Body>
          <Plus4U5Elements.PersonItem uuIdentity={item.createdBy} />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Zavřít
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default RecipeDetail;
