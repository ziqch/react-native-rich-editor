import React from 'react';
import { BridgeContext } from '../components/bridge/BridgeContext';
export const useEditorReady = () => {
  const { isEditorReady } = React.useContext(BridgeContext);
  return React.useMemo(() => {
    return isEditorReady;
  }, [isEditorReady]);
};
