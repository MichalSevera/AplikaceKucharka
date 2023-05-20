import { Component } from "react";
import { withRoute } from "uu_plus4u5g02-app";

import Recipes from "../bricks/recipes.js";
import DataProvider from "../bricks/dataProvider.js";

import RouteBar from "../core/route-bar.js";

import "./home.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  render() {
    return (
      <div className="page">
        <RouteBar>naša boží appka</RouteBar>
        <h1 className="nadpis">Enjoy our fancy recipes :) </h1>

        <DataProvider>
          <Recipes />
        </DataProvider>
      </div>
    );
  }
}

let RoutedHome = withRoute(Home, { authenticated: true });

export { RoutedHome };
export default RoutedHome;
