import React from 'react';
import { Platform, TextInput } from 'react-native';
import type { WebView } from 'react-native-webview';

export const useFocusForAndroid = (
  webViewRef: React.RefObject<WebView | null>
) => {
  const hackInputRef = React.useRef<TextInput>(null);
  const focus = React.useCallback(() => {
    if (Platform.OS === 'android') {
      hackInputRef.current?.focus();
      webViewRef.current?.requestFocus();
    }
  }, [webViewRef]);
  const hackInput = React.useMemo(() => {
    return Platform.OS === 'android' ? (
      <TextInput style={{ display: 'none' }} ref={hackInputRef} />
    ) : (
      <></>
    );
  }, []);
  return {
    hackInput,
    focus,
  };
};
