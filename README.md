<p align="center">
  <img src="https://video.photoeditorsdk.com/assets/img/vesdk-logo-s.svg" alt="VideoEditor SDK Logo"/>
</p>

# React Native module for VideoEditor SDK

## Getting started

Install the module with [autolinking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) as follows:

```sh
# install
yarn add react-native-videoeditorsdk
cd ios && pod install && cd .. # CocoaPods on iOS needs this extra step
# run
yarn react-native run-ios
```

Import the module in your `App.js`:

```js
import {Configuration, VESDK} from 'react-native-videoeditorsdk';
```

Unlock VideoEditor SDK with a license file:

```js
VESDK.unlockWithLicense(require('./vesdk_license'));
```

Open the editor with a video:

```js
VESDK.openEditor(require('./video.mov'));
```

Please see the [code documentation](./index.d.ts) for more details and additional [customization and configuration options](./configuration.ts).

## License Terms

Make sure you have a [commercial license](https://account.photoeditorsdk.com/pricing?product=vesdk&?utm_campaign=Projects&utm_source=Github&utm_medium=VESDK&utm_content=React-Native) for VideoEditor SDK before releasing your app.
A commercial license is required for any app or service that has any form of monetization: This includes free apps with in-app purchases or ad supported applications. Please contact us if you want to purchase the commercial license.

## Support and License

Use our [service desk](https://support.videoeditorsdk.com) for bug reports or support requests. To request a commercial license, please use the [license request form](https://account.photoeditorsdk.com/pricing?product=vesdk&?utm_campaign=Projects&utm_source=Github&utm_medium=VESDK&utm_content=React-Native) on our website.
