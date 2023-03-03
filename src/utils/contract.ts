import type {
  DeltaOperation,
  QuillOptionsStatic,
  RangeStatic,
  Sources,
  StringMap,
} from 'quill';

export enum RNResolverTokenBuiltin {
  OnTextChange = '@CALL[OnTextChange]__builtin',
  OnSelectionChange = '@CALL[OnSelectionChange]__builtin',
  UpdateFormat = '@CALL[UpdateFormat]__builtin',
  SetReactNativeState = '@CALL[SetReactNativeState]__builtin',
  ScrollWebView = '@CALL[ScrollWebView]__builtin',
  OnWebViewInit = '@CALL[onWebViewInit]__builtin',
  OnEditorReady = '@CALL[OnEditorReady]__builtin',
}

export enum Direction {
  UP,
  DOWN,
}

export type RNResolversBuiltin = {
  [RNResolverTokenBuiltin.SetReactNativeState]: (
    key: string,
    value: string
  ) => void;
  [RNResolverTokenBuiltin.ScrollWebView]: (
    offset: number,
    direction: Direction
  ) => void;
  [RNResolverTokenBuiltin.OnWebViewInit]: () => WebViewInitializeConfig;
  [RNResolverTokenBuiltin.OnEditorReady]: () => void;
  [RNResolverTokenBuiltin.OnTextChange]: (
    delta: DeltaOperation[],
    oldDelta: DeltaOperation[],
    source?: Sources
  ) => void;
  [RNResolverTokenBuiltin.OnSelectionChange]: (
    range: RangeStatic,
    oldRange: RangeStatic,
    source?: Sources
  ) => void;
  [RNResolverTokenBuiltin.UpdateFormat]: (format: StringMap) => void;
};

export interface WebViewInitializeConfig {
  quillScript: string;
  scriptsList?: string[];
  cssList?: string[];
  quillOptions?: QuillOptionsStatic;
}

export enum QuillResolverTokenBuiltin {
  AddImage = '@CALL[AddImage]__builtin',
  Initialize = '@CALL[Initialize]__builtin',
  Focus = '@CALL[Focus]__builtin',
  Blur = '@CALL[Blur]__builtin',
  Undo = '@CALL[Undo]__builtin',
  Redo = '@CALL[Redo]__builtin',
  GetContents = '@CALL[GetContents]__builtin',
  GetLength = '@CALL[GetLength]__builtin',
  GetText = '@CALL[GetText]__builtin',
  SetContents = '@CALL[SetContents]__builtin',
  SetText = '@CALL[SetText]__builtin',
  Format = '@CALL[Format]__builtin',
  QuillAPI = '@CALL[QuillAPI]__builtin',
}

export type QuillResolversBuiltin = {
  [QuillResolverTokenBuiltin.Focus]: () => void;
  [QuillResolverTokenBuiltin.Blur]: () => void;
  [QuillResolverTokenBuiltin.Undo]: () => void;
  [QuillResolverTokenBuiltin.Redo]: () => void;
  [QuillResolverTokenBuiltin.SetContents]: (
    delta: DeltaOperation[],
    source?: Sources
  ) => DeltaOperation[];
  [QuillResolverTokenBuiltin.GetContents]: (
    index?: number,
    length?: number
  ) => DeltaOperation[];
  [QuillResolverTokenBuiltin.Format]: (
    name: string,
    value: any,
    source?: Sources
  ) => DeltaOperation[];
};

export const ReactNativeBridgeToken = '$ReactNativeBridge';
export const QuillInstanceToken = '$QuillInstance';
export const BuiltinBridgeKey = 'Bridge__builtin';
