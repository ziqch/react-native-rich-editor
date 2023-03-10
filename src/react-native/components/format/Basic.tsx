import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useFormat } from '../../hooks/useFormat';
import { useFormatDisabled } from '../../hooks';

export interface IBasicFormatProps {
  format: string;
  icon?: string | (() => JSX.Element);
  style?: ViewStyle;
  disabled?: boolean;
  onValueChange?: (value: any) => void;
  customValue?: (current: any) => any;
  customActive?: (current: any) => boolean;
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
const colorActive = 'rgba(0,102,204,1)';
const colorDisabled = 'rgba(158,158,158, 1)';
const colorActiveDisabled = 'rgba(0,102,204,0.4)';
const Basic: FC<IBasicFormatProps> = (props) => {
  const { format, icon, style, onValueChange, customValue, customActive } =
    props;
  const { formatValue, setFormatValue } = useFormat(format);

  const onPress = React.useCallback(() => {
    const nextValue = customValue ? customValue(formatValue) : !formatValue;
    setFormatValue(nextValue, 'user');
    onValueChange?.(nextValue);
  }, [customValue, formatValue, setFormatValue, onValueChange]);

  const disabled = useFormatDisabled(props.disabled);
  const isActive = customActive ? customActive(formatValue) : !!formatValue;
  const buttonColor = React.useMemo(() => {
    if (disabled && isActive) return colorActiveDisabled;
    else if (disabled) return colorDisabled;
    else if (isActive) return colorActive;
    else return 'black';
  }, [disabled, isActive]);

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

export default Basic;
