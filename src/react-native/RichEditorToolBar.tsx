import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BridgeContext } from './BridgeContextProvider';

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
const RichEditorToolBar = () => {
  const { width } = useWindowDimensions();
  const { bridges } = React.useContext(BridgeContext);
  console.log('toolbar', bridges);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ ...ToolBarStyles.container, width }}>
        <TouchableOpacity style={ToolBarStyles.button}>
          <FontAwesome5 name="bold" size={18} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={ToolBarStyles.button}>
          <FontAwesome5 name="italic" size={18} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={ToolBarStyles.button}>
          <FontAwesome5 name="underline" size={18} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={ToolBarStyles.button}>
          <FontAwesome5 name="strikethrough" size={18} color="black" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RichEditorToolBar;
