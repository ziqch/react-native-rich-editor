# React Native Rich Editor Guide

This guide will help you learn more about the common use cases for React Native Rich Editor.

## Guide Index
- [Basic usage with default value](Guide.md#basic-usage-with-default-value)
- [Handle change events](Guide.md#handle-change-events)
- [Usage with format](Guide.md#handle-change-events)
  - [Format.Basic](Guide.md#formatbasic)
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


```tsx
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

The customized icon is supported, you can pass a render function to icon props.
Then render function will have two arguments: `isActive` and `isDisabled`, you can control icon style by these.

You can find all format presets in [Format](../src/react-native/components/format/index.ts).

```tsx
import { ReactNativeRichEditor, Format } from '@ziqch/react-native-rich-editor';

// ...
const MyComponent = () => {
  const mappingIcon = (iconName: string) => {
    return (isActive: boolean, isDisabled: boolean) => {
      // ... some differnt style here.
      return <YourIcon />
    }
  }
  return (
    <ReactNativeRichEditor
      // ...
    >
      <RichEditorToolBar
        tools={[
          <Format.Basic format={'bold'} icon={mappingIcon('format-bold')} />,
          <Format.Basic format={'italic'} icon={mappingIcon('format-italic')} />,
          <Format.Basic format={'underline'} icon={mappingIcon('format-underline')} />,
          <Format.Basic format={'strike'} icon={mappingIcon('format-strike')} />,
        ]}
      />
    </ReactNativeRichEditor>
  );
};
```

#### Format.Basic

A basic formatter for all common format which interaction is an icon button.
like:
 - `bold`
 - `italic`
 - `underline`
 - `strike`

Specifies a format to handle the change in editor.
The default behavior is to switch the value between `ture` and `false`.
You can get the changed value by `onValueChange`.

```jsx
<Format.Basic format={'bold'} onValueChange={onValueChange}/>
```

Customized value and active is supported, `getValue` will be called when pressing the button.
```tsx
<Format.Basic
  format={'bold'}
  getValue={currentValue => newValue}
  getActive={currentValue => isActive}
/>
```

#### Format.Image

Insert image to editor. Use `onPress` to insert your image source list.

Support source are: `http`, `https`, `data`.

```tsx
const onPress = (insertImages: (sourceList: string[]) => void) => {
  const sourceList = [];
  // push some image source
  insertImages(sourceList);
}
<Format.Image onPress={onPress}/>
```

#### Format.List

Support ordered list and bullet list format.

```tsx
<Format.List type={'ordered'} icon={iconRender} />
<Format.List type={'bullet'} icon={iconRender} />
```

#### Format.Script

Support super-script and sub-script.

```tsx
<Format.Script type={'super'} icon={iconRender} />
<Format.Script type={'sub'} icon={iconRender} />
```

#### Format.CodeBlock

Support code syntax highlight. Make sure the `syntax` is enabled in `ReactNativeRichEditor`.

It is based on [highlightjs](https://highlightjs.org/), default version `11.7.0` and style `monokai-sublime`.
If you want to use different the version and style, you can set assets link with `syntaxAssets`.

```jsx
<ReactNativeRichEditor
  syntaxAssets={{ script, css }}
  syntax={true}
>
  <RichEditorToolBar
    tools={[
      <Format.CodeBlock languages={['typescript', 'javascript']} />
    ]}
  />
</ReactNativeRichEditor>
```

Next, if you want to learn more about customization, please go to [Advanced Guide](./Advanced-Guide.md) and [API Reference](./API-Reference.md).

