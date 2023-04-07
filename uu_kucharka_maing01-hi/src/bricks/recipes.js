
import {Component} from 'react';

import IdentityContext from "../core/identity-context.js";

import RecipeFilter from './recipeFilter.js';
import RecipeTable from './recipeTable.js';

import "./recipes.css";



class Recipes extends Component {

  constructor(props){  
    super(props);  
    this.state = {  
         // todo modal + modaldata

         // todo 
      }  
  }  

  printRights = () => {
    const {identity} = this.context;
    if (identity.authorities.length == 0){
      return "Nemáš nastavena žádná práva. Smůla.";
    } else {
      return "Máš práva: " + identity.authorities.join(", ");
    }
  };

  search = (filterData) => { // nuné vymyslet, jak bude fungovat filter a pagination dohromady
    const { calls } = this.props;
    calls.listRecipes();
  }

  onPageChange = (page) => {
    //todo
  }

  render() {
    console.log("props", this.props);
    //console.log("context", this.context);
    const { identity } = this.context;
    const { recipeData } = this.props;

    return (<div className='page'>
      <div>jmenuješ se {identity.name}</div>
      <div>{this.printRights()}</div>
      <br/>
      <RecipeFilter search={this.search}/>
      <RecipeTable recipeData={recipeData} />
      <br />
      <div>a tady bude Pagination</div>
    </div>);
  }
}
Recipes.contextType = IdentityContext;

export default Recipes;

