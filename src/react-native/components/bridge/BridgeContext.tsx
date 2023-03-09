import { Bridge } from '../../../utils';
import React, { FC, PropsWithChildren } from 'react';
import type { ResolverList } from '../../../utils';
import type { WebView } from 'react-native-webview';

export interface IBridgeContextProps {
  isEditorReady: boolean;
  webViewRef: React.RefObject<WebView | null>;
}
interface IBridgeContextValue extends IBridgeContextProps {
  getBridge: (key: string) => Bridge<any, any> | undefined;
}
interface IBridgeRegisterProps {
  registerKey: string;
  resolverList?: ResolverList;
}
const initialValue: IBridgeContextValue = {
  webViewRef: React.createRef(),
  isEditorReady: false,
  getBridge: () => undefined,
};
export const BridgeContext = React.createContext(initialValue);
const wrapper = () => {
  const bridges = new Map<string, Bridge<any, any>>();
  const BridgeContextProvider: FC<PropsWithChildren<IBridgeContextProps>> = (
    props
  ) => {
    const value: IBridgeContextValue = React.useMemo(() => {
      return {
        getBridge: (key: string) => bridges.get(key),
        ...props,
      };
    }, [props]);

    return (
      <BridgeContext.Provider value={value}>
        {props.children}
      </BridgeContext.Provider>
    );
  };

  const BridgeRegister: FC<IBridgeRegisterProps> = (props) => {
    const { registerKey, resolverList } = props;
    const registered = React.useRef(false);
    if (!registered.current) {
      bridges.set(registerKey, new Bridge<any, any>(resolverList));
      registered.current = true;
    }
    return <></>;
  };

  return {
    BridgeContextProvider,
    BridgeRegister,
  };
};

const components = wrapper();
export const BridgeContextProvider = components.BridgeContextProvider;
export const BridgeRegister = components.BridgeRegister;
