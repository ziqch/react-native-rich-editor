import React, { FC } from 'react';
import * as ImagePicker from 'expo-image-picker';
import type { ImagePickerOptions } from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { QuillResolverTokenBuiltin } from '../../utils';
import { useBuiltinBridge } from '../../hooks/useBridge';
import { useFormatDisabled } from '../../hooks/useFormatDisabled';

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

  return (
    <TouchableOpacity
      style={{ ...styles.default, ...style }}
      onPress={onPress}
      disabled={disabled}
    >
      {typeof icon === 'function' ? (
        icon()
      ) : (
        <MaterialIcons
          // @ts-ignore
          name={icon}
          size={20}
          color={buttonColor}
        />
      )}
    </TouchableOpacity>
  );
};

export default Image;
