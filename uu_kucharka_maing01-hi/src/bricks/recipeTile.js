import { Component } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import IdentityContext from "../core/identity-context.js";

const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/291767/pexels-photo-291767.jpeg?auto=compress&cs=tinysrgb&w=300";

class RecipeTile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSetStar = (isFavorite) => {
    const { item, handleSetStar } = this.props;
    handleSetStar({ id: item.id, starred: !isFavorite, userId: this.context.identity.uuIdentity });
  };

  render() {
    const { item, showDetail } = this.props;
    const isFavorite = item.starred && item.starred.includes(this.context.identity.uuIdentity);

    return (
      <Col key={item.id} className="p-3">
        <Card border={"dark"}>
          <Card.Img variant="top" src={item.photoUrl ? item.photoUrl : DEFAULT_IMAGE} />
          <Card.Body>
            <Card.Title>{item.name}</Card.Title>
            <Card.Text>{item.description}</Card.Text>
          </Card.Body>

          <Card.Body className={"d-flex justify-content-between"}>
            <Button variant="outline-primary" onClick={() => showDetail(item)}>
              Detail
            </Button>
            <Button variant={isFavorite ? "warning" : "outline-warning"} onClick={() => this.handleSetStar(isFavorite)}>
              🟊
            </Button>
          </Card.Body>
        </Card>
      </Col>
    );
  }
}
RecipeTile.contextType = IdentityContext;

export default RecipeTile;
