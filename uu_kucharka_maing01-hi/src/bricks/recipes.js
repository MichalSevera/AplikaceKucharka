
import {Component} from 'react';
import CreatableSelect from 'react-select/creatable';

import IdentityContext from "../core/identity-context.js";

import RecipeFilter from './recipeFilter.js';
import RecipeTable from './recipeTable.js';

import "./recipes.css";


class Recipes extends Component {

  constructor(props){  
    super(props);  
    this.state = {  
      filterData: {text: ""},       
      
      // todo modal + modaldata
      ingredientOptions : [{value: "jedna", label: "buřt"},{value: "druha", label: "cibule"}],
         
         
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

  search = () => {
    const { calls } = this.props;
    calls.listRecipes(this.state.filterData);
  }

  onPageChange = (page) => {
    //todo
  }

  handleCreate(value) {
    console.log("handleCreate", value);
    //

    return;
    setTimeout(() => {
      const newOption = {value: "123", label: value};
      setIsLoading(false);
      setOptions((prev) => [...prev, newOption]);
      setValue(newOption);
    }, 1000);
  }

  handleChange = (event) => {
    //console.log("handleChang ", event.target.id, event.target.value);

    let newData = {...this.state.filterData};
    newData[event.target.id] = event.target.value;
    this.setState({filterData: newData});
  }

  formatCreateLabel(label) {
    //return "Chci vyrobit " + label;
  }


  render() {
    console.log("props", this.props);
    //console.log("context", this.context);
    const { identity } = this.context;
    //console.log(identity);

    const { recipeData } = this.props;
    const { ingredientOptions, filterData } = this.state;

    return (<div className='page'>
      <div>Jsi ověřený uživatel: {identity.name} ({identity.uuIdentity})</div>
      <div>{this.printRights()}</div>
      <br/>
      <RecipeFilter search={this.search} handleChange={this.handleChange} inputValues={filterData} />
      <RecipeTable recipeData={recipeData} />
      <br />
      <div>a tady bude Pagination</div>
      <br /><br />
      <div>testovací select</div>


      <CreatableSelect isClearable isMulti options={ingredientOptions} 
      onCreateOption={this.handleCreate}
      onChange={this.handleChange}
      formatCreateLabel={this.formatCreateLabel}
      isValidNewOption={() => false}
      />
      
      <br /><br /><br /><br />
    </div>);
  }
}
Recipes.contextType = IdentityContext;

export default Recipes;

