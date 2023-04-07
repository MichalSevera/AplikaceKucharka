
import {Component} from 'react';

import './recipeTable.css';

class RecipeTable extends Component {

  constructor(props){  
    super(props);  
    this.state = {   //todo
    }  
  }

  renderItem = (item) => {
    return <div key={item.id}><b>{item.name}</b><br/>{item.longDesc}<br/><br/></div>;
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

    return (<div className='recipeTable'>
      <div>já jsem komponenta RecipeTable</div>
      <br/>
      <div>{this.renderData()}</div>      
    </div>);
  }
}

export default RecipeTable;

