import * as React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {
  Format,
  ReactNativeRichEditor,
  RichEditorToolBar,
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
            <Format.Size />,
            <Format.Image icon={'image'} />,
            <Format.Basic format={'bold'} icon={'format-bold'} />,
            <Format.Basic format={'italic'} icon={'format-italic'} />,
            <Format.Basic format={'underline'} icon={'format-underline'} />,
            <Format.Basic format={'strike'} icon={'format-strikethrough'} />,
          ]}
        />
      </ReactNativeRichEditor>
    </SafeAreaView>
  );
}
