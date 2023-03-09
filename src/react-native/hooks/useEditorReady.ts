import React from 'react';
import { BridgeContext } from '../components/bridge/BridgeContextProvider';
export const useEditorReady = () => {
  const { isEditorReady } = React.useContext(BridgeContext);
  return React.useMemo(() => {
    return isEditorReady;
  }, [isEditorReady]);
};
