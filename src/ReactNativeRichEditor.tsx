import React, { FC } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import type { WebViewInitializeConfig } from './utils/contract';
// @ts-ignore
import html from './web.js';
import type { DeltaOperation } from 'quill';
import { useBridge } from './hooks/useBridge';
import { useEditorScroll } from './hooks/useEditorScroll';

export interface IRichEditorProps {
  width: number;
  height: number;
  initialValue: DeltaOperation[];
}

interface IRichEditorState {
  webViewHeight: number;
  loading: boolean;
}

export const ReactNativeRichEditor: FC<IRichEditorProps> = (props) => {
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
  });
  const webViewRef = React.useRef<WebView>(null);
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
        const newState = Object.assign({}, state, {
          [key]: v,
        });
        setState(newState);
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
    [scrollViewRef, state, viewScrollInfoRef]
  );

  const onEditorReady = () => {
    setState({
      ...state,
      loading: false,
    });
  };

  const onWebViewInit = React.useCallback((): WebViewInitializeConfig => {
    return {
      scriptsURL: ['https://cdn.quilljs.com/1.3.6/quill.js'],
      cssURL: ['https://cdn.quilljs.com/1.3.6/quill.snow.css'],
      initialValue: props.initialValue,
      quillOptions: {},
    };
  }, [props.initialValue]);

  const bridge = useBridge({
    webViewInstance: webViewRef.current,
    onWebViewInit,
    onEditorReady,
    scrollWebView,
    setReactNativeState,
  });

  const onMessage = React.useCallback(
    (e: WebViewMessageEvent) => {
      if (bridge) {
        bridge.on(e.nativeEvent.data);
      }
    },
    [bridge]
  );

  return (
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
  );
};
