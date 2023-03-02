import React, { FC } from 'react';
import type { ResolverList } from '../utils';
import { BridgeContext } from './BridgeContextProvider';
import { Bridge } from '../utils';
interface IBridgeRegisterProps {
  registerKey: string;
  resolverList?: ResolverList;
}

const BridgeRegister: FC<IBridgeRegisterProps> = (props) => {
  const { registerKey, resolverList } = props;
  const { bridges } = React.useContext(BridgeContext);
  const registered = React.useRef(false);
  if (!registered.current) {
    bridges.set(registerKey, new Bridge<any, any>(resolverList));
    registered.current = true;
  }
  return <></>;
};

export default BridgeRegister;
