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
        syntax={true}
      >
        <RichEditorToolBar
          formats={[
            <Format.Size />,
            <Format.Image icon={'image'} />,
            <Format.Basic format={'bold'} icon={'format-bold'} />,
            <Format.Basic format={'italic'} icon={'format-italic'} />,
            <Format.Basic format={'underline'} icon={'format-underline'} />,
            <Format.Basic format={'strike'} icon={'format-strikethrough'} />,
            <Format.CodeBlock languages={['typescript', 'javascript']} />,
            <Format.List type={'ordered'} />,
            <Format.List type={'bullet'} />,
            <Format.Script type={'super'} />,
            <Format.Script type={'sub'} />,
          ]}
        />
      </ReactNativeRichEditor>
    </SafeAreaView>
  );
}
