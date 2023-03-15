# React Native Rich Editor Advanced Guide

This guide will introduce you to some advanced usage so that you can highly customize the editor.

## Guide Index

- [Customized Format](Advanced-Guide.md#customized-format)
- [Bridge](Advanced-Guide.md#bridge)
  - [What is the Bridge?](Advanced-Guide.md#what-is-the-bridge)
  - [How to use it?](Advanced-Guide.md#how-to-use-it)


### Customized Format
There are already some preset format you can find You can find in [Format](../src/react-native/components/format/index.ts).
But sometimes it doesn't meet your needs. Here is an example for a `SizeFormat` to control the font size.

Note that this hook only can be used in child component of `ReactNativeRichEditor`

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
        formats={[
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

You can call methods that in webview side, like: `GetContents`, `SetContents`
`birdge.call()` will always return a `Promise` will be resolved with return value.

```ts
import { useBuiltinBridge, QuillResolverTokenBuiltin } from '@ziqch/react-native-rich-editor';
const bridge__builtin = useBuiltinBridge();
const content = await bridge__builtin.call(QuillResolverTokenBuiltin.GetContents);
bridge__builtin.call(QuillResolverTokenBuiltin.SetContents, newContent);
```

