
import {Component} from 'react';
import { withRoute } from "uu_plus4u5g02-app";
import Uu5Elements from "uu5g05-elements";

import Recipes from '../bricks/recipes.js';
import DataProvider from '../bricks/dataProvider.js';

import RouteBar from "../core/route-bar.js";

import "./home.css";


class Home extends Component {

  constructor(props){  
    super(props);  
    this.state = {  
         data: []
    }  
  }

  render() {
    const { addAlert } = this.props;

    return (<div className='page'>
      <RouteBar>naša boží appka</RouteBar>
      <h1 className='nadpis'>Enjoy our fancy recipes :)</h1>

      <DataProvider>
        <Recipes />
      </DataProvider>
      <button onClick={() => addAlert({ header: "Pozor", message: "Velký problém!", priority: "error" })}>problem</button>
      <button onClick={() => addAlert({ message: "OK", priority: "success" })}>nice</button>
      <br/><br/>
    </div>);
  }
}

const withAlert = (Component) => (props) => {
  const { addAlert } = Uu5Elements.useAlertBus();
  return <Component addAlert={addAlert} {...props} />;
};

let RoutedHome = withAlert(withRoute(Home, { authenticated: true }));

export { RoutedHome };
export default RoutedHome;
