import React, { FC } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
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
  renderLoading?: () => JSX.Element;
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
    loading: {
      position: 'absolute',
      right: 0,
      left: 0,
      bottom: 0,
      top: 0,
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
      quillScript: 'https://cdn.quilljs.com/1.3.6/quill.js',
      cssList: ['https://cdn.quilljs.com/1.3.6/quill.snow.css'],
      initialValue: props.initialValue,
      quillOptions: {},
    };
  }, [props.initialValue]);

  const onTextChange = (delta: DeltaOperation[]) => {
    console.log(delta);
  };

  const bridge = useBridge({
    webViewRef,
    onWebViewInit,
    onEditorReady,
    scrollWebView,
    setReactNativeState,
    onTextChange,
  });

  const onMessage = React.useCallback(
    (e: WebViewMessageEvent) => {
      bridge.on(e.nativeEvent.data);
    },
    [bridge]
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
