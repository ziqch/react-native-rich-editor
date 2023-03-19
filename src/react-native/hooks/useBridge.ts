import React from 'react';
import type {
  QuillResolversBuiltin,
  ResolverList,
  RNResolversBuiltin,
  WebViewResolversBuiltin,
} from '../utils';
import { Bridge, BuiltinBridgeKey } from '../utils';
import { useEditorContext } from './useEditorContext';
export const useBridge = <SRC extends ResolverList, TGT extends ResolverList>(
  registerKey: string
) => {
  const { getBridge } = useEditorContext();
  return React.useMemo(() => {
    return getBridge<SRC, TGT>(registerKey) as Bridge<SRC, TGT>;
  }, [getBridge, registerKey]);
};

export const useBuiltinBridge = () => {
  return useBridge<
    RNResolversBuiltin,
    WebViewResolversBuiltin & QuillResolversBuiltin
  >(BuiltinBridgeKey);
};
