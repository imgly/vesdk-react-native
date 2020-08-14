import { Component } from 'react';
import { Configuration } from './configuration';

/**
 * The result of an export.
 */
interface VideoEditorResult {
  /** The edited video. */
  video: string;
  /** An indicator whether the input video was modified at all. */
  hasChanges: boolean;
  /** All modifications applied to the input video if `export.serialization.enabled` of the `Configuration` was set to `true`. */
  serialization?: string | object;
}

declare class VESDK {
  /**
   * Modally present a video editor.
   * @note Edited videos from remote resources can be previewed in the editor but their export will
   * fail! Remote video resources are currently supported for debugging purposes only, e.g., when
   * loading videos with `require('./video.mp4')` for debug builds static video assets will be
   * resolved to remote URLs served by the development packager.
   *
   * @param {string | {uri: string} | number} video The source of the video to be edited.
   * Can be either an URI (local only), an object with a member `uri`, or an asset reference
   * which can be optained by, e.g., `require('./video.mp4')` as `number`.
   * @param {Configuration} configuration The configuration used to initialize the editor.
   * @param {object} serialization The serialization used to initialize the editor. This
   * restores a previous state of the editor by re-applying all modifications to the loaded
   * video.
   *
   * @return {Promise<VideoEditorResult>} Returns a `VideoEditorResult` or `null` if the editor
   * is dismissed without exporting the edited video.
   */
  static openEditor(
    video: string | {uri: string} | number,
    configuration?: Configuration,
    serialization?: object
  ): Promise<VideoEditorResult>

  /**
   * Unlock VideoEditor SDK with a license.
   *
   * @param {string | object} license The license used to unlock the SDK. Can be either an URI
   * pointing to a local `file://` resource that contains the license, the license as a string,
   * or the license as an object which can be optained by, e.g., `require('./vesdk_license')`
   * where the required license files must be named `vesdk_license.ios.json` for the iOS license
   * and `vesdk_license.android.json` for the Android license file in order to get automatically
   * resolved by the packager.
   */
  static unlockWithLicense(
    license: string | object
  ): void
}

/**
 * Props for the `VideoEditorModal` component.
 */
interface VideoEditorModalProps {
  /**
   * This prop determines whether your modal is visible.
   */
  visible: boolean;

  /**
   * This prop determines the source of the video to be edited.
   * Can be either an URI (local only), an object with a member `uri`, or an asset reference
   * which can be optained by, e.g., `require('./video.mp4')` as `number`.
   *
   * @note Edited videos from remote resources can be previewed in the editor but their export will
   * fail! Remote video resources are currently supported for debugging purposes only, e.g., when
   * loading videos with `require('./video.mp4')` for debug builds static video assets will be
   * resolved to remote URLs served by the development packager.
   */
  video: string | {uri: string} | number;

  /**
   * This prop determines the configuration used to initialize the editor.
   */
  configuration?: Configuration;

  /**
   * This prop determines the serialization used to initialize the editor. This
   * restores a previous state of the editor by re-applying all modifications to the loaded
   * video.
   */
  serialization?: object;

  /**
   * This prop determines the callback function that will be called when the user exported a video.
   */
  onExport: (args: VideoEditorResult) => void;

  /**
   * This prop determines the callback function that will be called when the user dismisses the editor without
   * exporting a video.
   */
  onCancel?: () => void;

  /**
   * This prop determines the callback function that will be called when an error occurs.
   */
  onError?: (error: Error) => void;
}

/**
 * State for the `VideoEditorModal` component.
 */
interface VideoEditorModalState {
  /**
   * This state determines whether the modal is visible.
   */
  visible: boolean;
}

/**
 * A component that wraps the `VESDK.openEditor` function to modally present a video editor.
 */
declare class VideoEditorModal extends Component<VideoEditorModalProps, VideoEditorModalState> {}

export { VESDK, VideoEditorModal };
export * from './configuration';
