import { Component } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

//import './recipeFilter.css';

class RecipeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        name: "",
        description: "",
        photoUrl: "",
      },
      validated: false,
    };
  }

  search = (e) => {
    e.preventDefault();
    this.props.search();
  };

  handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    console.log(event);

    this.setState({ validated: true });

    if (form.checkValidity() === true) {
      this.props.handleSubmit(this.state.formData);
    }
  };

  handleChange = (event) => {
    //console.log("handleChang ", event.target.id, event.target.value);

    let newData = { ...this.state.formData };
    newData[event.target.id] = event.target.value;

    this.setState({ formData: newData });
  };

  render() {
    const { inputValues, title, submitTitle, handleClose } = this.props;
    // console.log("vals",inputValues);

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

    /*
    return (
      <div className="recipeForm">
        <Form onSubmit={this.handleSubmit}>
          <Form.Group className="mb-3" controlId="text">
            <Form.Label>Text</Form.Label>
            <Form.Control
              type="text"
              value={this.props.inputValues.text}
              placeholder="text"
              onChange={this.handleChange}
              onKeyPress={() => console.log("x")}
            />
          </Form.Group>

          <Form.Group className="mb-3" id="formGridCheckbox">
            <Form.Check type="checkbox" label="Oblíbené" />
          </Form.Group>

          <Button variant="primary" onClick={this.search}>
            Hledat
          </Button>
        </Form>
      </div>
    );
*/
  }
}

export default RecipeForm;
