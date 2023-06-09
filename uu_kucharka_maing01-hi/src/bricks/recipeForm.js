import { Component } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import CreatableSelect from "react-select/creatable";

const AMOUNT_PREFIX = "amount-";
const UNIT_PREFIX = "unit-";

const URL_PATTERN = "^(https:|http:)\\S*$"; //pls synchronizovat s BE :)

const optionMapper = (i) => ({
  value: i.id,
  label: i.name,
});

class RecipeForm extends Component {
  constructor(props) {
    super(props);
    let state = {
      formData: {
        name: "",
        description: "",
        text: "",
        photoUrl: "",
        ingredients: [],
      },
      validated: false,
    };

    if (props.item) {
      const { name, description, text, photoUrl } = props.item;
      const { ingredients } = props.item;
      let formData = {
        name,
        description,
        text,
        photoUrl,
        ingredients: [],
      };
      ingredients &&
        ingredients.forEach((i) => {
          const ingredient = props.ingredientData.find((ing) => i.id == ing.id);

          if (ingredient) {
            const newItem = {
              key: window.crypto.randomUUID(),
              ingredient: optionMapper(ingredient),
              amount: i.amount,
              unit: i.unit,
            };
            formData.ingredients.push(newItem);
          } else {
            console.error("Invalid ingredient", ingredient);
          }
        });

      state.formData = { ...state.formData, ...formData };
    }

    this.state = state;
  }

  handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    this.setState({ validated: true });

    if (form.checkValidity() === true) {
      const data = { ...this.state.formData };
      data.ingredients = data.ingredients.map((i) => ({ amount: i.amount, unit: i.unit, id: i.ingredient.value }));

      this.props.handleSubmit(data);
    }
  };

  handleChange = (event) => {
    let newData = { ...this.state.formData };
    newData[event.target.id] = event.target.value;

    this.setState({ formData: newData });
  };

  handleAmountChange = (event) => {
    const result = [];
    const id = event.target.id.substring(AMOUNT_PREFIX.length);

    this.state.formData.ingredients.forEach((i) => {
      if (i.key == id) {
        result.push({ ...i, amount: event.target.value });
      } else {
        result.push(i);
      }
    });

    this.setState({ formData: { ...this.state.formData, ingredients: result } });
  };

  handleUnitChange = (event) => {
    const result = [];
    const id = event.target.id.substring(UNIT_PREFIX.length);

    this.state.formData.ingredients.forEach((i) => {
      if (i.key == id) {
        result.push({ ...i, unit: event.target.value });
      } else {
        result.push(i);
      }
    });

    this.setState({ formData: { ...this.state.formData, ingredients: result } });
  };

  handleChangeOption = (value, action) => {
    let result = [];

    this.state.formData.ingredients.forEach((i) => {
      if (i.key == action.name) {
        result.push({ ...i, ingredient: value });
      } else {
        result.push(i);
      }
    });

    this.setState({ formData: { ...this.state.formData, ingredients: result } });
  };

  deleteRow = (key) => {
    let result = [];

    this.state.formData.ingredients.forEach((i) => {
      if (i.key !== key) {
        result.push(i);
      }
    });

    this.setState({ formData: { ...this.state.formData, ingredients: result } });
  };

  renderIngredientRow = (data) => {
    return (
      <Row key={data.key}>
        <Col key="amount" xs={3}>
          {this.renderIngredientAmount(data)}
        </Col>
        <Col key="unit" xs={3}>
          {this.renderIngredientUnit(data)}
        </Col>
        <Col key="select" xs={5}>
          {this.renderIngredientSelect(data)}
        </Col>
        <Col key="del" xs={1}>
          <Button variant="secondary" onClick={() => this.deleteRow(data.key)}>
            x
          </Button>
        </Col>
      </Row>
    );
  };

  renderIngredientAmount = (data) => {
    return (
      <Form.Group className="mb-3" controlId={AMOUNT_PREFIX + data.key}>
        <Form.Control
          type="text"
          value={data.amount}
          placeholder="Počet"
          pattern="^[0-9]+$"
          onChange={this.handleAmountChange}
        />
        <Form.Control.Feedback type="invalid">Zadejte počet.</Form.Control.Feedback>
      </Form.Group>
    );
  };

  renderIngredientUnit = (data) => {
    return (
      <Form.Group className="mb-3" controlId={UNIT_PREFIX + data.key}>
        <Form.Control type="text" value={data.unit} placeholder="Jednotka" onChange={this.handleUnitChange} />
        <Form.Control.Feedback type="invalid">Zadejte jednotku.</Form.Control.Feedback>
      </Form.Group>
    );
  };

  isValidNewOption = (data) => {
    return data && data.length > 2;
  };

  renderIngredientSelect = (data) => {
    return (
      <Form.Group className="mb-3" controlId={data.key} key={data.key}>
        <CreatableSelect
          id={data.key}
          name={data.key}
          value={data.ingredient}
          isClearable
          placeholder={"Vyberte..."}
          options={this.generateOptions()}
          onCreateOption={(label) => this.handleCreateOption(label, data.key)}
          onChange={this.handleChangeOption}
          formatCreateLabel={this.formatCreateLabel}
          isValidNewOption={this.isValidNewOption}
        />
      </Form.Group>
    );
  };

  formatCreateLabel(label) {
    return 'Chci vytvořit "' + label + '"';
  }

  handleCreateOption(data, id) {
    const callback = (data) => {
      this.handleChangeOption(optionMapper(data), { name: id });
    };

    this.props.handleIngredientCreate(data, callback);
  }

  generateOptions = () => {
    return this.props.ingredientData.map(optionMapper);
  };

  renderIngredients = () => {
    return this.state.formData.ingredients.map((ingredient) => this.renderIngredientRow(ingredient));
  };

  handleAdd = () => {
    const { formData } = this.state;
    const newItem = {
      key: window.crypto.randomUUID(),
      ingredient: undefined,
      amount: "",
      unit: "",
    };
    const ingredients = [...formData.ingredients, newItem];
    this.setState({ formData: { ...formData, ingredients: ingredients } });
  };

  render() {
    const { title, submitTitle, handleClose } = this.props;
    const { formData, validated } = this.state;

    return (
      <>
        <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Název</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                required
                placeholder="Název receptu"
                onChange={this.handleChange}
              />
              <Form.Control.Feedback type="invalid">Zadejte název</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Popis</Form.Label>
              <Form.Control
                type="text"
                value={formData.description}
                required
                placeholder="Krátký popis"
                onChange={this.handleChange}
              />
              <Form.Control.Feedback type="invalid">Zadejte popis</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="photoUrl">
              <Form.Label>Obrázek</Form.Label>
              <Form.Control
                type="text"
                value={formData.photoUrl}
                placeholder="URL obrázku"
                pattern={URL_PATTERN}
                onChange={this.handleChange}
              />
              <Form.Control.Feedback type="invalid">Nevalidní url</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="text">
              <Form.Label>Text receptu</Form.Label>
              <Form.Control as="textarea" rows={5} value={formData.text} required onChange={this.handleChange} />
              <Form.Control.Feedback type="invalid">Vyplňte text receptu</Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>

          <Modal.Body>
            <div>Ingredience</div>
            {this.renderIngredients()}
            <Button variant="outline-primary" onClick={this.handleAdd}>
              + přidat
            </Button>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" type="submit">
              {submitTitle}
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Zrušit
            </Button>
          </Modal.Footer>
        </Form>
      </>
    );
  }
}

export default RecipeForm;
