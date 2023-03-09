import React from 'react';
import type {
  Bridge,
  QuillResolversBuiltin,
  ResolverList,
  RNResolversBuiltin,
} from '../../utils';
import { BridgeContext } from '../components/bridge/BridgeContext';
import { BuiltinBridgeKey } from '../../utils';
export const useBridge = <SRC extends ResolverList, TGT extends ResolverList>(
  registerKey: string
) => {
  const { getBridge } = React.useContext(BridgeContext);
  return React.useMemo(() => {
    return getBridge(registerKey) as Bridge<SRC, TGT>;
  }, [getBridge, registerKey]);
};

export const useBuiltinBridge = () => {
  return useBridge<RNResolversBuiltin, QuillResolversBuiltin>(BuiltinBridgeKey);
};
