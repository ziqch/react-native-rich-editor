import React, { FC, PropsWithChildren } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import {
  Bridge,
  BuiltinBridgeKey,
  QuillResolversBuiltin,
  QuillResolverTokenBuiltin,
  RNResolversBuiltin,
  RNResolverTokenBuiltin,
  WebViewInitializeConfig,
} from '../../utils';
import type { DeltaOperation, RangeStatic, Sources } from 'quill';
import { useBridge } from '../hooks/useBridge';
import { useEditorScroll } from '../hooks/useEditorScroll';
import BridgeContextProvider from './bridge/BridgeContextProvider';
import BridgeRegister from './bridge/BridgeRegister';
// @ts-ignore
import html from '../web.js';
import { FormatEventChannel } from '../utils';

interface IRichEditorInnerProps {
  width: number;
  height: number;
  defaultValue: DeltaOperation[];
  readOnly?: boolean;
  injectedScriptList?: string[];
  injectedCssList?: string[];
  onTextChange?: (delta: DeltaOperation[]) => void;
  onSelectionChange?: (
    range: RangeStatic,
    oldRange: RangeStatic,
    source?: Sources
  ) => void;
  renderLoading?: () => JSX.Element;
  setIsEditorReady?: (isReady: boolean) => void;
}

interface IRichEditorState {
  webViewHeight: number;
  loading: boolean;
}

const $ReactNativeRichEditor: FC<IRichEditorInnerProps> = (props) => {
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
  const bridge__builtin = useBridge<RNResolversBuiltin, QuillResolversBuiltin>(
    BuiltinBridgeKey
  );
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

  const onEditorReady = React.useCallback(() => {
    setState((current) => ({
      ...current,
      loading: false,
    }));
    bridge__builtin.call(
      QuillResolverTokenBuiltin.SetContents,
      props.defaultValue
    );
    props.setIsEditorReady?.(true);
    webViewRef.current?.requestFocus();
  }, [bridge__builtin, props]);

  const onWebViewInit = React.useCallback((): WebViewInitializeConfig => {
    return {
      quillScript: 'https://cdn.quilljs.com/1.3.6/quill.js',
      platform: Platform.OS,
      scriptsList: props.injectedScriptList ?? [],
      cssList: [
        'https://cdn.quilljs.com/1.3.6/quill.snow.css',
        'img { width: 100%; }',
        ...(props.injectedCssList ?? []),
      ],
      quillOptions: { readOnly: props.readOnly },
    };
  }, [props.injectedCssList, props.injectedScriptList, props.readOnly]);

  const onTextChange = React.useCallback(async () => {
    const delta = await bridge__builtin.call(
      QuillResolverTokenBuiltin.GetContents
    );
    props.onTextChange?.(delta);
  }, [bridge__builtin, props]);

  const onSelectionChange = React.useCallback(
    (range: RangeStatic, oldRange: RangeStatic, source?: Sources) => {
      props.onSelectionChange?.(range, oldRange, source);
    },
    [props]
  );

  bridge__builtin.registerResolvers({
    [RNResolverTokenBuiltin.OnWebViewInit]: onWebViewInit,
    [RNResolverTokenBuiltin.SetReactNativeState]: setReactNativeState,
    [RNResolverTokenBuiltin.ScrollWebView]: scrollWebView,
    [RNResolverTokenBuiltin.OnEditorReady]: onEditorReady,
    [RNResolverTokenBuiltin.OnTextChange]: onTextChange,
    [RNResolverTokenBuiltin.OnSelectionChange]: onSelectionChange,
    [RNResolverTokenBuiltin.UpdateFormat]:
      FormatEventChannel.getInstance().publish,
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

export type IRichEditorProps = Omit<IRichEditorInnerProps, 'setIsEditorReady'>;
const ReactNativeRichEditor: FC<PropsWithChildren<IRichEditorProps>> = (
  props
) => {
  const [isEditorReady, setIsEditorReady] = React.useState(false);
  return (
    <BridgeContextProvider isEditorReady={isEditorReady}>
      <BridgeRegister registerKey={BuiltinBridgeKey} />
      <$ReactNativeRichEditor {...props} setIsEditorReady={setIsEditorReady} />
      {props.children}
    </BridgeContextProvider>
  );
};

export default ReactNativeRichEditor;
