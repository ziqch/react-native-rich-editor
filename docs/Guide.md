# React Native Rich Editor Guide

This guide will help you learn more about the common use cases for React Native Rich Editor.

## Guide Index
- [Basic usage with default value](Guide.md#basic-usage-with-default-value)
- [Handle change events](Guide.md#handle-change-events)
- [Usage with format](Guide.md#handle-change-events)
  - [Format.Basic](Guide.md#formatbasic)
  - [Format.Size](Guide.md#formatsize)
  - [Format.Image](Guide.md#formatimage)
  - [Format.List](Guide.md#formatlist)
  - [Format.Script](Guide.md#formatscript)
  - [Format.CodeBlock](Guide.md#formatcodeblock)

### Basic usage with default value

You can provide the `defaultValue` to `ReactNativeRichEditor` to show the existed content.
Please note that the Editor is not a controlled component, there is not a binding value.

Since the Editor is based on `Quilljs`, the `defaultValue` should be [DeltaOps](https://quilljs.com/docs/delta/) type which is defined by `Quilljs`.

In this example, the content will be "Hollow **World!**"(the "**World!**" is bold).

Don't forget the `width` and `height`, the Editor need known the size of its container, so it can handle scroll.


```js
import { ReactNativeRichEditor } from '@ziqch/react-native-rich-editor';
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

### Handle change events

Sometimes you want to get changes when user typing some content or changing the selection.
Here's some example code on how you might use the `onTextChange` or `onSelectionChange`.

```tsx
import { ReactNativeRichEditor } from '@ziqch/react-native-rich-editor';
const MyComponent = () => {
  const onTextChange = (delta: DeltaOperation[]) => {
    // do someting with the new delta content.
    // for example, save the content when change:
    const content = serialize(delta);
    save(content);
  };
  const onSelectionChange = (range: RangeStatic, oldRange: RangeStatic) => {
    // do someting with the selection.
    console.log(`Selection start from ${range.index}, length is ${range.length}`);
  };
  return (
    <ReactNativeRichEditor
      height={height}
      width={width}
      onTextChange={onTextChange}
      onSelectionChange={onSelectionChange}
    >
    </ReactNativeRichEditor>
  );
};
```

### Usage with format

Here are some preset formats and a default ToolBar in our package, these can help you quick start with format.

In this example, a scrollable toolbar with four basic formatters will be rendered at the bottom of Editor.
You can press the button to change the current format or current selection format.

The `Format` component must be child of `ReactNativeRichEditor`.

The customized icon is supported, you can pass an `IconName`([for all MaterialIcons icons in [@expo/vector-icons](https://icons.expo.fyi/)) or `Function` to icon props.

You can find all format presets in [Format](../src/react-native/components/format/index.ts).

```jsx
import { ReactNativeRichEditor, Format } from '@ziqch/react-native-rich-editor';

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
          <Format.Basic format={'strike'} icon={() => <YourIcon />} />,
        ]}
      />
    </ReactNativeRichEditor>
  );
};
```

#### Format.Basic

A basic formatter for all common format which value is boolean.
like:
 - `bold`
 - `italic`
 - `underline`
 - `strike`

```jsx
<Format.Basic format={'bold'} icon={'format-bold'} />
```

#### Format.Size

A selector component to select font size, we support three size by default:

dependency: [`react-native-picker-select`](https://www.npmjs.com/package/react-native-picker-select)

- `Small`
- `Normal`
- `Large`
- `Huge`

```jsx
<Format.Size />
```

Customized selection is supported, but you need confirm the set of format value is also supported in Quilljs or your customized quill editor.

```jsx
<Format.Size selections={[{ label: 'Label', value: 'value' }]}/>
```

#### Format.Image

Image picker and insert image to editor.

dependency: [`expo-image-picker`](https://www.npmjs.com/package/expo-image-picker)

```jsx
<Format.Image icon={'image'} imagePickerOptions={YourOptions} />
```

#### Format.List

Support ordered list and bullet list format

```jsx
<Format.List type={'ordered'} />
<Format.List type={'bullet'} />
```

#### Format.Script

Support super-script and sub-script.

```jsx
<Format.Script type={'super'} />
<Format.Script type={'sub'} />
```

#### Format.CodeBlock

Support code syntax highlight. `syntax` is required in `ReactNativeRichEditor`.

```jsx
<ReactNativeRichEditor syntax={true}>
  <RichEditorToolBar
    formats={[
      <Format.CodeBlock languages={['typescript', 'javascript']} />
    ]}
  />
</ReactNativeRichEditor>
```

