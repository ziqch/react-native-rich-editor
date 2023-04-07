import type { DeltaOperation, RangeStatic, Sources } from 'quill';
import React from 'react';
import type { IEditorContextProps } from '../components/context/EditorContext';
import { Platform } from 'react-native';
import type { WebViewInitializeConfig } from '../utils';

export interface IRichEditorInnerProps {
  width: number;
  height: number;
  defaultValue?: DeltaOperation[];
  scrollOffsetBuffer?: number;
  readOnly?: boolean;
  placeholder?: string;
  syntax?: boolean;
  syntaxAssets?: {
    script: string;
    css: string;
  };
  quillScript?: string;
  injectedScriptList?: string[];
  injectedCssList?: string[];
  onTextChange?: (delta: DeltaOperation[]) => void;
  onSelectionChange?: (
    range: RangeStatic,
    oldRange: RangeStatic,
    source?: Sources
  ) => void;
  renderLoading?: () => JSX.Element;
  setEditorContextProps: React.Dispatch<
    React.SetStateAction<IEditorContextProps>
  >;
  onMentionsOpen?: (e: { searchTerm: string; mentionChar: string }) => void;
  onMentionsClose?: () => void;
  autoFocus?: boolean;
}

export const useEditorConfig = (
  props: IRichEditorInnerProps
): WebViewInitializeConfig => {
  const overrideCss = `
    img {
      width: 100% !important;
    }
    .ql-toolbar {
      display: none;
    }
    .ql-container {
      border: none !important;
    }
  `;
  return React.useMemo(() => {
    return {
      quillScript:
        props.quillScript ?? 'https://cdn.quilljs.com/1.3.6/quill.js',
      scriptsList: props.injectedScriptList ?? [],
      cssList: [
        'https://cdn.quilljs.com/1.3.6/quill.snow.css',
        overrideCss,
        ...(props.injectedCssList ?? []),
      ],
      quillOptions: {
        autoFocus: props.autoFocus,
        platform: Platform.OS,
        readOnly: props.readOnly,
        placeholder: props.placeholder,
        scrollOffsetBuffer: props.scrollOffsetBuffer,
        syntax: props.syntax,
        syntaxAssets: props.syntaxAssets ?? {
          script:
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js',
          css: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/monokai-sublime.min.css',
        },
      },
    };
  }, [
    overrideCss,
    props.autoFocus,
    props.injectedCssList,
    props.injectedScriptList,
    props.placeholder,
    props.quillScript,
    props.readOnly,
    props.scrollOffsetBuffer,
    props.syntax,
    props.syntaxAssets,
  ]);
};
