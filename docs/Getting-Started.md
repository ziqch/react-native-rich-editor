# React Native Rich Editor Getting Started Guide

This guide will help you get started quickly.

## 1. Add `@ziqch/react-native-rich-editor` to your dependencies

```
$ yarn add @ziqch/react-native-rich-editor
```

(or)

For npm use

```
$ npm install --save @ziqch/react-native-rich-editor
```

## 2. Import the `ReactNativeRichEditor` into your component

```jsx
import { ReactNativeRichEditor } from '@ziqch/react-native-rich-editor';

// ...
const MyComponent = () => {
  return (
    <ReactNativeRichEditor
      height={height}
      width={width}
      defaultValue={[
        { insert: 'Hello ' },
        { insert: 'World!', attributes: { bold: true } },
        { insert: '\n' },
      ]}
    >
    </ReactNativeRichEditor>
  );
};
```

You can use our default toolbar and preset format.

```jsx
import { ReactNativeRichEditor } from '@ziqch/react-native-rich-editor';

// ...
const MyComponent = () => {
  return (
    <ReactNativeRichEditor
      // ...
    >
      <RichEditorToolBar
        formats={[
          <Format.Basic format={'bold'} icon={'format-bold'} />,
          <Format.Basic format={'italic'} icon={'format-italic'} />,
          <Format.Basic format={'underline'} icon={'format-underline'} />,
          <Format.Basic format={'strike'} icon={'format-strikethrough'} />,
        ]}
      />
    </ReactNativeRichEditor>
  );
};
```

Next, check out the [Basic Guide](./Guide.md) or [API Reference](./API-Reference.md).
If you want to learn more about customization, please go to [Advanced Guide](./Advanced-Guide.md).
