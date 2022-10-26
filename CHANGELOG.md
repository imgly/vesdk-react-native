## [2.16.1]

### Fixed

* [react-native-videoeditorsdk] Fixed error when cancelling the editor. 
* [react-native-videoeditorsdk] Fixed missing export of `VideoSegment` type.
* [react-native-videoeditorsdk] Fixed wrong types for `VESDK.openEditor`.

## [2.16.0]

### Added

* [react-native-videoeditorsdk] Added duration action for text and stickers.
* [react-native-videoeditorsdk] Added `VideoEditorResult.segments`, `VideoEditorResult.videoSize`, and `VideoEditorResult.release()` which enable serialization of the individual video composition components if `configuration.export.video.segments` is enabled.

## [2.15.0]

### Changed

* 🚨 Bumped iOS deployment target to 13.0.
* [react-native-videoeditorsdk] Raised minimum VideoEditor SDK for iOS version to 11.1.0. See the [changelog](https://github.com/imgly/vesdk-ios-build/blob/master/CHANGELOG.md) for more information.
* [react-native-photoeditorsdk] Raised minimum PhotoEditor SDK for iOS version to 11.1.0. See the [changelog](https://github.com/imgly/pesdk-ios-build/blob/master/CHANGELOG.md) for more information.

### Added

* Added implementation and documentation for background removal.

## [2.14.0]

### Added

* [react-native-videoeditorsdk] Added implementation and documentation for GIPHY sticker integration.

### Fixed

* [react-native-videoeditorsdk] Fixed `VESDK.openEditor` return type declaration and API documentation to return `Promise<VideoEditorResult | null>` instead of just `Promise<VideoEditorResult>`.
* [react-native-videoeditorsdk] Fixed height and width of specified composition size would be flipped on Android.
* [react-native-photoeditorsdk] Fixed `PESDK.openEditor` return type declaration and API documentation to return `Promise<PhotoEditorResult | null>` instead of just `Promise<PhotoEditorResult>`.
* [react-native-photoeditorsdk] Fixed deprecation warning for `RCTBridge.imageLoader` on iOS.


## [2.13.1]

### Fixed

* Fixed enabling serialization would crash the application on Android when exporting.

## [2.13.0]

### Changed

* 🚨 With this version you might need to create symlinks when using Android Gradle Plugin version `4.x`. Please refer to the new [known issues](https://github.com/imgly/vesdk-react-native#known-issues) section of the README for details.
* 🚨 This version requires `minSdkVersion` `21` for Android. Please refer to the new step 3 in the [getting started](https://github.com/imgly/vesdk-react-native#android) section of the README for instructions on how to adjust it.
* [react-native-videoeditorsdk] Raised minimum VideoEditor SDK for Android version to 10.0.1. See the [changelog](https://github.com/imgly/vesdk-android-demo/blob/master/CHANGELOG.md) for more information.
* [react-native-photoeditorsdk] Raised minimum PhotoEditor SDK for Android version to 10.0.1. See the [changelog](https://github.com/imgly/pesdk-android-demo/blob/master/CHANGELOG.md) for more information.

### Added

* [react-native-imglysdk] Added support to specify a custom `buildToolsVersion`, `minSdkVersion`, `compileSdkVersion`, `targetSdkVersion`, and `kotlinGradlePluginVersion` for Android with the Expo config plugin.

## [2.12.0]

### Changed

* Unified changelog for `react-native-photoeditorsdk`, `react-native-videoeditorsdk`, and the new `react-native-imglysdk`.
* Removed `WRITE_EXTERNAL_STORAGE` permission request when opening the editor on Android.
* Aligned emoji support for iOS and Android. Emoji support is not optimized for cross-platform use and disabled by default. Added option `configuration.text.allowEmojis` to opt in.
* Updated documentation for remote resources used in the editor. Remote resources are usable but not optimized and therefore should be downloaded in advance and then passed to the editor as local resources.

### Added

* Added integration and documentation for custom watermark.
* [react-native-imglysdk] Added Expo config plugin. See the [PE.SDK](https://github.com/imgly/pesdk-react-native#expo-cli) or [VE.SDK](https://github.com/imgly/vesdk-react-native#expo-cli) getting started section of the README for instructions on how to use it.

### Fixed

* [react-native-videoeditorsdk] Fixed `composition.personalVideoClips` configuration option would not be resolved correctly on Android.

## [2.11.0]

### Changed

* 🚨 The img.ly maven repository is no longer automatically added to your project by the plugin for Android. Please refer to the new step 3 in the [getting started](https://github.com/imgly/vesdk-react-native#android) section of the README for instructions on how to add it.
* [react-native-videoeditorsdk] Added support for VideoEditor SDK for Android version 9.
* [react-native-photoeditorsdk] Added support for PhotoEditor SDK for Android version 9.

### Added

* Added `configuration.export.force` which will force the photo/video to be rendered and exported in the defined output format even if no changes have been applied. Otherwise, the input asset will be passed through and might not match the defined output format.
* [react-native-videoeditorsdk] Added integration and documentation for force trim.

### Fixed

* [react-native-photoeditorsdk] Fixed `export.image.exportType` configuration option on iOS.

## [2.10.1]

### Fixed

* Fixed compiling issues with `compileSdkVersion` 30 on Android.
* [react-native-videoeditorsdk] Fixed video not being loaded when opening a single video without having video composition enabled in the license on Android. 

## [2.10.0]

### Added

* [react-native-videoeditorsdk] Added integration and documentation for new video library and audio library.

### Fixed

* [react-native-videoeditorsdk] Fixed crash when loading a serialization on Android.

## [2.9.0]

### Added

* [react-native-videoeditorsdk] Added integration for new video composition tool on Android.

## [2.8.0]

### Added

* [react-native-videoeditorsdk] Added integration and documentation for new video composition tool on iOS. Android support will be added in a later release.

## [2.7.0]

### Changed

* Updated identifier documentation for replaced and new fonts.

### Added

* [react-native-videoeditorsdk] Added support to replace the `VideoEditViewController` with custom subclasses on iOS.
* [react-native-photoeditorsdk] Added support to replace the `PhotoEditViewController` with custom subclasses on iOS.

## [2.6.1]

### Changed

* [react-native-videoeditorsdk] Raised minimum VideoEditor SDK for Android version to 8.0.8.
* [react-native-photoeditorsdk] Raised minimum PhotoEditor SDK for Android version to 8.0.8.

## [2.6.0]

### Changed

* [react-native-videoeditorsdk] Added support for VideoEditor SDK for Android version 8.0.4 and above.
* [react-native-videoeditorsdk] Raised minimum VideoEditor SDK for Android version to 8.0.4.
* [react-native-photoeditorsdk] Added support for PhotoEditor SDK for Android version 8.0.4 and above.
* [react-native-photoeditorsdk] Raised minimum PhotoEditor SDK for Android version to 8.0.4.

## [2.5.0]

### Removed

* 🚨 Removed `createDefaultConfiguration` as the created object is redundant with the `Configuration` documentation and it contains the options that are used per default when the editor is launched without a given configuration.

### Added

* Added integration and identifier documentation for new smart stickers.
* [react-native-videoeditorsdk] Added integration and identifier documentation for new GIF sticker category and stickers.

## [2.4.2]

### Fixed

* Fixed serialization export file URL to include the schema on Android.
* [react-native-videoeditorsdk] Fixed crash when exporting serialization for remote videos on Android.
* [react-native-videoeditorsdk] 🚨 Fixed export result type on Android to `video` which was `image` before.

## [2.4.1]

* [react-native-photoeditorsdk] Fixed wrong behavior of `ImageExportType` where `DATA_URL` and `FILE_URL` were swapped on Android.

## [2.4.0]

### Changed

* 🚨 `LUTFilter` tile configurations are not parsed from the `lutURI` filename anymore and the default changed from a 8x8 to a 5x5 tile configuration on iOS. Please use the newly added configuration options to configure the tile layout independent of the filename.

### Added

* Added tile configuration options for `LUTFilter`.

## [2.3.2]

### Fixed

* Fixed loading of static resources for release builds on Android.

## [2.3.1]

### Fixed

* Fixed and updated getting started section of the readme for React Native versions older than 0.60.

## [2.3.0]

### Added

* [react-native-videoeditorsdk] Added `VideoEditorModal` component that can be used instead of the `VESDK.openEditor` function to modally present a video editor.
* [react-native-photoeditorsdk] Added `PhotoEditorModal` component that can be used instead of the `PESDK.openEditor` function to modally present a photo editor.

## [2.2.2]

### Fixed

* Fixed default ordering of the frames for cross-platform consistency.

## [2.2.1]

### Fixed

* Fixed possible archive issue for iOS with React Native versions older than 0.60.
* Fixed "Can only use lower 16 bits for requestCode" exception on Android.

## [2.2.0]

### Added

* [react-native-videoeditorsdk] Added an interface for native customization on iOS. Set the `RNVideoEditorSDK.configureWithBuilder` and `RNVideoEditorSDK.willPresentVideoEditViewController` properties of the bridge module to tweak VideoEditor SDK to your needs beyond the configuration options exposed to JavaScript.
* [react-native-photoeditorsdk] Added an interface for native customization on iOS. Set the `RNPhotoEditorSDK.configureWithBuilder` and `RNPhotoEditorSDK.willPresentPhotoEditViewController` properties of the bridge module to tweak PhotoEditor SDK to your needs beyond the configuration options exposed to JavaScript.

### Fixed

* Fixed possible NPE if other native libraries register `addActivityEventListener()` on Android.

## [2.1.2]

### Fixed

* Fixed possible compile issue with React Native versions older than 0.60 on Android.

## [2.1.1]

### Fixed

* Fixed duplicate symbols for constants on iOS when using VideoEditor SDK and PhotoEditor SDK in the same project.
* Fixed return `null` if the editor is dismissed without exporting the edited video on iOS.

## [2.1.0]

### Changed

* [react-native-videoeditorsdk] Updated VideoEditor SDK for iOS to version 10.7.0.
* [react-native-photoeditorsdk] Updated PhotoEditor SDK for iOS to version 10.7.0.

### Fixed

* Fixed automatic (CocoaPods) installation process for iOS so that VideoEditor SDK and PhotoEditor SDK can be used in the same project.
* Fixed `FRAMEWORK_SEARCH_PATHS` for manual linking VideoEditor SDK on iOS which is required for React Native versions older than 0.60.
* Add missing `Platform` import when using React Native versions older than 0.60.

## [2.0.1]

### Fixed

* Fixed error message: "tools: replace" attribute that is linked to the "provider" element type is not bound on Android.

## [2.0.0]

### Added

* [react-native-videoeditorsdk] Added support for VideoEditor SDK for Android version 7.1.5 and above.
* [react-native-photoeditorsdk] Added support for PhotoEditor SDK for Android version 7.1.5 and above.

## [1.3.0]

### Changed

* [react-native-videoeditorsdk] Updated VideoEditor SDK for iOS to version 10.6.0.
* [react-native-photoeditorsdk] Updated PhotoEditor SDK for iOS to version 10.6.0.

## [1.2.0]

### Changed

* [react-native-videoeditorsdk] Updated VideoEditor SDK for iOS to version 10.5.0.
* [react-native-photoeditorsdk] Updated PhotoEditor SDK for iOS to version 10.5.0.

## [1.1.0]

### Added

* Added configuration options for personal stickers.
* [react-native-videoeditorsdk] Updated VideoEditor SDK for iOS to version 10.4.0.
* [react-native-photoeditorsdk] Updated PhotoEditor SDK for iOS to version 10.4.0.

## [1.0.2]

### Fixed

* Fixed `unlockWithLicense`.

## [1.0.0]

### Added

* [react-native-videoeditorsdk] Initial release of the React Native module for VideoEditor SDK. This version adds support for iOS only. Android support will be added in a later release.
* [react-native-photoeditorsdk] Initial release of the React Native module for PhotoEditor SDK. This version adds support for iOS only. Android support will be added in a later release.
