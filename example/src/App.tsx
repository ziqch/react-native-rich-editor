import * as React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {
  ReactNativeRichEditor,
  RichEditorToolBar,
  Size,
} from 'react-native-rich-editor';

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
        defaultValue={[
          { insert: 'Hello ' },
          { insert: 'World!', attributes: { bold: true } },
          { insert: '\n' },
        ]}
      >
        <RichEditorToolBar
          formats={[
            <Size />,
            { format: 'bold', icon: 'format-bold' },
            { format: 'italic', icon: 'format-italic' },
            { format: 'underline', icon: 'format-underline' },
            { format: 'strike', icon: 'format-strikethrough' },
          ]}
        />
      </ReactNativeRichEditor>
    </SafeAreaView>
  );
}
