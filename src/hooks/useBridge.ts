import React from 'react';
import Bridge, { ResolverInnerType, Transceiver } from '../utils/Bridge';
import { Resolver } from '../utils/Resolver';
import {
  QuillResolverListBuiltin,
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
  onTextChange: ResolverInnerType<
    RNResolverListBuiltin[RNResolverTokenBuiltin.OnTextChange]
  >;
}

export const useBridge = (props: useBridgeProps) => {
  const {
    webViewRef,
    scrollWebView,
    onWebViewInit,
    setReactNativeState,
    onEditorReady,
    onTextChange,
  } = props;
  return React.useMemo(() => {
    Transceiver.getInstance().setSender((data) =>
      webViewRef.current?.injectJavaScript(
        `$ReactNativeBridge.on(${JSON.stringify(data)})`
      )
    );
    return new Bridge<RNResolverListBuiltin, QuillResolverListBuiltin>({
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

      [RNResolverTokenBuiltin.OnTextChange]: new Resolver(
        RNResolverTokenBuiltin.OnEditorReady,
        onTextChange
      ),
    });
  }, [
    onEditorReady,
    onTextChange,
    onWebViewInit,
    scrollWebView,
    setReactNativeState,
    webViewRef,
  ]);
};
