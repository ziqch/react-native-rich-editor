import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const genButton = (name: string) => {
  const colorActive = 'rgba(0,102,204,1)';
  const colorDisabled = 'rgba(158,158,158, 1)';
  const colorActiveDisabled = 'rgba(0,102,204,0.4)';
  return (isActive: boolean, isDisabled: boolean) => {
    const calcButtonColor = () => {
      if (isDisabled && isActive) return colorActiveDisabled;
      else if (isDisabled) return colorDisabled;
      else if (isActive) return colorActive;
      else return 'black';
    };
    return <MaterialIcons name={name} size={20} color={calcButtonColor()} />;
  };
};
export default {
  Image: genButton('image'),
  Bold: genButton('format-bold'),
  Italic: genButton('format-italic'),
  Underline: genButton('format-underline'),
  Strike: genButton('format-strikethrough'),
  ListOrdered: genButton('format-list-numbered'),
  ListBullet: genButton('format-list-bulleted'),
  ScriptSuper: genButton('superscript'),
  ScriptSub: genButton('subscript'),
  Code: genButton('code'),
};
