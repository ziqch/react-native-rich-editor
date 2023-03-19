import {
  Bridge,
  BridgeRegistryKey,
  BuiltinBridgeKey,
  WebViewBridgeSDK,
} from '../../utils';
import React, { FC, PropsWithChildren } from 'react';
import type { ResolverList } from '../../utils';
import type { WebView } from 'react-native-webview';

export interface IEditorContextProps {
  isEditorReady: boolean;
  webViewRef: React.RefObject<WebView | null>;
  isInputComposing: boolean;
}
export interface IEditorContextValue extends IEditorContextProps {
  bridges: Map<string, Bridge<any, any>>;
  getBridge: <S extends ResolverList, T extends ResolverList>(
    key: string
  ) => Bridge<S, T> | undefined;
  injectJavaScript: (script: string) => Promise<void>;
}

const initialValue: IEditorContextValue = {
  webViewRef: React.createRef(),
  isEditorReady: false,
  isInputComposing: false,
  bridges: new Map(),
  getBridge: () => undefined,
  injectJavaScript: () => Promise.resolve(),
};
export const EditorContext = React.createContext(initialValue);
export const EditorContextProvider: FC<
  PropsWithChildren<IEditorContextProps>
> = (props) => {
  const bridges = React.useRef(new Map<string, Bridge<any, any>>());
  const injectJavaScript = React.useCallback(
    async (script: string) => {
      const bridge__builtin = bridges.current.get(BuiltinBridgeKey);
      if (bridge__builtin) {
        const { promise, id } = bridge__builtin.createPromise();
        props.webViewRef.current?.injectJavaScript(
          `${script};${WebViewBridgeSDK}.${BridgeRegistryKey}.get('${BuiltinBridgeKey}').resolvePromise('${id}')`
        );
        await promise;
      }
    },
    [props.webViewRef]
  );
  const value: IEditorContextValue = React.useMemo(() => {
    return {
      bridges: bridges.current,
      getBridge: (key: string) => bridges.current.get(key),
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
