import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/291767/pexels-photo-291767.jpeg?auto=compress&cs=tinysrgb&w=300";

class RecipeTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFavorite: false,
    };
  }

  handleClick = () => {
    this.setState((prevState) => ({
      isFavorite: !prevState.isFavorite,
    }));

    console.log("klik");
    console.log(this.props.item); // Vypisuje data receptu do konzole
  };

  render() {
    const { item, showDetail } = this.props;
    const { isFavorite } = this.state;

    return (
      <Col key={item.id} className="p-3">
        <Card border="primary">
          <Card.Img variant="top" src={item.photoUrl ? item.photoUrl : DEFAULT_IMAGE} />
          <Card.Body>
            <Card.Title>{item.name}</Card.Title>
            <Card.Text>{item.description}</Card.Text>
          </Card.Body>

          <Card.Body>
            <Button variant="primary" onClick={() => showDetail(item)}>
              Detail
            </Button>

            <Button
              variant={isFavorite ? "warning" : "primary"}
              style={{
                display: "flex",
                alignItems: "center",
                float: "right",
                color: isFavorite ? "white" : "black",
                backgroundColor: isFavorite ? "#ffd700" : "white",
                border: `1px solid ${isFavorite ? "#ffd700" : "#ffc107"}`,
              }}
              onClick={this.handleClick}
            >
              Oblibene
            </Button>
          </Card.Body>
        </Card>
      </Col>
    );
  }
}

export default RecipeTile;
