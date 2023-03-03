import React, { FC } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import type { IFormatProps } from './Format';
import { Format } from './Format';

interface IRichEditorToolBarProps {
  formats: IFormatProps[];
  style?: ViewStyle;
}

const ToolBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 6,
    zIndex: 999,
    height: 48,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.2)',
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
      <View style={{ ...ToolBarStyles.container, width, ...style }}>
        {formats.map((formatProps) => (
          <Format key={formatProps.format} {...formatProps} />
        ))}
      </View>
    </KeyboardAvoidingView>
  );
};

export default RichEditorToolBar;
