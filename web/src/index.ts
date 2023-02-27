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
    .call(RNResolverTokenBuiltin.OnWebViewInit)
    .then((config) => {
      console.log('config', config);
      const loadPromise: Promise<void>[] = [];
      config.scriptsURL.forEach((url) => {
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
      config.cssURL.forEach((url) => {
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
      Promise.allSettled(loadPromise).then(() => {
        console.log('assets loaded');
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
