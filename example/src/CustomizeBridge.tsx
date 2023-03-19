import React from 'react';
import {
  BridgeRegistryKey,
  useBridgeRegisterWithTarget,
  useEditorContext,
  WebViewBridgeSDK,
} from '@ziqch/react-native-rich-editor';
import { Platform, Text } from 'react-native';

enum WebViewMethodTokens {
  GetWebViewUserAgent = 'GetWebViewUserAgent',
  // other tokens...
}
type WebViewMethodResolverList = {
  [WebViewMethodTokens.GetWebViewUserAgent]: () => string;
  // other methods definition
};
enum ReactNativeMethodTokens {
  GetReactNativePlatform = 'GetReactNativePlatform',
  // other tokens...
}
type ReactNativeResolverList = {
  [ReactNativeMethodTokens.GetReactNativePlatform]: () => typeof Platform.OS;
  // other methods definition
};

const MyBridge = 'MyBridge';
export const CustomizeBridge = () => {
  const { injectJavaScript, isEditorReady } = useEditorContext();
  const [info, setInfo] = React.useState('');
  const myBridge = useBridgeRegisterWithTarget<
    ReactNativeResolverList,
    WebViewMethodResolverList
  >(MyBridge, {
    [ReactNativeMethodTokens.GetReactNativePlatform]: () => Platform.OS,
  });
  const updateInfo = React.useCallback(async () => {
    await injectJavaScript(`
      const bridge = ${WebViewBridgeSDK}.${BridgeRegistryKey}.get('${MyBridge}');
      bridge.registerResolvers({
        ['${WebViewMethodTokens.GetWebViewUserAgent}']: async () => {
          const reactNativePlatform = await bridge.call('${ReactNativeMethodTokens.GetReactNativePlatform}');
          return \`Received react-native platform: $\{reactNativePlatform}, \\n my user agent is $\{navigator.userAgent}\`
        }
      });
    `);
    const message = await myBridge?.call(
      WebViewMethodTokens.GetWebViewUserAgent
    );
    message && setInfo(message);
  }, [injectJavaScript, myBridge]);
  React.useEffect(() => {
    if (isEditorReady) {
      updateInfo();
    }
  }, [isEditorReady, updateInfo]);

  return <Text>Info is: {info}</Text>;
};
