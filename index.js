import { Component } from 'react';
import { Image, NativeModules, Platform } from 'react-native';
import { Configuration } from './configuration';

const { RNVideoEditorSDK } = NativeModules;

function resolveStaticAsset(assetSource, extractURI = true) {
  const resolvedSource = Image.resolveAssetSource(assetSource);
  const source = (resolvedSource != null) ? resolvedSource : assetSource;
  if (extractURI) {
    return (source == null) ? null : ((source.uri != null) ? source.uri : source);
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
  let videoClipCategories = getNestedObject(configuration, ["composition", "categories"]);
  if (videoClipCategories) {
    for (let category of videoClipCategories) {
      resolveNestedAsset(category, ["thumbnailURI"]);
      let videoClips = getNestedObject(category, ["items"]);
      if (videoClips) {
        for (let videoClip of videoClips) {
          resolveNestedAsset(videoClip, ["thumbnailURI"]);
          resolveNestedAsset(videoClip, ["videoURI"]);
        }
      }
    }
  }
  let audioClipCategories = getNestedObject(configuration, ["audio", "categories"]);
  if (audioClipCategories) {
    for (let category of audioClipCategories) {
      resolveNestedAsset(category, ["thumbnailURI"]);
      let audioClips = getNestedObject(category, ["items"]);
      if (audioClips) {
        for (let audioClip of audioClips) {
          resolveNestedAsset(audioClip, ["thumbnailURI"]);
          resolveNestedAsset(audioClip, ["audioURI"]);
        }
      }
    }
  }
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
  let watermark = getNestedObject(configuration, ["watermark"]);
  if (watermark) {
    resolveNestedAsset(watermark, ["watermarkURI"]);
  }
}

class VESDK {
  /**
   * Modally present a video editor.
   * @note Remote resources are not optimized and therefore should be downloaded
   * in advance and then passed to the editor as local resources.
   *
   * @param {AssetURI | AssetURI[] | VideoSegment[] | {uri: string}} video The source of the video to be edited.
   * Can be either a URI, an object with a member `uri`, or an asset reference
   * which can be optained by, e.g., `require('./video.mp4')` as `number`.
   *
   * For video compositions an array of video sources is accepted as input. If an empty array is
   * passed to the editor `videoSize` must be set. You need to obtain a **valid license** for this 
   * feature to work.
   * @param {Configuration} configuration The configuration used to initialize the editor.
   * @param {object} serialization The serialization used to initialize the editor. This
   * restores a previous state of the editor by re-applying all modifications to the loaded
   * video.
   * @param {Size} videoSize **Video composition only:** The size of the video in pixels that is about to be edited.
   * This overrides the natural dimensions of the video(s) passed to the editor. All videos will
   * be fitted to the `videoSize` aspect by adding black bars on the left and right side or top and bottom.
   * @return {Promise<VideoEditorResult | null>} Returns a `VideoEditorResult` or `null` if the editor
   * is dismissed without exporting the edited video.
   */
  static async openEditor(video, configuration = null, serialization = null, videoSize = null) {
    resolveStaticAssets(configuration)
    const isAndroid = Platform.OS == 'android';
      const videoDimensions = videoSize == null ? (isAndroid ? null : {height: 0, width: 0}) : videoSize;
      const resolvedSerialization = isAndroid ? (serialization != null ? JSON.stringify(serialization) : null) : serialization;
      var result = null;
      var source = null;
      
      if (Array.isArray(video)) {
        source = [];

        video.forEach((videoClip) => {
          if (videoClip.videoURI != null) {
            const resolvedSource = resolveStaticAsset(videoClip.videoURI, isAndroid);
            const resolvedVideo = {...videoClip};
            resolvedVideo.videoURI = resolvedSource
            source.push(resolvedVideo);
          } else {
            const resolvedSource = resolveStaticAsset(videoClip, isAndroid);
            source.push(resolvedSource);
          }
        });
        if (isAndroid) {
          result = await RNVideoEditorSDK.presentComposition(source, configuration, resolvedSerialization, videoDimensions);
        } else {
          result = await RNVideoEditorSDK.presentVideoSegments(source, configuration, resolvedSerialization, videoDimensions);
        }
      } else {
        if (videoSize != null) {
          console.warn("Ignoring the video size. This parameter can only be used in combination with video compositions. If your license includes the video composition feature please wrap your video source into an array instead.")
        }
        source = resolveStaticAsset(video, isAndroid);
        result = await RNVideoEditorSDK.present(source, configuration, resolvedSerialization);
      }
      if (result == null) return null;
      const resolvedResult = {...result};
      if (configuration?.export?.video?.segments == true) {
        const release = () => {
          if (isAndroid) {
            return RNVideoEditorSDK.releaseTemporaryData(result.identifier);
          }
          return;
        }
        resolvedResult.release = release;
      } else {
        delete resolvedResult.segments;
      }
      
      delete resolvedResult.identifier;
      return resolvedResult;
  }

  /**
   * Unlock VideoEditor SDK with a license.
   *
   * @param {string | object} license The license used to unlock the SDK. Can be either an URI
   * pointing to a local `file://` resource that contains the license, the license as a string,
   * or the license as an object which can be optained by, e.g., `require('./vesdk_license')`
   * where the required license files must be named `./vesdk_license.ios.json` for the iOS license
   * and `./vesdk_license.android.json` for the Android license file in order to get automatically
   * resolved by the packager.
   */
  static unlockWithLicense(license) {
    if (Platform.OS == 'android') {
      RNVideoEditorSDK.unlockWithLicense(JSON.stringify(license));
    } else {
      RNVideoEditorSDK.unlockWithLicense(license);
    }
  }
}

class VideoEditorModal extends Component {
  state = {
    visible: false
  }

  static getDerivedStateFromProps = (props, state) => {
    const { video, configuration, serialization, videoSize, onExport, onCancel, onError } = props;
    if (props.visible  && !state.visible) {
      VESDK.openEditor(video, configuration, serialization, videoSize).then(result => {
        if (result !== null) {
          onExport(result);
        } else {
          if (onCancel) {
            onCancel();
          }
        }
      }).catch((error) => {
        if (onError) {
          onError(error);
        }
      });
    }

    return ({ visible: props.visible })
  }

  render() {
    return null;
  }
}

export * from './configuration';
export { VESDK, VideoEditorModal };

