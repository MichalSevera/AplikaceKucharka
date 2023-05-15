
import {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import RecipeTile from './recipeTile';

import './recipeTable.css';

class RecipeTable extends Component {

  constructor(props){  
    super(props);  
    this.state = {  
      detailModal: false
    }  
  }

  handleCloseDetail = () => this.setState({ detailModal: false }); // todo přesunout nahoru?
  handleShowDetail = (data) => this.setState({ detailModal: data });

  renderData = () => {
    const { recipeData } = this.props;

    if (recipeData.length == 0){
      return "No data 🙁"; 
    } else {
      return (<div>
        <div>počet receptů: {recipeData.length}</div>
        <br/><br/>
        <Container   >
          <Row xs={1} sm={2} md={3} lg={4}>{recipeData.map(item => <RecipeTile item={item} showDetail={this.handleShowDetail} />)}</Row>
        </Container>
        
        </div>);
    }
  };  

  render() {
    console.log("table props", this.props);

    let item = this.state.detailModal;
    //console.log(item);

    return (<div className='recipeTable'>
      <div>já jsem komponenta RecipeTable</div>
      <br/>
      <div>{this.renderData()}</div>

      {item && <div>
      <Modal show={true} onHide={this.handleCloseDetail}>
        <Modal.Header closeButton>
          <Modal.Title>{item.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{item.desc}<br/><br/>{item.longDesc}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleCloseDetail}>
            Zavřít
          </Button>
          <Button variant="primary" onClick={this.handleCloseDetail}>
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>}

    </div>);
  }
}

export default RecipeTable;

