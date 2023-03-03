import React from 'react';
import type { Bridge, ResolverList } from '../../utils';
import { BridgeContext } from '../BridgeContextProvider';
export const useBridge = <SRC extends ResolverList, TGT extends ResolverList>(
  registerKey: string
) => {
  const { getBridge } = React.useContext(BridgeContext);
  return React.useMemo(() => {
    return getBridge(registerKey) as Bridge<SRC, TGT>;
  }, [getBridge, registerKey]);
};
