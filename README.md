# React Native Rich Editor - an Easy-to-use Rich Text Editor for React Native App

## Platforms Supported

- [x] iOS
- [x] Android
- [x] Expo (Android, iOS)

## Getting Started

Read our [Getting Started Guide](docs/Getting-Started.md). If any step seems unclear, please create a detailed issue.


## Install

```
$ yarn add @ziqch/react-native-rich-editor
```

(or)

For npm use

```
$ npm install --save @ziqch/react-native-rich-editor
```

## Usage

Import the `ReactNativeRichEditor` component from `@ziqch/react-native-rich-editor` and use it like so:

```jsx
import {
  Format,
  ReactNativeRichEditor,
  RichEditorToolBar,
} from '@ziqch/react-native-rich-editor';

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
      <RichEditorToolBar
        formats={[
          <Format.Basic format={'bold'} icon={'format-bold'} />,
          <Format.Basic format={'italic'} icon={'format-italic'} />,
          <Format.Basic format={'underline'} icon={'format-underline'} />,
          <Format.Basic format={'strike'} icon={'format-strikethrough'} />,
        ]}
      />
    </ReactNativeRichEditor>
  )
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
