import init from './QuillEditor';
import {
  Bridge,
  QuillResolversBuiltin,
  ReactNativeBridgeToken,
  RNResolversBuiltin,
  RNResolverTokenBuiltin,
  WebViewResolversBuiltin,
  WebViewResolverTokenBuiltin,
} from '../utils';

const isURL = (str: string) => {
  const reg = /^((http|https):\/\/)/;
  return reg.test(str);
};

const loadScripts = async (scriptList: string[] = []) => {
  const loadPromise: Promise<void>[] = [];
  scriptList.forEach((urlOrText) => {
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    if (isURL(urlOrText)) {
      script.setAttribute('src', urlOrText);
      loadPromise.push(
        new Promise<void>((revolve, reject) => {
          script.onload = () => revolve();
          script.onabort = () => reject();
        })
      );
      document.body.append(script);
    } else {
      script.innerText = urlOrText;
      document.body.append(script);
      loadPromise.push(Promise.resolve());
    }
  });
  return Promise.allSettled(loadPromise).then(() => console.log('all set!'));
};

const loadCss = async (cssList: string[] = []) => {
  const loadPromise: Promise<void>[] = [];
  cssList.forEach((urlOrText) => {
    if (isURL(urlOrText)) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', urlOrText);
      loadPromise.push(
        new Promise<void>((revolve, reject) => {
          link.onload = () => revolve();
          link.onabort = () => reject();
        })
      );
      document.body.append(link);
    } else {
      const style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.innerText = urlOrText;
      document.body.append(style);
      loadPromise.push(Promise.resolve());
    }
  });
  return Promise.allSettled(loadPromise);
};

try {
  Bridge.setSender((data) =>
    (window as any).ReactNativeWebView.postMessage(data)
  );

  const reactNativeBridge = new Bridge<
    QuillResolversBuiltin & WebViewResolversBuiltin,
    RNResolversBuiltin
  >();
  (window as any)[ReactNativeBridgeToken] = reactNativeBridge;
  reactNativeBridge.registerResolvers({
    [WebViewResolverTokenBuiltin.LoadAssets]: ({ scriptList, cssList }) => {
      return Promise.allSettled([loadScripts(scriptList), loadCss(cssList)]);
    },
  });

  reactNativeBridge
    .call(RNResolverTokenBuiltin.OnWebViewInit)
    .then(async (config) => {
      if (config.quillOptions?.syntax && config.quillOptions?.syntaxAssets) {
        await loadScripts([config.quillOptions.syntaxAssets?.script]);
        await loadCss([config.quillOptions.syntaxAssets?.css]);
      }
      await loadScripts([config.quillScript]);
      await loadCss(config.cssList);
      init(reactNativeBridge, config.quillOptions);
      loadScripts(config.scriptsList);
      reactNativeBridge.call(RNResolverTokenBuiltin.OnEditorReady);
    });
} catch (e: any) {
  console.log('test build');
  const error = document.createElement('div');
  error.innerText = e.message;
  document.body.append(error);
}
