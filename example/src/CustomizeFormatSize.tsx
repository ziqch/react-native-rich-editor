import React from 'react';
import Picker from 'react-native-picker-select';
import { Platform, StyleSheet, View } from 'react-native';
import { useFormat } from '@bean-app/react-native-rich-editor';

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
  const value = React.useMemo(() => {
    return Array.isArray(formatValue) ? false : formatValue;
  }, [formatValue]);
  const onValueChange = React.useCallback(
    (newValue: any) => {
      if (newValue !== value) {
        setFormatValue(newValue);
      }
    },
    [setFormatValue, value]
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
        style={{ inputIOS: { alignSelf: 'center' } }}
        value={value}
        placeholder={{}}
        onValueChange={onValueChange}
        items={selections}
        disabled={isDisabled}
      />
    </View>
  );
};

export default CustomizeFormatSize;
