import React, { FC } from 'react';
import type { IBasicFormatProps } from './Basic';
import Basic from './Basic';

export interface IListFormatProps
  extends Omit<IBasicFormatProps, 'customValue' | 'format'> {
  type: 'ordered' | 'bullet';
}

const List: FC<IListFormatProps> = (props) => {
  const customValue = (currentType: string) => {
    return currentType === props.type ? false : props.type;
  };
  const customActive = (currentType: string) => {
    return currentType === props.type;
  };
  switch (props.type) {
    case 'ordered':
      return (
        <Basic
          format={'list'}
          customValue={customValue}
          customActive={customActive}
          icon={'format-list-numbered'}
          {...props}
        />
      );
    case 'bullet':
      return (
        <Basic
          format={'list'}
          customValue={customValue}
          customActive={customActive}
          icon={'format-list-bulleted'}
          {...props}
        />
      );
    default:
      return <></>;
  }
};

export default List;
