import React from 'react';
import { BridgeContext } from '../components/bridge/BridgeContext';

export const useFormatDisabled = (disabledFromProps?: boolean) => {
  const { isEditorReady, isInputComposing } = React.useContext(BridgeContext);
  return React.useMemo(() => {
    return !isEditorReady || isInputComposing || disabledFromProps;
  }, [disabledFromProps, isEditorReady, isInputComposing]);
};
