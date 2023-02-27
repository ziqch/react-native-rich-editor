import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

const ToolBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 999,
  },
});
export const RichEditorToolBar = () => {
  const { width } = useWindowDimensions();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ ...ToolBarStyles.container, height: 48, width }} />
    </KeyboardAvoidingView>
  );
};
