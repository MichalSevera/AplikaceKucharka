import { Component } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import CreatableSelect from "react-select/creatable";

const AMOUNT_PREFIX = "amount-";
const UNIT_PREFIX = "unit-";

const URL_PATTERN = "^(https:|http:)S*$"; //pls synchronizovat s BE :)

//import './recipeFilter.css';

class RecipeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        name: "",
        description: "",
        photoUrl: "",
        ingredients: [],
      },
      validated: false,
    };
  }

  handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    //console.log(event);

    this.setState({ validated: true });

    // todo validity for ingredient selects, not empty !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    if (form.checkValidity() === true) {
      const data = { ...this.state.formData };
      data.ingredients = data.ingredients.map((i) => ({ amount: i.amount, id: i.ingredient.value }));

      this.props.handleSubmit(data);
    }
  };

  handleChange = (event) => {
    console.log("handleChange ", event.target.id, event.target.value);

    let newData = { ...this.state.formData };
    newData[event.target.id] = event.target.value;

    this.setState({ formData: newData });
  };

  handleAmountChange = (event) => {
    console.log("handleAmountChange ", event.target.id, event.target.value);

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

  handleChangeOption = (value, action) => {
    let result = [];

    console.log("+++", value, action, action.name);

    this.state.formData.ingredients.forEach((i) => {
      if (i.key == action.name) {
        result.push({ ...i, ingredient: value });
      } else {
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
        <Col key="select" xs={6}>
          {this.renderIngredientSelect(data)}
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

  isValidNewOption = (data) => {
    return data && data.length > 2; // todo better filter
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
          //isMulti
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
      this.handleChangeOption(this.optionMapper(data), { name: id });
    };

    this.props.handleIngredientCreate(data, callback);
  }

  optionMapper = (i) => ({
    value: i.id,
    label: i.name,
  });

  generateOptions = () => {
    return this.props.ingredientData.map(this.optionMapper);
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
              <Form.Control.Feedback type="invalid">Jujky! Asi chyba.</Form.Control.Feedback>
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
              <Form.Control.Feedback type="invalid">Ale ne!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="photoUrl">
              <Form.Label>Obrázek</Form.Label>
              <Form.Control
                type="text"
                value={formData.photoUrl}
                placeholder="URL obrázku"
                pattern="^(https:|http:)\S*$"
                onChange={this.handleChange}
              />
              <Form.Control.Feedback type="invalid">Toto je jaksi blbě.</Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>

          <Modal.Body>
            <div>Ingredience</div>
            {this.renderIngredients()}
            <Button onClick={this.handleAdd}>+ přidat</Button>
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
