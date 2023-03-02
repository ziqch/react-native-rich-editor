import React, { FC, PropsWithChildren } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import {
  Bridge,
  BuiltinBridgeKey,
  QuillResolverListBuiltin,
  Resolver,
  RNResolverListBuiltin,
  RNResolverTokenBuiltin,
  WebViewInitializeConfig,
} from '../utils';
import type { DeltaOperation } from 'quill';
import { useBridge } from './hooks/useBridge';
import { useEditorScroll } from './hooks/useEditorScroll';
import { BridgeContextProvider } from './BridgeContextProvider';
import BridgeRegister from './BridgeRegister';
// @ts-ignore
import html from './web.js';

export interface IRichEditorProps {
  width: number;
  height: number;
  initialValue: DeltaOperation[];
  onTextChange?: (delta: DeltaOperation[]) => void;
  renderLoading?: () => JSX.Element;
}

interface IRichEditorState {
  webViewHeight: number;
  loading: boolean;
}

const $ReactNativeRichEditor: FC<IRichEditorProps> = (props) => {
  const [state, setState] = React.useState<IRichEditorState>({
    webViewHeight: 0,
    loading: true,
  });
  const styles = StyleSheet.create({
    container: {
      height: props.height,
      width: props.width,
      flex: 1,
    },
    webView: {
      height: state.webViewHeight,
      width: props.width,
    },
    loading: {
      position: 'absolute',
      right: 0,
      left: 0,
      bottom: 0,
      top: 0,
    },
  });
  const webViewRef = React.useRef<WebView>(null);
  Bridge.setSender((data) =>
    webViewRef.current?.injectJavaScript(
      `$ReactNativeBridge.on(${JSON.stringify(data)})`
    )
  );
  const {
    scrollWebView,
    scrollViewRef,
    onScroll,
    onLayout,
    viewScrollInfoRef,
  } = useEditorScroll({
    webViewHeight: state.webViewHeight,
  });

  const setReactNativeState = React.useCallback(
    (key: string, value: string) => {
      try {
        const v = JSON.parse(value);
        setState((currentState) => {
          return Object.assign({}, currentState, {
            [key]: v,
          });
        });
        if (key === 'webViewHeight') {
          const { scrollTop, h } = viewScrollInfoRef.current;
          if (scrollTop + h > v) {
            scrollViewRef.current?.scrollToEnd();
          }
        }
      } catch (e) {
        return;
      }
    },
    [scrollViewRef, viewScrollInfoRef]
  );

  const onEditorReady = () => {
    setState((current) => ({
      ...current,
      loading: false,
    }));
  };

  const onWebViewInit = React.useCallback((): WebViewInitializeConfig => {
    return {
      quillScript: 'https://cdn.quilljs.com/1.3.6/quill.js',
      cssList: ['https://cdn.quilljs.com/1.3.6/quill.snow.css'],
      initialValue: props.initialValue,
      quillOptions: {},
    };
  }, [props.initialValue]);

  const onTextChange = (delta: DeltaOperation[]) => {
    props.onTextChange?.(delta);
  };

  const bridge__builtin = useBridge<
    RNResolverListBuiltin,
    QuillResolverListBuiltin
  >({
    registerKey: BuiltinBridgeKey,
    initialResolvers: [
      new Resolver(RNResolverTokenBuiltin.OnWebViewInit, onWebViewInit),
      new Resolver(
        RNResolverTokenBuiltin.SetReactNativeState,
        setReactNativeState
      ),
      new Resolver(RNResolverTokenBuiltin.ScrollWebView, scrollWebView),
      new Resolver(RNResolverTokenBuiltin.OnEditorReady, onEditorReady),
      new Resolver(RNResolverTokenBuiltin.OnTextChange, onTextChange),
    ],
  });

  const onMessage = React.useCallback(
    (e: WebViewMessageEvent) => {
      bridge__builtin.on(e.nativeEvent.data);
    },
    [bridge__builtin]
  );

  const renderLoading = React.useCallback(() => {
    if (!state.loading) {
      return <></>;
    }
    if (props.renderLoading) {
      return props.renderLoading();
    } else {
      return <ActivityIndicator style={styles.loading} size="large" />;
    }
  }, [props, state.loading, styles.loading]);

  return (
    <>
      {renderLoading()}
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        scrollEventThrottle={16}
        onLayout={onLayout}
        onScroll={onScroll}
      >
        <WebView
          ref={webViewRef}
          scrollEnabled={false}
          nestedScrollEnabled={false}
          source={{ html }}
          style={styles.webView}
          keyboardDisplayRequiresUserAction={false}
          hideKeyboardAccessoryView={true}
          startInLoadingState={true}
          onMessage={onMessage}
          overScrollMode={'never'}
        />
      </ScrollView>
    </>
  );
};

const ReactNativeRichEditor: FC<PropsWithChildren<IRichEditorProps>> = (
  props
) => {
  return (
    <BridgeContextProvider>
      <BridgeRegister registerKey={BuiltinBridgeKey} />
      <$ReactNativeRichEditor {...props} />
      {props.children}
    </BridgeContextProvider>
  );
};

export default ReactNativeRichEditor;
