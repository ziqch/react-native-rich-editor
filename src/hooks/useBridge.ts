import React from 'react';
import Bridge, {
  ResolverFunctionTypeByToken,
  Transceiver,
} from '../utils/Bridge';
import { Resolver } from '../utils/Resolver';
import {
  QuillResolverListBuiltin,
  RNResolverListBuiltin,
  RNResolverTokenBuiltin,
} from '../utils/contract';
import type { WebView } from 'react-native-webview';

export interface useBridgeProps {
  webViewRef: React.RefObject<WebView | null>;
  onWebViewInit: ResolverFunctionTypeByToken<
    RNResolverTokenBuiltin.OnWebViewInit,
    RNResolverListBuiltin
  >;
  setReactNativeState: ResolverFunctionTypeByToken<
    RNResolverTokenBuiltin.SetReactNativeState,
    RNResolverListBuiltin
  >;
  scrollWebView: ResolverFunctionTypeByToken<
    RNResolverTokenBuiltin.ScrollWebView,
    RNResolverListBuiltin
  >;
  onEditorReady: ResolverFunctionTypeByToken<
    RNResolverTokenBuiltin.OnEditorReady,
    RNResolverListBuiltin
  >;
  onTextChange: ResolverFunctionTypeByToken<
    RNResolverTokenBuiltin.OnTextChange,
    RNResolverListBuiltin
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
    return new Bridge<RNResolverListBuiltin, QuillResolverListBuiltin>([
      new Resolver(RNResolverTokenBuiltin.OnWebViewInit, onWebViewInit),
      new Resolver(
        RNResolverTokenBuiltin.SetReactNativeState,
        setReactNativeState
      ),
      new Resolver(RNResolverTokenBuiltin.ScrollWebView, scrollWebView),
      new Resolver(RNResolverTokenBuiltin.OnEditorReady, onEditorReady),
      new Resolver(RNResolverTokenBuiltin.OnTextChange, onTextChange),
    ]);
  }, [
    onEditorReady,
    onTextChange,
    onWebViewInit,
    scrollWebView,
    setReactNativeState,
    webViewRef,
  ]);
};
