import React, { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { QuillResolverTokenBuiltin } from '../../utils';
import { useBuiltinBridge } from '../../hooks/useBridge';
import { useFormat } from '../../hooks';

export interface IImageFormatProps {
  style?: ViewStyle;
  icon?: (isActive: boolean, isDisabled: boolean) => JSX.Element;
  disabled?: boolean;
  onPress?: (updater: (sourceList: string[]) => void) => void;
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
  const { icon, style, disabled } = props;
  const bridge__builtin = useBuiltinBridge();
  const updater = React.useCallback(
    (sourceList: string[]) => {
      bridge__builtin.call(QuillResolverTokenBuiltin.AddImage, sourceList);
    },
    [bridge__builtin]
  );
  const onPress = React.useCallback(() => {
    props.onPress?.(updater);
  }, [props, updater]);

  const { internalDisabled } = useFormat('image');
  const isDisabled = Boolean(internalDisabled || disabled);

  return (
    <TouchableOpacity
      style={{ ...styles.default, ...style }}
      onPress={onPress}
      disabled={isDisabled}
    >
      {icon?.(false, isDisabled) ?? <Text>?</Text>}
    </TouchableOpacity>
  );
};

export default Image;
