import init from './QuillEditor';
import {
  Bridge,
  QuillInstanceToken,
  QuillResolverListBuiltin,
  ReactNativeBridgeToken,
  RNResolverListBuiltin,
  RNResolverTokenBuiltin,
} from '../utils';
import type Quill from 'quill';
import type { QuillOptionsStatic } from 'quill';

const loadScripts = async (scriptList: string[] = []) => {
  const loadPromise: Promise<void>[] = [];
  scriptList.forEach((url) => {
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', url);
    loadPromise.push(
      new Promise<void>((revolve, reject) => {
        script.onload = () => revolve();
        script.onabort = () => reject();
      })
    );
    document.body.append(script);
  });
  await Promise.allSettled(loadPromise);
};

const loadCss = async (cssList: string[] = []) => {
  const loadPromise: Promise<void>[] = [];
  cssList.forEach((url) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', url);
    loadPromise.push(
      new Promise<void>((revolve, reject) => {
        link.onload = () => revolve();
        link.onabort = () => reject();
      })
    );
    document.body.append(link);
  });
  await Promise.allSettled(loadPromise);
};

const mountQuill = (options: QuillOptionsStatic) => {
  const el = document.createElement('div');
  el.id = '$editor';
  window.document.body.append(el);
  const _Quill = (window as any).Quill as typeof Quill;
  const quill = new _Quill(el, options);
  (window as any)[QuillInstanceToken] = quill;
  return quill;
};

try {
  Bridge.setSender((data) =>
    (window as any).ReactNativeWebView.postMessage(data)
  );

  const reactNativeBridge = new Bridge<
    QuillResolverListBuiltin,
    RNResolverListBuiltin
  >();
  (window as any)[ReactNativeBridgeToken] = reactNativeBridge;

  reactNativeBridge
    .call(RNResolverTokenBuiltin.OnWebViewInit)
    .then(async (config) => {
      await loadScripts([config.quillScript]);
      await loadCss(config.cssList);
      const quill = mountQuill(config.quillOptions);
      init(quill, reactNativeBridge, config.initialValue);
      loadScripts(config.scriptsList);
      reactNativeBridge.call(RNResolverTokenBuiltin.OnEditorReady);
    });
} catch (e: any) {
  const error = document.createElement('div');
  error.innerText = e.message;
  document.body.append(error);
}
