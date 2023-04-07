import type { RangeStatic, Sources } from 'quill';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import {
  useBridgeRegisterWithoutTarget,
  useEditorContext,
  useEditorScroll,
} from '../hooks';
import {
  IRichEditorInnerProps,
  useEditorConfig,
} from '../hooks/useEditorConfig';
import {
  Action,
  Bridge,
  BridgeRegistryKey,
  BuiltinBridgeKey,
  FormatEventChannel,
  QuillResolversBuiltin,
  QuillResolverTokenBuiltin,
  RNResolversBuiltin,
  RNResolverTokenBuiltin,
  WebViewBridgeSDK,
  WebViewResolversBuiltin,
} from '../utils';
import {
  EditorContextProvider,
  IEditorContextProps,
} from './context/EditorContext';
// @ts-ignore
import html from '../web.js';

interface IRichEditorState {
  webViewHeight: number;
  loading: boolean;
}

const $ReactNativeRichEditor = React.forwardRef<
  ReactNativeRichEditor,
  IRichEditorInnerProps
>((props, forwardedRef) => {
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
      `try{${WebViewBridgeSDK}.${BridgeRegistryKey}.on(${JSON.stringify(
        data
      )})}catch(e){}`
    )
  );
  const { bridges } = useEditorContext();
  const bridge__builtin = useBridgeRegisterWithoutTarget<
    RNResolversBuiltin,
    WebViewResolversBuiltin & QuillResolversBuiltin
  >(BuiltinBridgeKey);
  const {
    scrollWebView,
    scrollViewRef,
    onScroll,
    onLayout,
    viewScrollInfoRef,
  } = useEditorScroll({
    webViewHeight: state.webViewHeight,
    bridge: bridge__builtin,
  });

  const bridgeBuiltInRef = React.useRef(bridge__builtin);

  bridgeBuiltInRef.current = bridge__builtin;

  React.useImperativeHandle(
    forwardedRef,
    () => ({
      blur() {
        bridgeBuiltInRef.current.call(QuillResolverTokenBuiltin.Blur);
      },
      focus() {
        bridgeBuiltInRef.current.call(QuillResolverTokenBuiltin.Focus);
      },
      async getMarkdown() {
        const markdown = await bridgeBuiltInRef.current.call(
          QuillResolverTokenBuiltin.GetMarkdown
        );

        return markdown;
      },
    }),
    []
  );

  const setReactNativeState = React.useCallback(
    (key: string, value: string) => {
      console.log(key, value);
      try {
        const v = JSON.parse(value);
        if (key in state) {
          setState((currentState) => {
            return Object.assign({}, currentState, {
              [key]: v,
            });
          });
        } else {
          props.setEditorContextProps((bridgePropsState) => {
            return Object.assign({}, bridgePropsState, {
              [key]: v,
            });
          });
        }
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
    [props, scrollViewRef, state, viewScrollInfoRef]
  );

  const onEditorReady = React.useCallback(() => {
    setState((current) => ({
      ...current,
      loading: false,
    }));
    bridge__builtin.call(
      QuillResolverTokenBuiltin.SetContents,
      props.defaultValue ?? []
    );
    props.setEditorContextProps((bridgePropsState) => ({
      ...bridgePropsState,
      isEditorReady: true,
      webViewRef,
    }));
  }, [bridge__builtin, props]);

  const config = useEditorConfig(props);
  const onWebViewInit = React.useCallback(() => {
    return config;
  }, [config]);

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
    [RNResolverTokenBuiltin.OnMentionsOpen]: props.onMentionsOpen,
    [RNResolverTokenBuiltin.OnMentionsClose]: props.onMentionsClose,
  });

  const onMessage = React.useCallback(
    (e: WebViewMessageEvent) => {
      const message = e.nativeEvent.data;
      const payload = JSON.parse(message) as Action;
      const target = bridges.get(payload.key);
      target?.on(message);
    },
    [bridges]
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
        // onTouchStart={() => {
        //   bridge__builtin.call(QuillResolverTokenBuiltin.Focus);
        // }}
      >
        <WebView
          ref={webViewRef}
          scrollEnabled={false}
          nestedScrollEnabled={false}
          source={{ html, baseUrl: '' }}
          originWhitelist={['*']}
          style={styles.webView}
          keyboardDisplayRequiresUserAction={false}
          hideKeyboardAccessoryView={true}
          startInLoadingState={true}
          onMessage={onMessage}
          overScrollMode={'never'}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </>
  );
});

export type ReactNativeRichEditorProps = Omit<
  IRichEditorInnerProps,
  'setEditorContextProps'
> & {
  children: React.ReactNode;
};

const ReactNativeRichEditor = React.forwardRef<
  ReactNativeRichEditor,
  ReactNativeRichEditorProps
>(function ReactNativeRichEditor(
  props: ReactNativeRichEditorProps,
  forwardedRef
) {
  const [editorContextProps, setEditorContextProps] =
    React.useState<IEditorContextProps>({
      isEditorReady: false,
      webViewRef: React.createRef(),
      isInputComposing: false,
    });

  return (
    <EditorContextProvider {...editorContextProps}>
      <$ReactNativeRichEditor
        {...props}
        ref={forwardedRef}
        setEditorContextProps={setEditorContextProps}
      />
      {props.children}
    </EditorContextProvider>
  );
});

declare type ReactNativeRichEditor = {
  getMarkdown(): Promise<string>;
  focus(): void;
  blur(): void;
};

export default ReactNativeRichEditor;
