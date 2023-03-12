import React, { FC } from 'react';
import type { IBasicFormatProps } from './Basic';
import Basic from './Basic';

export interface IScriptFormatProps
  extends Omit<IBasicFormatProps, 'customValue' | 'format'> {
  type: 'super' | 'sub';
}

const Script: FC<IScriptFormatProps> = (props) => {
  const customValue = (currentType: string) => {
    return currentType === props.type ? false : props.type;
  };
  const customActive = (currentType: string) => {
    return currentType === props.type;
  };
  switch (props.type) {
    case 'super':
      return (
        <Basic
          format={'script'}
          customValue={customValue}
          customActive={customActive}
          icon={'superscript'}
          {...props}
        />
      );
    case 'sub':
      return (
        <Basic
          format={'script'}
          customValue={customValue}
          customActive={customActive}
          icon={'subscript'}
          {...props}
        />
      );
    default:
      return <></>;
  }
};

export default Script;
