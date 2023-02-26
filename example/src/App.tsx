import * as React from 'react';
import {
  useWindowDimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { ReactNativeRichEditor } from 'react-native-rich-editor';

export default function App() {
  const { height, width } = useWindowDimensions();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      <ReactNativeRichEditor
        height={height}
        width={width}
        initialValue={[
          { insert: 'Hello ' },
          { insert: 'World!', attributes: { bold: true } },
          { insert: '\n' },
        ]}
      />
    </SafeAreaView>
  );
}
