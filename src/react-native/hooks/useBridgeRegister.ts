import React from 'react';
import type { ResolverList } from '../utils';
import { Bridge, BridgeRegistryKey, WebViewBridgeSDK } from '../utils';
import { useEditorContext } from './useEditorContext';

interface IUseBridgeRegisterProps<T> {
  registerKey: string;
  registerInTarget?: boolean;
  resolverList?: T;
}
const useBridgeRegister = <SRC extends ResolverList, TGT extends ResolverList>(
  props: IUseBridgeRegisterProps<SRC>
) => {
  const { registerInTarget = true, registerKey, resolverList } = props;
  const { bridges, webViewRef } = useEditorContext();
  const registered = React.useRef<Bridge<SRC, TGT> | undefined>(undefined);
  if (registerInTarget && !webViewRef.current) {
    return undefined;
  }
  if (!registered.current) {
    const bridge = new Bridge<SRC, TGT>(registerKey, resolverList);
    bridges.set(registerKey, bridge);
    if (registerInTarget) {
      webViewRef.current?.injectJavaScript(
        `${WebViewBridgeSDK}.${BridgeRegistryKey}.register('${registerKey}');`
      );
    }
    registered.current = bridge;
  }
  return registered.current;
};

export const useBridgeRegisterWithTarget = <
  SRC extends ResolverList,
  TGT extends ResolverList
>(
  registerKey: string,
  resolverList?: SRC
) => {
  return useBridgeRegister<SRC, TGT>({
    registerKey,
    resolverList,
    registerInTarget: true,
  });
};

export const useBridgeRegisterWithoutTarget = <
  SRC extends ResolverList,
  TGT extends ResolverList
>(
  registerKey: string,
  resolverList?: SRC
) => {
  return useBridgeRegister<SRC, TGT>({
    registerKey,
    resolverList,
    registerInTarget: false,
  }) as Bridge<SRC, TGT>;
};
