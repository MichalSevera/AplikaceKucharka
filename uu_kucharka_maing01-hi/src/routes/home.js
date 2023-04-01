
import {Component} from 'react';

import { Utils, createVisualComponent, useSession, Lsi } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Plus4U5Elements from "uu_plus4u5g02-elements";
import { withRoute } from "uu_plus4u5g02-app";

import Calls from "calls";

import Config from "./config/config.js";
import WelcomeRow from "../bricks/welcome-row.js";
import RouteBar from "../core/route-bar.js";
import importLsi from "../lsi/import-lsi.js";

import IdentityContext from "../core/identity-context.js";

import "./home.css";
import { Button } from 'react-bootstrap';


const Css = {
  icon: () =>
    Config.Css.css({
      fontSize: 48,
      lineHeight: "1em",
    }),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers



class Greeting extends Component {

  constructor(props){  
    super(props);  
    this.state = {  
         data: []  
      }  
  }  

  getData = () => {
    Calls.loadContent().then(responseData => this.setState({data: responseData.data})).catch(err => console.log("ERROR HAPPENED",err));
  }

  printRights = () => {
    const {identity} = this.context;
    if (identity.authorities.length == 0){
      return "Nemáš nastavena žádná práva. Smůla.";
    } else {
      return "Máš práva: " + identity.authorities.join(", ");
    }
  };

  renderItem = (item) => {
    return <div><b>{item.name}</b><br/>{item.longDesc}<br/><br/></div>;
  };

  renderData = () => {
    const { data } = this.state;
    return <div>{data.map(item => this.renderItem(item))}</div>;
  };

  render() {
    //console.log("props", this.props);
    //console.log("context", this.context);
    const {identity} = this.context;

    return (<div className='page'>
      <RouteBar>naša boží appka</RouteBar>
      <h1 className='nadpis'>Ahoj</h1>
      <div>jmenuješ se {identity.name}</div>
      <div>{this.printRights()}</div>
      <br/>
      <Button variant="success" onClick={this.getData}>get data</Button>
      <br/><br/>
      <div className='data'>{this.renderData()}</div>
    </div>);
  }
}
Greeting.contextType = IdentityContext;

let Home = withRoute(Greeting, { authenticated: true });

//@@viewOn:exports
export { Home };
export default Home;
//@@viewOff:exports
