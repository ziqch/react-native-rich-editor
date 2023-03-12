import React, { FC } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';

interface IRichEditorToolBarProps {
  formats: Array<JSX.Element>;
  style?: ViewStyle;
}

const ToolBarStyles = StyleSheet.create({
  scrollView: {
    zIndex: 999,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.2)',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 6,
    height: 48,
  },
  button: {
    width: 20,
    height: 20,
    marginHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const RichEditorToolBar: FC<IRichEditorToolBarProps> = (props) => {
  const { width } = useWindowDimensions();
  const { formats, style } = props;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        horizontal={true}
        style={{ ...ToolBarStyles.scrollView, width }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ ...ToolBarStyles.container, ...style }}
      >
        {formats.map((format, index) =>
          React.isValidElement(format) ? (
            <View key={index}>{format}</View>
          ) : (
            <></>
          )
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RichEditorToolBar;
