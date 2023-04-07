import {
  QuillResolverTokenBuiltin,
  useBuiltinBridge,
} from '@bean-app/react-native-rich-editor';
import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DismissKeyboard = () => {
  const bridge__builtin = useBuiltinBridge();
  const dismissKeyboardStyles = StyleSheet.create({
    container: {
      height: '100%',
      display: 'flex',
      paddingLeft: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      width: 20,
      height: 20,
      marginTop: 2,
      marginHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  const onPress = () => {
    bridge__builtin
      .call(QuillResolverTokenBuiltin.InsertMention, 'dog', '@dog123')
      .then(console.log);
  };
  return (
    <LinearGradient
      start={{ x: 0, y: 0.5 }}
      end={{ x: 0.5, y: 0.5 }}
      colors={[
        'rgba(255,255,255,0)',
        'rgba(255,255,255,0.8)',
        'rgba(255,255,255,1)',
        'rgba(255,255,255,1)',
        'rgba(255,255,255,1)',
      ]}
      style={dismissKeyboardStyles.container}
    >
      <TouchableOpacity style={dismissKeyboardStyles.button} onPress={onPress}>
        <MaterialIcons name={'keyboard-hide'} size={20} />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default DismissKeyboard;
