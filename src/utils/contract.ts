import type { QuillOptionsStatic, DeltaOperation } from 'quill';
import type { Resolver } from './Resolver';

export enum RNResolverTokenBuiltin {
  OnTextChange = '@CALL[OnTextChange]__builtin',
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

export type RNResolverListBuiltin = Array<
  | Resolver<
      RNResolverTokenBuiltin.SetReactNativeState,
      (key: string, value: string) => void
    >
  | Resolver<
      RNResolverTokenBuiltin.ScrollWebView,
      (offset: number, direction: Direction) => void
    >
  | Resolver<
      RNResolverTokenBuiltin.OnWebViewInit,
      () => WebViewInitializeConfig
    >
  | Resolver<RNResolverTokenBuiltin.OnEditorReady, () => void>
  | Resolver<
      RNResolverTokenBuiltin.OnTextChange,
      (delta: DeltaOperation[]) => void
    >
  | Resolver<RNResolverTokenBuiltin.UpdateFormat, (format: string[]) => void>
>;
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
export type QuillResolverListBuiltin = Array<
  | Resolver<QuillResolverTokenBuiltin.Focus, () => void>
  | Resolver<QuillResolverTokenBuiltin.Blur, () => void>
  | Resolver<QuillResolverTokenBuiltin.Undo, () => void>
  | Resolver<QuillResolverTokenBuiltin.Redo, () => void>
  | Resolver<
      QuillResolverTokenBuiltin.GetContents,
      (index?: number, length?: number) => DeltaOperation[]
    >
>;

export const ReactNativeBridgeToken = '$ReactNativeBridge';
export const QuillInstanceToken = '$QuillInstance';
export const BridgeBuiltinKey = 'Bridge__builtin';
