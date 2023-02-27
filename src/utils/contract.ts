import type { QuillOptionsStatic, DeltaOperation } from 'quill';
import type { Resolver } from './Resolver';

export enum RNResolverTokenBuiltin {
  OnTextChange = '@CALL[OnTextChange]__builtin',
  SetReactNativeState = '@CALL[SetReactNativeState]__builtin',
  ScrollWebView = '@CALL[ScrollWebView]__builtin',
  OnWebViewInit = '@CALL[onWebViewInit]__builtin',
  OnEditorReady = '@CALL[OnEditorReady]__builtin',
}

export enum Direction {
  UP,
  DOWN,
}

export interface RNResolverListBuiltin {
  [RNResolverTokenBuiltin.SetReactNativeState]: Resolver<
    (key: string, value: string) => void
  >;
  [RNResolverTokenBuiltin.ScrollWebView]: Resolver<
    (offset: number, direction: Direction) => void
  >;
  [RNResolverTokenBuiltin.OnWebViewInit]: Resolver<
    () => WebViewInitializeConfig
  >;
  [RNResolverTokenBuiltin.OnEditorReady]: Resolver<() => void>;
  [RNResolverTokenBuiltin.OnTextChange]: Resolver<
    (delta: DeltaOperation[]) => void
  >;
}

export interface WebViewInitializeConfig {
  quillScript: string;
  scriptsList?: string[];
  cssList?: string[];
  initialValue: DeltaOperation[];
  quillOptions: QuillOptionsStatic;
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
  UpdateContents = '@CALL[UpdateContents]__builtin',
  QuillAPI = '@CALL[QuillAPI]__builtin',
}
export interface QuillResolverListBuiltin {
  [QuillResolverTokenBuiltin.Focus]: Resolver<() => void>;
  [QuillResolverTokenBuiltin.Blur]: Resolver<() => void>;
  [QuillResolverTokenBuiltin.Undo]: Resolver<() => void>;
  [QuillResolverTokenBuiltin.Redo]: Resolver<() => void>;
  [QuillResolverTokenBuiltin.GetContents]: Resolver<
    (index?: number, length?: number) => DeltaOperation[]
  >;
  // [QuillResolverTokenBuiltin.getLength]: Resolver<() => number>;
  // [QuillResolverTokenBuiltin.getText]: Resolver<
  //   (index: number, length: number) => string
  // >;
  // [QuillResolverTokenBuiltin.setContents]: Resolver<
  //   (delta: DeltaOperation[], source: string) => DeltaOperation[]
  // >;
  // [QuillResolverTokenBuiltin.setText]: Resolver<
  //   (text: string, source: string) => DeltaOperation[]
  // >;
  // [QuillResolverTokenBuiltin.updateContents]: Resolver<
  //   (delta: DeltaOperation[], source: string) => DeltaOperation[]
  // >;
  // [QuillResolverTokenBuiltin.quillAPI]: Resolver<
  //   (functionName: string, ...args: any) => any
  // >;
}

export const ReactNativeBridgeToken = '$ReactNativeBridge';
export const QuillInstanceToken = '$QuillInstance';
