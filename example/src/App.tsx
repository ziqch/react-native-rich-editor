import * as React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {
  Formatter,
  ImageFormatter,
  ReactNativeRichEditor,
  RichEditorToolBar,
  SizeFormatter,
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
            <SizeFormatter />,
            <ImageFormatter icon={'image'} />,
            <Formatter format={'bold'} icon={'format-bold'} />,
            <Formatter format={'italic'} icon={'format-italic'} />,
            <Formatter format={'underline'} icon={'format-underline'} />,
            <Formatter format={'strike'} icon={'format-strikethrough'} />,
          ]}
        />
      </ReactNativeRichEditor>
    </SafeAreaView>
  );
}
