
import {Component} from 'react';
import Button from 'react-bootstrap/Button';

import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

//import './recipeTable.css';

class RecipeTile extends Component {

  constructor(props){  
    super(props);  
    this.state = {
    }  
  }

  /**
      <b>{item.name}</b><br/>
      {item.desc}<br/>
      <button onClick={() => this.handleShow(item)}>detail</button>
      <br/><br/>

            <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
   */

  render() {
    let { item } = this.props;

    return <Col key={item.id} className="p-3">

    <Card border={"primary"}>
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
        <Card.Text>{item.desc}</Card.Text>
      </Card.Body>

      <Card.Body>
        <Button variant="primary">Detail</Button>
      </Card.Body>
      </Card>
    </Col>;
  }
}

export default RecipeTile;

