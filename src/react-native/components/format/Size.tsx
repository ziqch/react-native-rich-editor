import React, { FC } from 'react';
import Picker from 'react-native-picker-select';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { useFormat } from '../../hooks/useFormat';
import { useFormatterDisabled } from '../../hooks/useFormatterDisabled';

export interface ISizeFormatProps {
  style?: ViewStyle;
  selections?: Array<{
    value: any;
    label: string;
  }>;
  disabled?: boolean;
  onValueChange?: (itemValue: any, itemIndex: number) => void;
}
const defaultSelections = [
  {
    value: 'small',
    label: 'Small',
  },
  {
    value: false,
    label: 'Normal',
  },
  {
    value: 'large',
    label: 'Large',
  },
  {
    value: 'huge',
    label: 'Huge',
  },
];
const Size: FC<ISizeFormatProps> = (props) => {
  const { selections = defaultSelections } = props;
  const { formatValue, setFormatValue } = useFormat('size', false);
  const onValueChange = React.useCallback(
    (value: any, index: number) => {
      setFormatValue(value);
      props.onValueChange?.(value, index);
    },
    [props, setFormatValue]
  );
  const disabled = useFormatterDisabled(props.disabled);
  const style = StyleSheet.create({
    container: { width: Platform.OS === 'android' ? 150 : 80, ...props.style },
  });
  return (
    <View style={style.container}>
      <Picker
        value={formatValue}
        placeholder={{}}
        onValueChange={onValueChange}
        items={selections}
        disabled={disabled}
      />
    </View>
  );
};

export default Size;
