import React, { FC } from 'react';
import type { IBasicFormatProps } from './Basic';
import Basic from './Basic';
import { useBuiltinBridge } from '../../hooks/useBridge';
import { useEditorContext } from '../../hooks/';

export interface ICodeBlockFormatProps
  extends Omit<IBasicFormatProps, 'customValue' | 'format'> {
  languages: string[];
}

const CodeBlock: FC<ICodeBlockFormatProps> = (props) => {
  const bridge__builtin = useBuiltinBridge();
  const { isEditorReady, injectJavaScript } = useEditorContext();
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    const load = async () => {
      await injectJavaScript(
        `hljs.configure({languages: ${JSON.stringify(props.languages)}});`
      );
      setIsLoading(false);
    };
    if (isEditorReady) {
      load();
    }
  }, [bridge__builtin, injectJavaScript, isEditorReady, props.languages]);
  return (
    <Basic
      format={'code-block'}
      {...props}
      disabled={isLoading || props.disabled}
    />
  );
};

export default CodeBlock;
