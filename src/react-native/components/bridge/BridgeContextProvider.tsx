import React, { FC, PropsWithChildren } from 'react';
import type { Bridge } from '../../../utils';

interface IBridgeContextProps {
  isEditorReady: boolean;
}
interface IBridgeContextValue {
  bridges: Map<string, Bridge<any, any>>;
  isEditorReady: boolean;
  getBridge: (key: string) => Bridge<any, any> | undefined;
}
const initialValue: IBridgeContextValue = {
  bridges: new Map<string, Bridge<any, any>>(),
  isEditorReady: false,
  getBridge: () => undefined,
};
export const BridgeContext = React.createContext(initialValue);
const BridgeContextProvider: FC<PropsWithChildren<IBridgeContextProps>> = (
  props
) => {
  const bridges = React.useRef<Map<string, Bridge<any, any>>>(
    new Map<string, Bridge<any, any>>()
  );
  const value: IBridgeContextValue = React.useMemo(() => {
    return {
      bridges: bridges.current,
      getBridge: (key: string) => bridges.current.get(key),
      isEditorReady: props.isEditorReady,
    };
  }, [props.isEditorReady]);

  return (
    <BridgeContext.Provider value={value}>
      {props.children}
    </BridgeContext.Provider>
  );
};
export default BridgeContextProvider;
