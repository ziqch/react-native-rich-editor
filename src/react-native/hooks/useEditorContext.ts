import React from 'react';
import { EditorContext } from '../components/context/EditorContext';

export const useEditorContext = () => {
  return React.useContext(EditorContext);
};
