## [2.6.1]

### Changed

* [Android] Raised minimum VideoEditor SDK for Android version to 8.0.8.

## [2.6.0]

### Changed

* [Android] Added support for VideoEditor SDK for Android version 8.0.4 and above.
* [Android] Raised minimum VideoEditor SDK for Android version to 8.0.4.

## [2.5.0]

### Removed

* 🚨 Removed `createDefaultConfiguration` as the created object is redundant with the `Configuration` documentation and it contains the options that are used per default when the editor is launched without a given configuration.

### Added

* Added integration and identifier documentation for new smart stickers.
* Added integration and identifier documentation for new GIF sticker category and stickers.

## [2.4.2]

### Fixed

* [Android] Fixed serialization export file URL to include the schema.
* [Android] Fixed crash when exporting serialization for remote videos.
* [Android] 🚨 Fixed export result type to `video` which was `image` before.

## [2.4.1]

* Same version as 2.4.0. Bumped version to keep the version consistent with `react-native-photoeditorsdk`.

## [2.4.0]

### Changed

* [iOS] 🚨 `LUTFilter` tile configurations are not parsed from the `lutURI` filename anymore and the default changed from a 8x8 to a 5x5 tile configuration. Please use the newly added configuration options to configure the tile layout independent of the filename.

### Added

* Added tile configuration options for `LUTFilter`.

## [2.3.2]

### Fixed

* [Android] Fixed loading of static resources for release builds.

## [2.3.1]

### Fixed

* Fixed and updated getting started section of the readme for React Native versions older than 0.60.

## [2.3.0]

### Added

* Added `VideoEditorModal` component that can be used instead of the `VESDK.openEditor` function to modally present a video editor.

## [2.2.2]

### Fixed

* Fixed default ordering of the frames for cross-platform consistency.

## [2.2.1]

### Fixed

* [iOS] Fixed possible archive issue with React Native versions older than 0.60.
* [Android] Fixed "Can only use lower 16 bits for requestCode" exception.

## [2.2.0]

### Added

* [iOS] Added an interface for native customization. Set the `RNVideoEditorSDK.configureWithBuilder` and `RNVideoEditorSDK.willPresentVideoEditViewController` properties of the bridge module to tweak VideoEditor SDK to your needs beyond the configuration options exposed to JavaScript.

### Fixed

* [Android] Fixed possible NPE if other native libraries register `addActivityEventListener()`.

## [2.1.2]

### Fixed

* [Android] Fixed possible compile issue with React Native versions older than 0.60.

## [2.1.1]

### Fixed

* [iOS] Fixed duplicate symbols for constants when using VideoEditor SDK and PhotoEditor SDK in the same project.
* [iOS] Fixed return `null` if the editor is dismissed without exporting the edited video.

## [2.1.0]

### Changed

* [iOS] Updated VideoEditor SDK for iOS to version 10.7.0 and above.

### Fixed

* [iOS] Fixed automatic (CocoaPods) installation process so that VideoEditor SDK and PhotoEditor SDK can be used in the same project.
* [iOS] Fixed `FRAMEWORK_SEARCH_PATHS` for manual linking VideoEditor SDK which is required for React Native versions older than 0.60.
* Add missing `Platform` import when using React Native versions older than 0.60.

## [2.0.1]

### Fixed

* [Android] Fixed error message: "tools: replace" attribute that is linked to the "provider" element type is not bound.

## [2.0.0]

### Added

* [Android] Added support for VideoEditor SDK for Android version 7.1.5 and above.

## [1.3.0]

### Changed

* [iOS] Updated VideoEditor SDK for iOS to version 10.6.0.

## [1.2.0]

### Changed

* [iOS] Updated VideoEditor SDK for iOS to version 10.5.0.

## [1.1.0]

### Added

* [iOS] Updated VideoEditor SDK for iOS to version 10.4.0.
* Added configuration options for personal stickers.

## [1.0.2]

### Fixed

* [iOS] Fixed `unlockWithLicense`.

## [1.0.0]

### Added

* [iOS] Initial release of the React Native module for VideoEditor SDK. This version adds support for iOS only. Android support will be added in a later release.
