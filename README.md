<p align="center">
  <a href="https://img.ly/video-sdk?utm_campaign=Projects&utm_source=Github&utm_medium=VESDK&utm_content=React-Native">
    <img src="https://img.ly/static/logos/VE.SDK_Logo.svg" alt="VideoEditor SDK Logo"/>
  </a>
</p>
<p align="center">
  <a href="https://npmjs.org/package/react-native-videoeditorsdk">
    <img src="https://img.shields.io/npm/v/react-native-videoeditorsdk.svg" alt="NPM version">
  </a>
  <a href="https://npmjs.org/package/react-native-videoeditorsdk">
    <img src="https://img.shields.io/badge/platforms-android%20|%20ios-lightgrey.svg" alt="Platform support">
  </a>
  <a href="http://twitter.com/VideoEditorSDK">
    <img src="https://img.shields.io/badge/twitter-@VideoEditorSDK-blue.svg?style=flat" alt="Twitter">
  </a>
</p>

# React Native module for VideoEditor SDK

Check out our [video tutorial](https://img.ly/blog/a-photo-and-video-editor-for-your-react-native-apps/) for a step-by-step integration guide which also details advanced SDK features, such as serializing and reusing previously applied editing operations.

## System requirements

- React Native: 0.60
- iOS: 13
- Android: 5 (SDK 21)

## Getting started

### Known Issues

With version `2.13.0`, we recommend using `compileSdkVersion` not lower than `31` for Android. However, this might interfere with your application's Android Gradle Plugin version if this is set to `4.x`.

If you don't use a newer Android Gradle Plugin version, e.g., by updating at least to RN 0.68.0, you'll most likely encounter a build error similar to:

```
FAILURE: Build failed with an exception.

* What went wrong:
A problem occurred configuring project ':react-native-videoeditorsdk'.
> com.android.builder.errors.EvalIssueException: Installed Build Tools revision 31.0.0 is corrupted. Remove and install again using the SDK Manager.

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Get more help at https://help.gradle.org
```

As a workaround you can create the following symlinks:

1. Inside `/Users/YOUR-USERNAME/Library/Android/sdk/build-tools/31.0.0/`: Create a `dx` symlink for the `d8` file with `ln -s d8 dx`.
2. From there, go to `./lib/` and create a `dx.jar` symlink for the `d8.jar` file with `ln -s d8.jar dx.jar`.

### Expo CLI

#### Limitations

This module can **not** be used in the `Expo Go` application because it uses custom native libraries.

#### Usage

In order to use this module with the Expo CLI you can make use of our integrated Expo config plugin:

1. Add our module to your Expo application:

   ```sh
   expo install react-native-videoeditorsdk
   ```

   This will automatically install [`react-native-imglysdk`](https://npmjs.org/package/react-native-imglysdk) which you can use to configure your application with our Expo config plugin.

2. Inside your app's `app.json` or `app.config.js` add our config plugin:

   ```json
   {
     "plugins": ["react-native-imglysdk"]
   }
   ```

   If needed, you can also use a specific version of our native library for Android as well as define explicitly the included modules. By default, all modules for both PhotoEditor SDK and VideoEditor SDK are included. Furthermore, you can configure the `buildToolsVersion`, `minSdkVersion`, `compileSdkVersion`, `targetSdkVersion`, and `kotlinGradlePluginVersion`.

   ```json
   {
     "plugins": [
       [
         "react-native-imglysdk",
         {
           "android": {
             "version": "10.4.0",
             "modules": [
               "ui:core",
               "ui:transform",
               "ui:filter",
               "assets:filter-basic"
             ],
             "buildToolsVersion": "31.0.0",
             "minSdkVersion": "21",
             "compileSdkVersion": "31",
             "targetSdkVersion": "30",
             "kotlinGradlePluginVersion": "1.5.32"
           }
         }
       ]
     ]
   }
   ```

   For further information on the available modules, please refer to step 4 of the React Native CLI [Android](#android) guide below.

   **Please note that the `react-native-imglysdk` module manages both VideoEditor SDK as well as PhotoEditor SDK so you only need to add the Expo config plugin once even when using both SDKs.**

3. From version `2.15.0` the iOS deployment target needs to be set to at least iOS 13. You can use the `expo-build-properties` config plugin for this. Please refer to the [official Expo docs](https://docs.expo.dev/versions/v45.0.0/sdk/build-properties/).

4. The changes will be applied on `expo prebuild` or during the prebuild phase of `eas build`.

For further information on how to integrate Expo config plugins please also refer to the official [docs](https://docs.expo.dev/guides/config-plugins/#using-a-plugin-in-your-app).

### React Native CLI

Install the React Native module in your project as follows:

```sh
yarn add react-native-videoeditorsdk
```

In general, [we highly recommend using React Native 0.60 or newer](https://img.ly/blog/react-native-native-modules-made-for-react-developers-59ca93c41541/). If you cannot avoid using an older React Native version you need to [link the native dependencies](https://facebook.github.io/react-native/docs/0.59/linking-libraries-ios#step-2) with:

```sh
yarn react-native link
```

before you continue with the platform-specific guides below.

#### iOS

For React Native 0.60 and above [autolinking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) is used and VideoEditor SDK for iOS should be automatically installed:

```sh
cd ios && pod install && cd ..
```

and updated:

```sh
cd ios && pod update && cd ..
```

with CocoaPods.

For older React Native versions autolinking is not available and VideoEditor SDK for iOS needs to be [manually integrated](https://img.ly/docs/vesdk/ios/introduction/getting_started/#manually) in your Xcode project if you don't use [CocoaPods to manage your dependencies](https://facebook.github.io/react-native/docs/0.59/integration-with-existing-apps#configuring-cocoapods-dependencies). Make sure to put `ImglyKit.framework` and `VideoEditorSDK.framework` in the `ios/` directory of your project.

#### Android

1. Add the img.ly repository and plugin by opening the `android/build.gradle` file (**not** `android/app/build.gradle`) and adding these lines at the top:

   ```groovy
   buildscript {
       repositories {
           mavenCentral()
           maven { url "https://artifactory.img.ly/artifactory/imgly" }
       }
       dependencies {
           classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:1.5.32"
           classpath 'ly.img.android.sdk:plugin:10.4.0'
       }
   }
   ```

   In order to update VideoEditor SDK for Android replace the version string `10.4.0` with a [newer release](https://github.com/imgly/vesdk-android-demo/releases).

2. Still in the `android/build.gradle` file (**not** `android/app/build.gradle`), add these lines at the bottom:

   ```groovy
   allprojects {
       repositories {
           maven { url 'https://artifactory.img.ly/artifactory/imgly' }
       }
   }
   ```

3. In the same file, you will need to modify the `minSdkVersion` to at least `21`. We also recommend to update the `buildToolsVersion` to `31.0.0` or higher as well as the `compileSdkVersion` to `31` or higher:

   ```diff
   buildscript {
       ext {
   -       buildToolsVersion = "30.0.2"
   +       buildToolsVersion = "31.0.0"
   -       minSdkVersion = 19
   +       minSdkVersion = 21
   -       compileSdkVersion = 30
   +       compileSdkVersion = 31
           targetSdkVersion = 30
       }
   }
   ```

4. Configure VideoEditor SDK for Android by opening the `android/app/build.gradle` file (**not** `android/build.gradle`) and adding the following lines under `apply plugin: "com.android.application"`:

   ```groovy
   apply plugin: 'ly.img.android.sdk'
   apply plugin: 'kotlin-android'

   // Comment out the modules you don't need, to save size.
   imglyConfig {
       modules {
           include 'ui:text'
           include 'ui:focus'
           include 'ui:frame'
           include 'ui:brush'
           include 'ui:filter'
           include 'ui:sticker'
           include 'ui:overlay'
           include 'ui:transform'
           include 'ui:adjustment'
           include 'ui:text-design'
           include 'ui:video-trim'
           include 'ui:video-library'
           include 'ui:video-composition'
           include 'ui:audio-composition'
           include 'ui:giphy-sticker'

           // This module is big, remove the serializer if you don't need that feature.
           include 'backend:serializer'

           // Remove the asset packs you don't need, these are also big in size.
           include 'assets:font-basic'
           include 'assets:frame-basic'
           include 'assets:filter-basic'
           include 'assets:overlay-basic'
           include 'assets:sticker-shapes'
           include 'assets:sticker-emoticons'
           include 'assets:sticker-animated'

           include 'backend:sticker-animated'
           include 'backend:sticker-smart'
           include 'backend:background-removal'
       }
   }
   ```

### Usage

Import the module in your `App.js`:

```js
import {
  VESDK,
  VideoEditorModal,
  Configuration,
} from "react-native-videoeditorsdk";
```

Each platform requires a separate license file. [Unlock VideoEditor SDK](./index.d.ts#L41-L53) automatically for both platforms with a single line of code via [platform-specific file extensions](https://reactnative.dev/docs/platform-specific-code#platform-specific-extensions):

```js
VESDK.unlockWithLicense(require("./vesdk_license"));
```

Open the editor with a video:

```js
VESDK.openEditor(require("./video.mp4"));
```

Or use the component to open the editor:

```jsx
<VideoEditorModal visible={true} video={require("./video.mp4")} />
```

Please see the [code documentation](./index.d.ts) for more details and additional [customization and configuration options](./configuration.ts).

For configuring and customizing VideoEditor SDK beyond these options exposed to JavaScript the iOS bridge provides an [interface for native customization](./ios/RNVideoEditorSDK.h). Please refer to [our documentation](https://img.ly/docs/vesdk?utm_campaign=Projects&utm_source=Github&utm_medium=VESDK&utm_content=React-Native) for more details on native customization.

## Example

Please see our [example project](https://github.com/imgly/vesdk-react-native-demo) which demonstrates how to use the React Native module for VideoEditor SDK.

## License Terms

Make sure you have a [commercial license](https://img.ly/pricing?product=vesdk&?utm_campaign=Projects&utm_source=Github&utm_medium=VESDK&utm_content=React-Native) for VideoEditor SDK before releasing your app.
A commercial license is required for any app or service that has any form of monetization: This includes free apps with in-app purchases or ad supported applications. Please contact us if you want to purchase the commercial license.

## Support and License

Use our [service desk](https://support.img.ly) for bug reports or support requests. To request a commercial license, please use the [license request form](https://img.ly/pricing?product=vesdk&?utm_campaign=Projects&utm_source=Github&utm_medium=VESDK&utm_content=React-Native) on our website.
