import React from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';
import { useBuiltinBridge } from './useBridge';
import { BridgeContext } from '../components/bridge/BridgeContext';
import { QuillResolverTokenBuiltin } from '../../utils';
import type { Sources } from 'quill';

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
});
export const useFocus = () => {
  const bridge__builtin = useBuiltinBridge();
  const { webViewRef } = React.useContext(BridgeContext);
  const hackInputRef = React.useRef<TextInput>(null);
  const focus = React.useCallback(
    (index: number, length: number, source?: Sources) => {
      if (Platform.OS === 'android') {
        hackInputRef.current?.focus();
        webViewRef.current?.requestFocus();
      }
      bridge__builtin.call(
        QuillResolverTokenBuiltin.SetSelection,
        index,
        length,
        source
      );
    },
    [bridge__builtin, webViewRef]
  );
  const hackInput = React.useMemo(() => {
    return Platform.OS === 'android' ? (
      <TextInput style={styles.hidden} ref={hackInputRef} />
    ) : (
      <></>
    );
  }, []);
  return {
    hackInput,
    focus,
  };
};
