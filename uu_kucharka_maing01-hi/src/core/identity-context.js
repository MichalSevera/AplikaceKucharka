import { createVisualComponent, useSession, Environment } from "uu5g05";
import React from "react";

import Config from "./config/config.js";

const transformIdentity = (identity) => {
  const auth = Environment.get("authorities") || [];
  const authorities = [];
  auth.forEach((item) => {
    const { authority, identities } = item;
    if (identity && identities.includes(identity.uuIdentity)) {
      authorities.push(authority);
    }
  });

  console.log("Identity", identity, authorities);

  return { ...identity, authorities };
};

const IdentityContext = React.createContext();

const IdProvider = createVisualComponent({
  uu5Tag: Config.TAG + "Id",
  propTypes: {},
  defaultProps: {},

  render(props) {
    const { identity, state } = useSession();

    return (
      <IdentityContext.Provider value={{ identity: transformIdentity(identity), state }}>
        {props.children}
      </IdentityContext.Provider>
    );
  },
});

export default IdentityContext;
export { IdProvider, IdentityContext };
