import React from 'react';
import type { Bridge, ResolverList } from '../../utils';
import { BridgeContext } from '../BridgeContextProvider';
import { useConst } from './useConst';

export interface IUseBridgeProps<SRC extends ResolverList> {
  registerKey: string;
  initialResolvers?: SRC;
}

export const useBridge = <SRC extends ResolverList, TGT extends ResolverList>(
  props: IUseBridgeProps<SRC>
) => {
  const { registerKey, initialResolvers } = props;
  const resolvers = useConst(initialResolvers);
  const { getBridge } = React.useContext(BridgeContext);
  return React.useMemo(() => {
    const bridge = getBridge(registerKey) as Bridge<SRC, TGT>;
    if (resolvers) {
      bridge.registerResolvers(resolvers);
    }
    return bridge;
  }, [getBridge, registerKey, resolvers]);
};
