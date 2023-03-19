# React Native Rich Editor Advanced Guide

This guide will introduce you to some advanced usage so that you can highly customize the editor.

## Guide Index

- [Customized Format](Advanced-Guide.md#customized-format)
- [Bridge](Advanced-Guide.md#bridge)
  - [What is the Bridge?](Advanced-Guide.md#what-is-the-bridge)
  - [How to use it?](Advanced-Guide.md#how-to-use-it)
  - [How to register a new bridge](Advanced-Guide.md#how-to-register-a-new-bridge)


### Customized Format
There are already some preset format you can find You can find in [Format](../src/react-native/components/format/index.ts).
But sometimes it doesn't meet your needs. Here is an example for a `SizeFormat` to control the font size.

You can use hook `useFormat` to help you creat a new format component, Note that this hook only can be used in child component of `ReactNativeRichEditor`

Example:
```tsx
import { useFormat } from '@ziqch/react-native-rich-editor';

const CustomizeFormatSize = () => {
  // you can get value and setter from hook: useFormat.
  const { formatValue, setFormatValue, internalDisabled } = useFormat(
    'size',
    false
  );

  // update the format value then selected.
  const onValueChange = React.useCallback(
    (value: any) => {
      setFormatValue(value);
    },
    [setFormatValue]
  );

  // disabled by internal reason, like: loading/input composing...
  const isDisabled = Boolean(internalDisabled);

  // use a Picker selector to change the format value.
  return (
    <View>
      <Picker
        value={formatValue}
        onValueChange={onValueChange}
        items={[
          { value: 'small', label: 'Small' },
          { value: false, label: 'Normal' },
          { value: 'large', label: 'Large' },
          { value: 'huge', label: 'Huge' }
        ]}
        disabled={isDisabled}
      />
    </View>
  );
};
// then use it in editor
const MyComponent = () => {
  return (
    <ReactNativeRichEditor
      // ...
    >
      <RichEditorToolBar
        tools={[
          <CustomizeFormatSize />,
        ]}
      />
    </ReactNativeRichEditor>
  );
};
```

Note that you can only define formats that [Quilljs supports](https://quilljs.com/docs/formats/).
If you want to create a new format, you must register it in Quilljs, please go to this guide.

### Bridge

#### What is the Bridge?

We use the `WebView` to render the Quilljs editor, so we need to build a bridge to connect between webview side and react-native side,
and we can easily call methods from one side to another.
So we defined the Bridge:

```ts
type ResolverList = { [K in string]: (...args: any) => any };
class Bridge<SOURCE extends ResolverList, TARGET extends ResolverList> {}
```

The `Bridge` will be constructed in `SOURCE` side, and it can invoke the method in `TARGET` side.

A resolverList which type matches the `SOURCE` must be passed to the bridge, it records the implement of methods in `SOURCE` side.

`TARGE` type just for type checking, for `bridge.call(targetMethodToken, ...args)`, there will be a complete hint of the type.

Another `Brige` should be constructed at `Target` side. so they can call method between each other.

#### How to use it

There is already builtin bridge, you can get it from hook `useBuiltinBridge`
Note that this hook only can be used in child component of `ReactNativeRichEditor`

```ts
import { useBuiltinBridge } from '@ziqch/react-native-rich-editor';
const bridge__builtin = useBuiltinBridge();
```

You can call methods that implemented in webview side, like: `GetContents`, `SetContents`
`birdge.call(Tonke, ...args)` will always return a `Promise` and will be resolved with return value.

All builtin methods defined in `QuillResolverTokenBuiltin` and `RNResolverTokenBuiltin`.

```ts
import { useBuiltinBridge, QuillResolverTokenBuiltin } from '@ziqch/react-native-rich-editor';
const bridge__builtin = useBuiltinBridge();
const content = await bridge__builtin.call(QuillResolverTokenBuiltin.GetContents);
bridge__builtin.call(QuillResolverTokenBuiltin.SetContents, newContent);
```

#### How to register a new bridge

The builtin bridge provide the basic methods.
if you want to implement special logic, I think the best way is to create a new bridge and defined your methods.

##### Step1. Defined the token and resolver list type

You need define the token and resolver list type.

```tsx
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
```

##### Step2. use Register bridge hook and implement resolver in React Native side

use `useBridgeRegisterWithTarget` or `useBridgeRegisterWithoutTarget` component to register a new bridge.

Note that it only can be used as a child component of `ReactNativeRichEditor`.

`useBridgeRegisterWithTarget` will register target bridge in WebView, but it should wait WebView to be ready, and the bridge may be `undefined` first time.
`useBridgeRegisterWithoutTarget` will not, it always returns a bridge.

```tsx
import {
  useBridgeRegisterWithTarget
} from '@ziqch/react-native-rich-editor';
const MyBridge = 'MyBridge';
export const CustomizeBridge = () => {
  // we suggest provide your resolver list type, so you can get a better type hint.
  const myBridge = useBridgeRegisterWithTarget<
    ReactNativeResolverList,
    WebViewMethodResolverList
  >(MyBridge, {
    // implement the reolver.
    [ReactNativeMethodTokens.GetReactNativePlatform]: () => Platform.OS,
  });
  return <></>;
};

const MyComponent = () => {
  return (
    <ReactNativeRichEditor
      // ...
    >
      {/* put your component inside ReactNativeRichEditor */}
      <CustomizeBridge />
    </ReactNativeRichEditor>
  );
};
```

##### Step3. Implement resolver in WebView side

Use `injectJavaScript` in `EditorContext`, you can inject js scripts to WebView, we use it to implement the resolver.

`WebViewBridgeSDK` will contains some helper function to help you get the env in WebView. You can go to API doc for more details.

```tsx
import {
  BridgeRegistryKey,
  useEditorContext,
  WebViewBridgeSDK,
} from '@ziqch/react-native-rich-editor';

//...

const { injectJavaScript } = useEditorContext();
await injectJavaScript(`
    const bridge = ${WebViewBridgeSDK}.${BridgeRegistryKey}.get('${MyBridge}');
    bridge.registerResolvers({
      ['${WebViewMethodTokens.GetWebViewUserAgent}']: async () => {
        const reactNativePlatform = await bridge.call('${ReactNativeMethodTokens.GetReactNativePlatform}');
        return \`Received react-native platform: $\{reactNativePlatform}, \\n my user agent is $\{navigator.userAgent}\`
      }
    });
  `);
```
##### Step4. Call method and get a result

The full example like this:

```tsx
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
    // call method
    const message = await myBridge?.call(
      WebViewMethodTokens.GetWebViewUserAgent
    );
    message && setInfo(message);
  }, [injectJavaScript, myBridge]);
  React.useEffect(() => {
    // when isEditorReady changed to true, the WebView has been ready.
    if (isEditorReady) {
      updateInfo();
    }
  }, [isEditorReady, updateInfo]);

  return <Text>Info is: {info}</Text>;
};
```


