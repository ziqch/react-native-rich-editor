import React from 'react';
import type Bridge from './utils/Bridge';
import type { ResolverList } from './utils/Bridge';
import { BridgeContext } from './BridgeContextProvider';
interface IBridgeProps<SRC extends ResolverList, TRT extends ResolverList> {
  registerKey: string;
  bridge: Bridge<SRC, TRT>;
}

export const BridgeRegister = <
  SRC extends ResolverList,
  TGT extends ResolverList
>(
  props: IBridgeProps<SRC, TGT>
) => {
  const { registerKey, bridge } = props;
  const { bridges } = React.useContext(BridgeContext);
  const registered = React.useRef(false);
  if (!registered.current) {
    bridges.set(registerKey, bridge);
    registered.current = true;
  }
  return <></>;
};
