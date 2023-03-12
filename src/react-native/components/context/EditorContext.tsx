import {
  Bridge,
  BuiltinBridgeKey,
  ReactNativeBridgeToken,
} from '../../../utils';
import React, { FC, PropsWithChildren } from 'react';
import type { ResolverList } from '../../../utils';
import type { WebView } from 'react-native-webview';

export interface IEditorContextProps {
  isEditorReady: boolean;
  webViewRef: React.RefObject<WebView | null>;
  isInputComposing: boolean;
}
export interface IEditorContextValue extends IEditorContextProps {
  getBridge: (key: string) => Bridge<any, any> | undefined;
  injectJavaScript: (script: string) => Promise<void>;
}
interface IBridgeRegisterProps {
  registerKey: string;
  resolverList?: ResolverList;
}
const initialValue: IEditorContextValue = {
  webViewRef: React.createRef(),
  isEditorReady: false,
  isInputComposing: false,
  getBridge: () => undefined,
  injectJavaScript: () => Promise.resolve(),
};
export const EditorContext = React.createContext(initialValue);
const wrapper = () => {
  const bridges = new Map<string, Bridge<any, any>>();
  const EditorContextProvider: FC<PropsWithChildren<IEditorContextProps>> = (
    props
  ) => {
    const injectJavaScript = React.useCallback(
      async (script: string) => {
        const bridge__builtin = bridges.get(BuiltinBridgeKey);
        if (bridge__builtin) {
          const { promise, id } = bridge__builtin.createPromise();
          props.webViewRef.current?.injectJavaScript(
            `${script};${ReactNativeBridgeToken}.resolvePromise('${id}')`
          );
          await promise;
        }
      },
      [props.webViewRef]
    );
    const value: IEditorContextValue = React.useMemo(() => {
      return {
        getBridge: (key: string) => bridges.get(key),
        injectJavaScript,
        ...props,
      };
    }, [injectJavaScript, props]);

    return (
      <EditorContext.Provider value={value}>
        {props.children}
      </EditorContext.Provider>
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
    EditorContextProvider,
    BridgeRegister,
  };
};

const components = wrapper();
export const EditorContextProvider = components.EditorContextProvider;
export const BridgeRegister = components.BridgeRegister;
