import {NativeModules, Image} from 'react-native';
import {createDefaultConfiguration, Configuration} from './configuration';

const {RNVideoEditorSDK} = NativeModules;

function resolveStaticAsset(assetSource, extractURI = true) {
  const resolvedSource = Image.resolveAssetSource(assetSource);
  const source = (resolvedSource != null) ? resolvedSource : assetSource;
  if (extractURI) {
    return (source.uri != null) ? source.uri : source;
  }
  return source
}

function getNestedObject(nestedObject, pathArray) {
  return pathArray.reduce((obj, key) =>
      (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObject);
}

function resolveNestedAsset(nestedObject, pathArray) {
  let asset = getNestedObject(nestedObject, pathArray);
  // Resolve `asset` if it is a number (opaque type returned by require('./foo.png'))
  if (asset && typeof asset === 'number') {
    let key = pathArray.pop(); 
    let obj = getNestedObject(nestedObject, pathArray);
    obj[key] = resolveStaticAsset(asset);
  }
}

function resolveStaticAssets(configuration) {
  let filterCategories = getNestedObject(configuration, ["filter", "categories"]);
  if (filterCategories) {
    for (let category of filterCategories) {
      resolveNestedAsset(category, ["thumbnailURI"]);
      let filters = getNestedObject(category, ["items"]);
      if (filters) {
        for (let filter of filters) {
          resolveNestedAsset(filter, ["lutURI"]);
        }
      }
    }
  }
  let stickerCategories = getNestedObject(configuration, ["sticker", "categories"]);
  if (stickerCategories) {
    for (let category of stickerCategories) {
      resolveNestedAsset(category, ["thumbnailURI"]);
      let stickers = getNestedObject(category, ["items"]);
      if (stickers) {
        for (let sticker of stickers) {
          resolveNestedAsset(sticker, ["thumbnailURI"]);
          resolveNestedAsset(sticker, ["stickerURI"]);
        }
      }
    }
  }
  let fonts = getNestedObject(configuration, ["text", "fonts"]);
  if (fonts) {
    for (let font of fonts) {
      resolveNestedAsset(font, ["fontURI"]);
    }
  }
  let overlays = getNestedObject(configuration, ["overlay", "items"]);
  if (overlays) {
    for (let overlay of overlays) {
      resolveNestedAsset(overlay, ["thumbnailURI"]);
      resolveNestedAsset(overlay, ["overlayURI"]);
    }
  }
  let frames = getNestedObject(configuration, ["frame", "items"]);
  if (frames) {
    for (let frame of frames) {
      resolveNestedAsset(frame, ["thumbnailURI"]);
      resolveNestedAsset(frame, ["imageGroups", "top", "startURI"]);
      resolveNestedAsset(frame, ["imageGroups", "top", "midURI"]);
      resolveNestedAsset(frame, ["imageGroups", "top", "endURI"]);
      resolveNestedAsset(frame, ["imageGroups", "left", "startURI"]);
      resolveNestedAsset(frame, ["imageGroups", "left", "midURI"]);
      resolveNestedAsset(frame, ["imageGroups", "left", "endURI"]);
      resolveNestedAsset(frame, ["imageGroups", "right", "startURI"]);
      resolveNestedAsset(frame, ["imageGroups", "right", "midURI"]);
      resolveNestedAsset(frame, ["imageGroups", "right", "endURI"]);
      resolveNestedAsset(frame, ["imageGroups", "bottom", "startURI"]);
      resolveNestedAsset(frame, ["imageGroups", "bottom", "midURI"]);
      resolveNestedAsset(frame, ["imageGroups", "bottom", "endURI"]);
    }
  }
}

class VESDK {
  /**
   * Modally present a video editor.
   * @note Edited videos from remote resources can be previewed in the editor but their export will
   * fail! Remote video resources are currently supported for debugging purposes only, e.g., when
   * loading videos with `require('./video.mp4')` for debug builds static video assets will be
   * resolved to remote URLs served by the development packager.
   * 
   * @param {string | {uri: string} | number} videoSource The source of the video to be edited.
   * Can be either an URI (local only), an object with a member `uri`, or an asset reference
   * which can be optained by, e.g., `require('./video.mp4')` as `number`.
   * @param {Configuration} configuration The configuration used to initialize the editor.
   * @param {object} serialization The serialization used to initialize the editor. This
   * restores a previous state of the editor by re-applying all modifications to the loaded
   * video.
   * 
   * @return {Promise<{video: string, hasChanges: boolean, serialization: object}>} Returns the
   * edited `video`, an indicator (`hasChanges`) whether the input video was modified at all, and
   * all modifications (`serialization`) applied to the input video if `export.serialization.enabled`
   * of the `configuration` was set.
   */
  static openEditor(videoSource, configuration = null, serialization = null) {
    resolveStaticAssets(configuration)
    const video = resolveStaticAsset(videoSource, false);
    return RNVideoEditorSDK.present(video, configuration, serialization);
  }

  /**
   * Unlock the VideoEditor SDK with a license.
   * 
   * @param {string | object} license The license used to unlock the SDK. Can be either an URI
   * pointing to a local `file://` resource that contains the license, the license as a string,
   * or the license as an object which can be optained by, e.g., `require('./vesdk_license')`
   * where the required license files must be named `./vesdk_license.ios.json` for the iOS license
   * and `./vesdk_license.android.json` for the Android license file in order to get automatically
   * resolved by the packager.
   */
  static unlockWithLicense(license) {
    RNVideoEditorSDK.unlockWithLicense(license);
  }

  /**
   * Creates a configuration object populated with default values for all options.
   * @return {Configuration} The default configuration.
   */
  static createDefaultConfiguration() {
    return createDefaultConfiguration()
  }
}

export {VESDK};
export * from './configuration';
