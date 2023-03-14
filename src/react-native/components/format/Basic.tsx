import React, { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useFormat } from '../../hooks/useFormat';

export interface IBasicFormatProps {
  format: string;
  icon?: (isActive: boolean, isDisabled: boolean) => JSX.Element;
  style?: ViewStyle;
  disabled?: boolean;
  onValueChange?: (value: any) => void;
  getValue?: (current: any) => any;
  getActive?: (current: any) => boolean;
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
const Basic: FC<IBasicFormatProps> = (props) => {
  const { format, icon, style, onValueChange, getValue, getActive, disabled } =
    props;
  const { formatValue, setFormatValue, internalDisabled } = useFormat(format);

  const onPress = React.useCallback(() => {
    const nextValue = getValue ? getValue(formatValue) : !formatValue;
    setFormatValue(nextValue, 'user');
    onValueChange?.(nextValue);
  }, [getValue, formatValue, setFormatValue, onValueChange]);

  const isActive = getActive ? getActive(formatValue) : Boolean(formatValue);
  const isDisabled = Boolean(internalDisabled || disabled);

  return (
    <TouchableOpacity
      style={{ ...styles.default, ...style }}
      onPress={onPress}
      disabled={isDisabled}
    >
      {icon ? icon(isActive, isDisabled) : <Text>?</Text>}
    </TouchableOpacity>
  );
};

export default Basic;
