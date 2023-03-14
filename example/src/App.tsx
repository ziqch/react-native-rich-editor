import * as React from 'react';
import * as ImagePicker from 'expo-image-picker';
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
} from '@ziqch/react-native-rich-editor';
import FormatIcons from './FormatIcons';
import CustomizeFormatSize from './CustomizeFormatSize';

export default function App() {
  const { height, width } = useWindowDimensions();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
    },
  });

  const onPressAddImage = React.useCallback(
    async (updater: (sources: string[]) => void) => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
        base64: true,
        allowsMultipleSelection: true,
      });
      if (!result.canceled) {
        const sources = result.assets.map(
          (asset) => `data:image/jpeg;base64,${asset.base64}`
        );
        updater(sources);
      }
    },
    []
  );

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
            <CustomizeFormatSize />,
            <Format.Image icon={FormatIcons.Image} onPress={onPressAddImage} />,
            <Format.Basic format={'bold'} icon={FormatIcons.Bold} />,
            <Format.Basic format={'italic'} icon={FormatIcons.Italic} />,
            <Format.Basic format={'underline'} icon={FormatIcons.Underline} />,
            <Format.Basic format={'strike'} icon={FormatIcons.Strike} />,
            <Format.CodeBlock
              languages={['typescript', 'javascript']}
              icon={FormatIcons.Code}
            />,
            <Format.List type={'ordered'} icon={FormatIcons.ListOrdered} />,
            <Format.List type={'bullet'} icon={FormatIcons.ListBullet} />,
            <Format.Script type={'super'} icon={FormatIcons.ScriptSuper} />,
            <Format.Script type={'sub'} icon={FormatIcons.ScriptSub} />,
          ]}
        />
      </ReactNativeRichEditor>
    </SafeAreaView>
  );
}
