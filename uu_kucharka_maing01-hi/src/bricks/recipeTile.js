import { Component } from "react";
import Button from "react-bootstrap/Button";

import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

//import Icon from '@mdi/react';
//import { mdiArrowExpand } from '@mdi/js';

//import './recipeTable.css';

class RecipeTile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //<Icon path={mdiArrowExpand} size={1} color="white"/>

  render() {
    let { item, showDetail } = this.props;

    return (
      <Col key={item.id} className="p-3">
        <Card border={"primary"}>
          {item.photoUrl ? <Card.Img variant="top" src={item.photoUrl} /> : ""}
          <Card.Body>
            <Card.Title>{item.name}</Card.Title>
            <Card.Text>{item.desc}</Card.Text>
          </Card.Body>

          <Card.Body>
            <Button variant="primary" onClick={() => showDetail(item)}>
              Detail
            </Button>
          </Card.Body>
        </Card>
      </Col>
    );
  }
}

export default RecipeTile;
