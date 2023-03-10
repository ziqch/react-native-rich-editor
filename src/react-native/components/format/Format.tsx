import React, { FC } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import type { Sources } from 'quill';
import { useFormat } from '../../hooks/useFormat';
import { useFormatterDisabled } from '../../hooks/useFormatterDisabled';

export interface IFormatProps {
  format: string;
  icon?: string | (() => JSX.Element);
  style?: ViewStyle;
  disabled?: boolean;
  onValueChange?: (value: any) => void;
  render?: (
    value: any,
    setFormat: (v: any, source?: Sources) => void
  ) => JSX.Element;
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
const Format: FC<IFormatProps> = (props) => {
  const { format, icon, render, style, onValueChange } = props;
  const { formatValue, setFormatValue } = useFormat(format);

  const onPress = React.useCallback(() => {
    setFormatValue(!formatValue, 'user');
    onValueChange?.(!formatValue);
  }, [setFormatValue, formatValue, onValueChange]);

  const disabled = useFormatterDisabled(props.disabled);
  const isActive = !!formatValue;
  const buttonColor = React.useMemo(() => {
    if (disabled) return 'gray';
    else if (isActive) return '#06c';
    else return 'black';
  }, [disabled, isActive]);

  return render ? (
    render(formatValue, setFormatValue)
  ) : (
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
          size={24}
          color={buttonColor}
        />
      )}
    </TouchableOpacity>
  );
};

export default Format;
