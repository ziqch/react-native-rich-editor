import React from 'react';
import Picker from 'react-native-picker-select';
import { Platform, StyleSheet, View } from 'react-native';
import { useFormat } from '@ziqch/react-native-rich-editor';

const selections = [
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
const CustomizeFormatSize = () => {
  const { formatValue, setFormatValue, internalDisabled } = useFormat(
    'size',
    false
  );
  const onValueChange = React.useCallback(
    (value: any) => {
      setFormatValue(value);
    },
    [setFormatValue]
  );
  const style = StyleSheet.create({
    container: {
      width: Platform.OS === 'android' ? 150 : 80,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  const isDisabled = Boolean(internalDisabled);
  return (
    <View style={style.container}>
      <Picker
        value={formatValue}
        placeholder={{}}
        onValueChange={onValueChange}
        items={selections}
        disabled={isDisabled}
      />
    </View>
  );
};

export default CustomizeFormatSize;
