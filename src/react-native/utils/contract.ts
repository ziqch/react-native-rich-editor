import type { DeltaOperation, RangeStatic, Sources, StringMap } from 'quill';
import type { Bridge } from './Bridge';

export enum RNResolverTokenBuiltin {
  OnTextChange = '@CALL[OnTextChange]__builtin',
  OnSelectionChange = '@CALL[OnSelectionChange]__builtin',
  UpdateFormat = '@CALL[UpdateFormat]__builtin',
  SetReactNativeState = '@CALL[SetReactNativeState]__builtin',
  ScrollWebView = '@CALL[ScrollWebView]__builtin',
  OnWebViewInit = '@CALL[onWebViewInit]__builtin',
  OnEditorReady = '@CALL[OnEditorReady]__builtin',
  OnMentionsOpen = '@CALL[OnMentionsOpen]__builtin',
  OnMentionsClose = '@CALL[OnMentionsClose]__builtin',
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
  [RNResolverTokenBuiltin.OnMentionsOpen]: (e: {
    searchTerm: string;
    mentionChar: string;
  }) => void;
  [RNResolverTokenBuiltin.OnMentionsClose]: () => void;
};

export interface QuillEditorOptions {
  placeholder?: string;
  scrollOffsetBuffer?: number;
  platform?: string;
  readOnly?: boolean;
  syntax?: boolean;
  syntaxAssets?: {
    script: string;
    css: string;
  };
}

export interface WebViewInitializeConfig {
  quillScript: string;
  scriptsList?: string[];
  cssList?: string[];
  quillOptions?: QuillEditorOptions;
}

export enum QuillResolverTokenBuiltin {
  AddImage = '@CALL[AddImage]__builtin',
  Undo = '@CALL[Undo]__builtin',
  Redo = '@CALL[Redo]__builtin',
  GetContents = '@CALL[GetContents]__builtin',
  GetMarkdown = '@CALL[GetMarkdown]__builtin',
  GetLength = '@CALL[GetLength]__builtin',
  GetText = '@CALL[GetText]__builtin',
  SetContents = '@CALL[SetContents]__builtin',
  SetText = '@CALL[SetText]__builtin',
  Format = '@CALL[Format]__builtin',
  SetSelection = '@CALL[SetSelection]__builtin',
  Blur = '@CALL[Blur]__builtin',
  Focus = '@CALL[Focus]__builtin',
  QuillAPI = '@CALL[QuillAPI]__builtin',
  Layout = '@CALL[Layout]__builtin',
  InsertMention = '@CALL[InsertMention]__builtin',
}

export type QuillResolversBuiltin = {
  [QuillResolverTokenBuiltin.AddImage]: (sources: string[]) => void;
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
  [QuillResolverTokenBuiltin.GetMarkdown]: () => Promise<string>;
  [QuillResolverTokenBuiltin.Format]: (
    name: string,
    value: any,
    source?: Sources
  ) => DeltaOperation[];
  [QuillResolverTokenBuiltin.SetSelection]: (
    index: number,
    length: number,
    source?: Sources
  ) => void;
  [QuillResolverTokenBuiltin.Blur]: () => void;
  [QuillResolverTokenBuiltin.Focus]: () => void;
  [QuillResolverTokenBuiltin.Layout]: () => void;
  [QuillResolverTokenBuiltin.InsertMention]: (
    searchTerm: string,
    value: string
  ) => void;
};

export enum WebViewResolverTokenBuiltin {
  LoadAssets = '@CALL[LoadAssets]__builtin',
}

export type WebViewResolversBuiltin = {
  [WebViewResolverTokenBuiltin.LoadAssets]: (assets: {
    scriptList?: string[];
    cssList?: string[];
  }) => void;
};

export type BuiltinBridgeRN = Bridge<
  RNResolversBuiltin,
  WebViewResolversBuiltin & QuillResolversBuiltin
>;

export type BuiltinBridgeWebView = Bridge<
  WebViewResolversBuiltin & QuillResolversBuiltin,
  RNResolversBuiltin
>;

export const QuillEditorKey = '$QuillEditorKey';
export const BuiltinBridgeKey = '$Bridge__builtin';
export const BridgeRegistryKey = '$BridgeRegistryKey';

export const WebViewBridgeSDK = '$WebViewBridgeSDK';
