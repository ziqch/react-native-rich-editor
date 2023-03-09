import React from 'react';
import { useBuiltinBridge } from './useBridge';
import { QuillResolverTokenBuiltin } from '../../utils';
import type { Sources } from 'quill';
import { FormatEventChannel } from '../utils';

export const useFormat = (format: string, defaultValue: any = false) => {
  const [value, setValue] = React.useState<any | false>(defaultValue);
  const bridge__builtin = useBuiltinBridge();
  const setFormat = React.useCallback(
    (v: any, source?: Sources) => {
      bridge__builtin
        .call(QuillResolverTokenBuiltin.Format, format, v, source)
        .then(() => setValue(v));
    },
    [bridge__builtin, format]
  );
  React.useEffect(() => {
    FormatEventChannel.getInstance().subscribe((formats) => {
      setValue(formats[format] ?? false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return {
    formatValue: value,
    setFormatValue: setFormat,
  };
};
