# React Native Rich Editor Getting Started Guide

This guide will help you get started quickly.

## 1. Add `@bean-app/react-native-rich-editor` to your dependencies

```
$ yarn add @bean-app/react-native-rich-editor
```

(or)

For npm use

```
$ npm install --save @bean-app/react-native-rich-editor
```

## 2. Import the `ReactNativeRichEditor` into your component

```jsx
import { ReactNativeRichEditor } from '@bean-app/react-native-rich-editor';

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
    ></ReactNativeRichEditor>
  );
};
```

You can use our default toolbar and preset formats.

```tsx
import {
  Format,
  ReactNativeRichEditor,
} from '@bean-app/react-native-rich-editor';

// ...
const MyComponent = () => {
  const renderIcon = (isActive: boolean, isDisabled: boolean) => {
    //...
    return <YourIcon />;
  };
  return (
    <ReactNativeRichEditor
    // ...
    >
      <RichEditorToolBar
        tools={[<Format.Basic format={'bold'} icon={renderIcon} />]}
      />
    </ReactNativeRichEditor>
  );
};
```

Next, check out the [Basic Guide](./Guide.md) or [API Reference](./API-Reference.md).
If you want to learn more about customization, please go to [Advanced Guide](./Advanced-Guide.md).
