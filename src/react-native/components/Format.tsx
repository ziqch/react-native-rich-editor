import React, { FC } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useBridge } from '../hooks/useBridge';
import {
  BuiltinBridgeKey,
  QuillResolversBuiltin,
  QuillResolverTokenBuiltin,
  RNResolversBuiltin,
} from '../../utils';
import type { Sources, StringMap } from 'quill';

export interface IFormatProps {
  format: string;
  icon?: string | (() => JSX.Element);
  style?: ViewStyle;
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
export const Format: FC<IFormatProps> = (props) => {
  const { format, icon, render, style } = props;
  const [value, setValue] = React.useState(null);
  const bridge__builtin = useBridge<RNResolversBuiltin, QuillResolversBuiltin>(
    BuiltinBridgeKey
  );
  const setFormat = React.useCallback(
    (v: any, source?: Sources) => {
      bridge__builtin
        .call(QuillResolverTokenBuiltin.Format, format, v, source)
        .then(() => setValue(v));
    },
    [bridge__builtin, format]
  );
  const onPress = React.useCallback(() => {
    setFormat(!value);
  }, [setFormat, value]);
  React.useEffect(() => {
    FormatEventChannel.getInstance().subscribe((formats) => {
      if (formats[format]) {
        setValue(formats[format]);
      } else {
        setValue(null);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isActive = !!value;

  return render ? (
    render(value, setFormat)
  ) : (
    <TouchableOpacity style={{ ...styles.default, ...style }} onPress={onPress}>
      {typeof icon === 'function' ? (
        icon()
      ) : (
        <FontAwesome5
          name={icon}
          size={18}
          color={isActive ? 'blue' : 'black'}
        />
      )}
    </TouchableOpacity>
  );
};

export class FormatEventChannel {
  private static readonly subscriptions: ((formats: StringMap) => void)[] = [];

  private constructor() {}

  private static instance: FormatEventChannel;

  public static getInstance() {
    if (!FormatEventChannel.instance) {
      FormatEventChannel.instance = new FormatEventChannel();
    }
    return FormatEventChannel.instance;
  }

  public subscribe(cb: (formats: StringMap) => void) {
    FormatEventChannel.subscriptions.push(cb);
  }

  public publish(formats: StringMap) {
    FormatEventChannel.subscriptions.forEach((cb) => cb(formats));
  }
}
