import React from 'react';
import Bridge, { ResolverInnerType } from '../utils/Bridge';
import {
  QuillResolverListBuiltin,
  Resolver,
  RNResolverListBuiltin,
  RNResolverTokenBuiltin,
} from '../utils/contract';
import type { WebView } from 'react-native-webview';

export interface useBridgeProps {
  webViewRef: React.RefObject<WebView | null>;
  onWebViewInit: ResolverInnerType<
    RNResolverListBuiltin[RNResolverTokenBuiltin.OnWebViewInit]
  >;
  setReactNativeState: ResolverInnerType<
    RNResolverListBuiltin[RNResolverTokenBuiltin.SetReactNativeState]
  >;
  scrollWebView: ResolverInnerType<
    RNResolverListBuiltin[RNResolverTokenBuiltin.ScrollWebView]
  >;
  onEditorReady: ResolverInnerType<
    RNResolverListBuiltin[RNResolverTokenBuiltin.OnEditorReady]
  >;
}

export const useBridge = (props: useBridgeProps) => {
  const {
    webViewRef,
    scrollWebView,
    onWebViewInit,
    setReactNativeState,
    onEditorReady,
  } = props;
  return React.useMemo(() => {
    return new Bridge<RNResolverListBuiltin, QuillResolverListBuiltin>(
      (data) =>
        webViewRef.current?.injectJavaScript(
          `$ReactNativeBridge.on(${JSON.stringify(data)})`
        ),
      {
        [RNResolverTokenBuiltin.OnWebViewInit]: new Resolver(
          RNResolverTokenBuiltin.OnWebViewInit,
          onWebViewInit
        ),

        [RNResolverTokenBuiltin.SetReactNativeState]: new Resolver(
          RNResolverTokenBuiltin.SetReactNativeState,
          setReactNativeState
        ),

        [RNResolverTokenBuiltin.ScrollWebView]: new Resolver(
          RNResolverTokenBuiltin.ScrollWebView,
          scrollWebView
        ),

        [RNResolverTokenBuiltin.OnEditorReady]: new Resolver(
          RNResolverTokenBuiltin.OnEditorReady,
          onEditorReady
        ),
      }
    );
  }, [
    onEditorReady,
    onWebViewInit,
    scrollWebView,
    setReactNativeState,
    webViewRef,
  ]);
};
