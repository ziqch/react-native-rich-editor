import React, { FC } from 'react';
import type { IBasicFormatProps } from './Basic';
import Basic from './Basic';

export interface IListFormatProps
  extends Omit<IBasicFormatProps, 'getValue' | 'format' | 'getActive'> {
  type: 'ordered' | 'bullet';
}

const List: FC<IListFormatProps> = (props) => {
  const getValue = (currentType: string) => {
    return currentType === props.type ? false : props.type;
  };
  const getActive = (currentType: string) => {
    return currentType === props.type;
  };
  switch (props.type) {
    case 'ordered':
      return (
        <Basic
          format={'list'}
          getValue={getValue}
          getActive={getActive}
          {...props}
        />
      );
    case 'bullet':
      return (
        <Basic
          format={'list'}
          getValue={getValue}
          getActive={getActive}
          {...props}
        />
      );
    default:
      return <></>;
  }
};

export default List;
