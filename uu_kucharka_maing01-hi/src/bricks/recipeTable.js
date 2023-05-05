
import {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import './recipeTable.css';

class RecipeTable extends Component {

  constructor(props){  
    super(props);  
    this.state = {  
         showModal: false
    }  
  }

  handleClose = () => this.setState({ showModal: false });
  handleShow = (data) => this.setState({ showModal: data }); // just an example, do not use i t this way!

  renderItem = (item) => {
    return <div key={item.id}>
      <b>{item.name}</b><br/>
      {item.longDesc}<br/>
      <button onClick={() => this.handleShow(item)}>detail</button>
      <br/><br/>
      </div>;
  };

  renderData = () => {
    const { recipeData } = this.props;

    if (recipeData.length == 0){
      return "No data 🙁"; 
    } else {
      return (<div>
        <div>počet receptů: {recipeData.length}</div>
        <br/><br/>
        {recipeData.map(item => this.renderItem(item))}
        </div>);
    }
  };  

  render() {
    //console.log("props", this.props);

    let item = this.state.showModal;
    //console.log(item);

    return (<div className='recipeTable'>
      <div>já jsem komponenta RecipeTable</div>
      <br/>
      <div>{this.renderData()}</div>

      {this.state.showModal && <div>
      <Modal show={true} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{item.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{item.desc}<br/><br/>{item.longDesc}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Zavřít
          </Button>
          <Button variant="primary" onClick={this.handleClose}>
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>}

    </div>);
  }
}

export default RecipeTable;

