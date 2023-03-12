import React from 'react';
import { useEditorContext } from './useEditorContext';

export const useFormatDisabled = (disabledFromProps?: boolean) => {
  const { isEditorReady, isInputComposing } = useEditorContext();
  return React.useMemo(() => {
    return !isEditorReady || isInputComposing || disabledFromProps;
  }, [disabledFromProps, isEditorReady, isInputComposing]);
};
