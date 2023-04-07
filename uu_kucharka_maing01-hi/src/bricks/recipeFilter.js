
import {Component} from 'react';

import { Button } from 'react-bootstrap';

import './recipeFilter.css';

class RecipeFilter extends Component {

  constructor(props){  
    super(props);  
    this.state = {   //todo
    }  
  }  

  getData = () => { // todo rename and send some filter atttributes :)
    this.props.search();
  }

  render() {
    //console.log("props", this.props);

    return (<div className='recipeFilter'>
      <div>já jsem komponenta RecipeFilter</div>
      <br/>
      <Button variant="success" onClick={this.getData}>search</Button>
    </div>);
  }
}

export default RecipeFilter;

