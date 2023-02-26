import React, { FC } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import Bridge from './utils/Bridge';
import {
  RNResolverTokenBuiltin,
  QuillResolverListBuiltin,
  RNResolverListBuiltin,
  Resolver,
  WebViewInitializeConfig,
} from './utils/contract';
// @ts-ignore
import html from './web.js';
import type { DeltaOperation } from 'quill';

export interface RichEditionProps {
  width: number;
  height: number;
  initialValue: DeltaOperation[];
}

export const ReactNativeRichEditor: FC<RichEditionProps> = (props) => {
  const { width, height } = props;
  const styles = StyleSheet.create({
    container: {
      height,
      width,
    },
    webView: {
      width,
      height: 2000,
    },
  });
  const webViewRef = React.useRef<WebView>();
  const bridgeRef =
    React.useRef<Bridge<RNResolverListBuiltin, QuillResolverListBuiltin>>();
  const onWebViewReady = React.useCallback((): WebViewInitializeConfig => {
    return {
      scripts: ['https://cdn.quilljs.com/1.3.6/quill.js'],
      initialValue: props.initialValue,
      quillOptions: {},
    };
  }, [props.initialValue]);

  const onLoadStart = React.useCallback(() => {
    const webviewInstance = webViewRef.current;
    if (!webviewInstance) return;
    bridgeRef.current = new Bridge<
      RNResolverListBuiltin,
      QuillResolverListBuiltin
    >(
      (data) =>
        webviewInstance.injectJavaScript(
          `$ReactNativeBridge.on(${JSON.stringify(data)})`
        ),
      {
        [RNResolverTokenBuiltin.OnWebViewReady]: new Resolver<
          () => WebViewInitializeConfig
        >(RNResolverTokenBuiltin.OnWebViewReady, onWebViewReady.bind(this)),
        [RNResolverTokenBuiltin.SetReactNativeState]: new Resolver<
          (state: any) => void
        >(RNResolverTokenBuiltin.SetReactNativeState, () => {}),
        [RNResolverTokenBuiltin.ScrollWebView]: new Resolver<
          (state: any) => void
        >(RNResolverTokenBuiltin.ScrollWebView, () => {}),
        [RNResolverTokenBuiltin.OnEditorReady]: new Resolver<() => void>(
          RNResolverTokenBuiltin.OnEditorReady,
          () => {}
        ),
      }
    );
  }, [onWebViewReady, webViewRef]);

  const onMessage = React.useCallback(
    (e: WebViewMessageEvent) => {
      if (bridgeRef.current) {
        bridgeRef.current.on(e.nativeEvent.data);
      }
    },
    [bridgeRef]
  );

  return (
    <ScrollView style={styles.container}>
      <WebView
        // @ts-ignore
        ref={webViewRef}
        style={styles.webView}
        scrollEnabled={false}
        nestedScrollEnabled={false}
        onLoadStart={onLoadStart}
        source={{ html }}
        keyboardDisplayRequiresUserAction={false}
        hideKeyboardAccessoryView={true}
        startInLoadingState={true}
        onMessage={onMessage}
      />
    </ScrollView>
  );
};
