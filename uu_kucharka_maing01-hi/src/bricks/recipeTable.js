import { Component } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import RecipeTile from "./recipeTile";

import "./recipeTable.css";

class RecipeTable extends Component {
  constructor(props) {
    super(props);
  }

  renderData = () => {
    const { recipeData } = this.props;

    if (recipeData.length == 0) {
      return "Nic k nalezení 🙁";
    } else {
      return (
        <div>
          <Container>
            <Row xs={1} sm={2} md={3} lg={4}>
              {recipeData.map((item) => (
                <RecipeTile
                  key={item.id}
                  item={item}
                  showDetail={this.props.handleShowDetail}
                  handleSetStar={this.props.handleSetStar}
                />
              ))}
            </Row>
          </Container>
        </div>
      );
    }
  };

  render() {
    return (
      <div className="recipeTable">
        <div>{this.renderData()}</div>
      </div>
    );
  }
}

export default RecipeTable;
