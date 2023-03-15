import React, { FC } from 'react';
import type { IBasicFormatProps } from './Basic';
import Basic from './Basic';

export interface IScriptFormatProps
  extends Omit<IBasicFormatProps, 'getValue' | 'format' | 'getActive'> {
  type: 'super' | 'sub';
}

const Script: FC<IScriptFormatProps> = (props) => {
  const getValue = (currentType: string) => {
    return currentType === props.type ? false : props.type;
  };
  const getActive = (currentType: string) => {
    return currentType === props.type;
  };
  switch (props.type) {
    case 'super':
      return (
        <Basic
          format={'script'}
          getValue={getValue}
          getActive={getActive}
          {...props}
        />
      );
    case 'sub':
      return (
        <Basic
          format={'script'}
          getValue={getValue}
          getActive={getActive}
          {...props}
        />
      );
    default:
      return <></>;
  }
};

export default Script;
