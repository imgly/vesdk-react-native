import {Configuration} from './configuration';

declare class VESDK {
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
  static openEditor(
    videoSource: string | {uri: string} | number,
    configuration: Configuration,
    serialization: object
  ): Promise<{image: string, hasChanges: boolean, serialization: object}>

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
  static unlockWithLicense(
    license: string | object
  ): void

  /**
   * Creates a configuration object populated with default values for all options.
   * @return {Configuration} The default configuration.
   */
  static createDefaultConfiguration(
  ): Configuration
}

export {VESDK};
export * from './configuration';
