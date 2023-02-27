import type { QuillOptionsStatic, DeltaOperation } from 'quill';

export class Resolver<F extends (...args: any) => any> {
  private static readonly allResolvers = new Map<string, Resolver<any>>();
  public readonly token: string;
  private readonly resolver: F | undefined;
  constructor(token: string, resolver?: F) {
    this.token = token;
    this.resolver = resolver;
    Resolver.allResolvers.set(token, this);
  }

  public resolve(...args: Parameters<F>): ReturnType<F> {
    if (this.resolver) {
      return this.resolver.apply(this, args);
    } else {
      throw Error(`Unregistered Resolver: ${this.token}`);
    }
  }
}

export enum RNResolverTokenBuiltin {
  OnTextLengthChange = '@CALL[OnTextLengthChange]__builtin',
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
}

export interface WebViewInitializeConfig {
  scriptsURL: string[];
  cssURL: string[];
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
  getContents = '@CALL[getContents]__builtin',
  getLength = '@CALL[getLength]__builtin',
  getText = '@CALL[getText]__builtin',
  setContents = '@CALL[setContents]__builtin',
  setText = '@CALL[setText]__builtin',
  updateContents = '@CALL[updateContents]__builtin',
  quillAPI = '@CALL[quillAPI]__builtin',
}
export interface QuillResolverListBuiltin {
  [QuillResolverTokenBuiltin.Focus]: Resolver<() => void>;
  [QuillResolverTokenBuiltin.Blur]: Resolver<() => void>;
  [QuillResolverTokenBuiltin.Undo]: Resolver<() => void>;
  [QuillResolverTokenBuiltin.Redo]: Resolver<() => void>;
  [QuillResolverTokenBuiltin.getContents]: Resolver<
    (index: number, length: number) => DeltaOperation[]
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
