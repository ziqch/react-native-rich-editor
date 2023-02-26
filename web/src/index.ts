import init from './QuillEditor';
import Bridge from '../../src/utils/Bridge';
import {
  RNResolverTokenBuiltin,
  QuillResolverListBuiltin,
  RNResolverListBuiltin,
  ReactNativeBridgeToken,
} from '../../src/utils/contract';
try {
  const reactNativeBridge = new Bridge<
    QuillResolverListBuiltin,
    RNResolverListBuiltin
  >((data) => (window as any).ReactNativeWebView.postMessage(data));
  (window as any)[ReactNativeBridgeToken] = reactNativeBridge;
  console.log('webview ready!!');
  reactNativeBridge
    .call(RNResolverTokenBuiltin.OnWebViewReady)
    .then((config) => {
      console.log('config', config);
      const loadPromise: Promise<void>[] = [];
      config.scripts.forEach((scriptUrl) => {
        const script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', scriptUrl);
        loadPromise.push(
          new Promise<void>((revolve, reject) => {
            script.onload = () => revolve();
            script.onabort = () => reject();
          })
        );
        document.body.append(script);
      });
      Promise.allSettled(loadPromise).then(() => {
        console.log('quill loaded');
        (window as any).$QuillEditor = init(
          '$editor',
          reactNativeBridge,
          config.initialValue,
          config.quillOptions
        );
        console.log('quill ready');
      });
    });
} catch (e: any) {
  const error = document.createElement('div');
  error.innerText = e.message;
  document.body.append(error);
}
