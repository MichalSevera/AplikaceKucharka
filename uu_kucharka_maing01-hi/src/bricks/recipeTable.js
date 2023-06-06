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
      return "No data 🙁";
    } else {
      return (
        <div>
          <div>počet receptů: {recipeData.length}</div>
          <br />
          <br />
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
    console.log("rendering RecipeTable props", this.props);

    return (
      <div className="recipeTable">
        <div>já jsem komponenta RecipeTable</div>
        <br />
        <div>{this.renderData()}</div>
      </div>
    );
  }
}

export default RecipeTable;
