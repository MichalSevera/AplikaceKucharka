import React from 'react';
import {Component, Fragment} from 'react';

import Calls from "calls";

class DataProvider extends Component {

  constructor(props){  
    super(props);

    this.state = {  
         recipeData: []  
      }  
  }  

  getData = () => {
    Calls.loadContent().then(responseData => this.setState({recipeData: responseData.data})).catch(err => console.log("ERROR HAPPENED",err));
    // todo set states // OK, PENDING, ERROR
    // todo rename
  }

  // data provider bude poskytovat data pro recepty i ingredience, takže by měl data posílat v rozumné struktuře - TODO!
  // je potřeba dodržovat to, že změna v datech změní odkaz v paměti, jinak nedojde k re-renderu!

  // plus všechny obslužné metody samozřejmě odkaz nemění!

  render() {
    const {recipeData} = this.state;

    const props = {
      recipeData,
      calls: {
        listRecipes: this.getData
      }
    };

    return (<Fragment>
    { React.Children.map(this.props.children, child => React.cloneElement(child, {...props}))}
    </Fragment>);
  }
}

export default DataProvider;

