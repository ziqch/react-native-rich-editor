import React, { FC } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export interface RichEditionProps {
  width: number;
  height: number;
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
      height: 3000,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <WebView
        style={styles.webView}
        scrollEnabled={false}
        nestedScrollEnabled={false}
      />
    </ScrollView>
  );
};
