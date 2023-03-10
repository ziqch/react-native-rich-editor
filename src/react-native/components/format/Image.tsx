import React, { FC } from 'react';
import * as ImagePicker from 'expo-image-picker';
import type { ImagePickerOptions } from 'expo-image-picker';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { QuillResolverTokenBuiltin } from '../../utils';
import { useBuiltinBridge, useFormatDisabled } from '../../hooks';

export interface IImageFormatProps {
  style?: ViewStyle;
  icon?: string | (() => JSX.Element);
  disabled?: boolean;
  imagePickerOptions?: ImagePickerOptions;
  onValueChange?: (value: any) => void;
}
const styles = StyleSheet.create({
  default: {
    width: 20,
    height: 20,
    marginHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const Image: FC<IImageFormatProps> = (props) => {
  const { icon, style, onValueChange, imagePickerOptions } = props;
  const bridge__builtin = useBuiltinBridge();
  const onPress = React.useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      base64: true,
      allowsMultipleSelection: true,
      ...imagePickerOptions,
    });
    if (!result.canceled) {
      const sources = result.assets.map(
        (asset) => `data:image/jpeg;base64,${asset.base64}`
      );
      bridge__builtin.call(QuillResolverTokenBuiltin.AddImage, sources);
      onValueChange?.(result.assets);
    }
  }, [bridge__builtin, imagePickerOptions, onValueChange]);

  const disabled = useFormatDisabled(props.disabled);
  const buttonColor = React.useMemo(() => {
    if (disabled) return 'gray';
    else return 'black';
  }, [disabled]);

  const renderIcon = React.useCallback(() => {
    if (typeof icon === 'function') {
      return icon();
    } else {
      const MaterialIcons =
        require('react-native-vector-icons/MaterialIcons').default;
      return <MaterialIcons name={icon} size={20} color={buttonColor} />;
    }
  }, [buttonColor, icon]);

  return (
    <TouchableOpacity
      style={{ ...styles.default, ...style }}
      onPress={onPress}
      disabled={disabled}
    >
      {renderIcon()}
    </TouchableOpacity>
  );
};

export default Image;
