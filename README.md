# React Native Rich Editor - an Easy-to-use Rich Text Editor for React Native App

> **⚠️<font color=#ffe58f>The project is still in the development phase and there may be some issues affecting the normal use.</font>**

## Platforms Supported

- [x] iOS
- [x] Android
- [x] Expo (Android, iOS)

## Try It Now!

Try it now in [Expo Go](https://expo.dev/client) !

Open the camera app on your device and scan the code below:

Preview Build

<img width='200' src="https://qr.expo.dev/eas-update?appScheme=exp&amp;projectId=0177b331-d8e6-4721-bb11-9b5b9f38dc63&amp;channel=main&amp;runtimeVersion=exposdk%3A48.0.0&amp;host=u.expo.dev" alt="App preview QR code">

Release Build

<img width='200' src="https://qr.expo.dev/eas-update?appScheme=exp&amp;projectId=0177b331-d8e6-4721-bb11-9b5b9f38dc63&amp;channel=release&amp;runtimeVersion=exposdk%3A48.0.0&amp;host=u.expo.dev" alt="App release QR code">

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
        tools={[
          <Format.Basic format={'bold'} icon={() => <YourIcon/>} />,
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
