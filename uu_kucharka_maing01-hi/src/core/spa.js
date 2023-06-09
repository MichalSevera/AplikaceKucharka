//@@viewOn:imports
import { createVisualComponent, Utils, useSession, UU5 } from "uu5g05";
import React from "react";

import Uu5Elements from "uu5g05-elements";
import Plus4U5 from "uu_plus4u5g02";
import Plus4U5App from "uu_plus4u5g02-app";

import Config from "./config/config.js";
import Home from "../routes/home.js";

import { IdProvider } from "./identity-context.js";
//@@viewOff:imports

const ROUTE_MAP = {
  "": { redirect: "home" },
  home: (props) => <Home {...props} />,
  "*": () => (
    <Uu5Elements.Text category="story" segment="heading" type="h1">
      Not Found
    </Uu5Elements.Text>
  ),
};
//@@viewOff:constants

//@@viewOn:css
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const Spa = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Spa",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <Plus4U5.SpaProvider>  
        <Uu5Elements.ModalBus>
          <IdProvider>
            <Plus4U5App.Spa routeMap={ROUTE_MAP} />  
          </IdProvider>
        </Uu5Elements.ModalBus>
      </Plus4U5.SpaProvider>
    );
    //@@viewOff:render
  },
});


//@@viewOn:exports
export { Spa };
export default Spa;
//@@viewOff:exports
