import { Component } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import "./recipeFilter.css";

class RecipeFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //todo
    };
  }

  search = (e) => {
    e.preventDefault();
    this.props.search();
  };

  handleSubmit = (event) => {
    // todo možná submitovat enterem... a možná ne :)
    event.preventDefault();
    event.stopPropagation();
  };

  render() {
    const { inputValues } = this.props;
    // console.log("vals",inputValues);

    return (
      <div className="recipeFilter">
        <Form onSubmit={this.handleSubmit}>
          <Form.Group className="mb-3" controlId="text">
            <Form.Label>Text</Form.Label>
            <Form.Control
              type="text"
              value={this.props.inputValues.text}
              placeholder="vyhledávaný text"
              onChange={this.props.handleChange}
              onKeyPress={() => console.log("x")}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="starred">
            <Form.Check
              type="checkbox"
              value={this.props.inputValues.starred}
              onChange={this.props.handleChange}
              label="Oblíbené"
            />
          </Form.Group>

          <Button variant="primary" onClick={this.search}>
            Hledat
          </Button>
        </Form>
      </div>
    );
  }
}

export default RecipeFilter;
