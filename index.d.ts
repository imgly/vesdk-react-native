import { Component } from "react";
import { AssetURI, Configuration } from "./configuration";

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
  /** The used input video segments that compose the edited `video`. Returned if `export.video.segments` of the `Configuration` was set to `true`. */
  segments?: [VideoSegment];
  /** The size of the **untransformed** video. */
  videoSize: Size;
  /** Releases the result. Needed if `export.video.segments` of the `Configuration` was set to `true`. */
  release?(): void;
}

/** An object that contains width and height values. */
interface Size {
  /** A width value. */
  width: number;
  /** A height value. */
  height: number;
}

/**
 * A video segment with optional trimming.
 *
 * It is used to initialize the editor with a video composition and to retrieve the edited video composition on export.
 * A video composition (edited asset) in combination with a serialization (edit model) can be used to restore the state of the editor.
 */
interface VideoSegment {
  /**
   * A URI for the video segment.
   * @note Remote resources are not optimized and therefore should be downloaded
   * in advance and then passed to the editor as local resources.
   */
  videoURI: AssetURI;
  /**
   * The start time in seconds.
   * @example // Defaults to:
   * null
   */
  startTime?: number;
  /**
   * The end time in seconds.
   * @example // Defaults to:
   * null
   */
  endTime?: number;
}

declare class VESDK {
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
  static openEditor(
    video: AssetURI | AssetURI[] | VideoSegment[] | { uri: string },
    configuration?: Configuration,
    serialization?: object,
    videoSize?: Size
  ): Promise<VideoEditorResult | null>;

  /**
   * Releases the result from the editor and deletes the temporary files.
   * @note This function needs to be called in case `configuration.export.video.segments`
   * is set to `true`.
   *
   * @param {string} identifier The identifier of the `VideoEditorResult` to release
   * the temporary data of.
   */
  static releaseTemporaryData(identifier: string): void;

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
  static unlockWithLicense(license: string | object): void;
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
   * Can be either a URI, an object with a member `uri`, or an asset reference
   * which can be optained by, e.g., `require('./video.mp4')` as `number`.
   * For video compositions an array of video sources is accepted as input. If an empty array is
   * passed to the editor `videoSize` must be set.
   *
   * @note Remote resources are not optimized and therefore should be downloaded
   * in advance and then passed to the editor as local resources.
   */
  video: AssetURI | [AssetURI] | [VideoSegment] | { uri: string };

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
   * The size of the video in pixels that is about to be edited.
   * This overrides the natural dimensions of the video(s) passed to the editor. All videos will
   * be fitted to the `videoSize` aspect by adding black bars on the left and right side or top and bottom.
   */
  videoSize?: Size;

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
declare class VideoEditorModal extends Component<
  VideoEditorModalProps,
  VideoEditorModalState
> {}

export * from "./configuration";
export { VESDK, VideoEditorModal, VideoSegment };

