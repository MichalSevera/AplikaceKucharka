import { Component } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Select from "react-select";

import "./recipeFilter.css";

const optionMapper = (i) => ({
  value: i.id,
  label: i.name,
});

class RecipeFilter extends Component {
  constructor(props) {
    super(props);
  }

  search = (e) => {
    e.preventDefault();
    this.props.search();
  };

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  generateOptions = () => {
    return this.props.ingredientData.map(optionMapper);
  };

  render() {
    return (
      <div className="recipeFilter">
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col xs={12} sm={6} md={3} lg={3}>
              <Form.Group className="mb-3" controlId="text">
                <Form.Label>Text</Form.Label>
                <Form.Control
                  type="text"
                  value={this.props.inputValues.text}
                  placeholder="vyhledávaný text"
                  onChange={this.props.handleChange}
                />
              </Form.Group>
            </Col>

            <Col xs={12} sm={6} md={3} lg={3}>
              <Form.Group className="mb-3" controlId={"ingredient"} key={"ingredient"}>
                <Form.Label>Ingredience</Form.Label>
                <Select
                  id={"ingredient"}
                  name={"ingredient"}
                  value={this.props.inputValues.ingredient}
                  isClearable
                  placeholder={"Vyberte..."}
                  options={this.generateOptions()}
                  onChange={this.props.handleChangeOption}
                />
              </Form.Group>
            </Col>

            <Col xs={12} sm={6} md={3} lg={3}>
              <Form.Group className="mb-3" controlId="starred">
                <Form.Label>&nbsp;</Form.Label>
                <Form.Check
                  type="checkbox"
                  value={this.props.inputValues.starred}
                  onChange={this.props.handleChange}
                  label="Jen oblíbené"
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Button variant="primary" onClick={this.search}>
                Hledat
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default RecipeFilter;
