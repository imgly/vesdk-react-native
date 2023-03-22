/**
 * An asset URI which will always be passed as a `string` to the native platform SDKs.
 * In React Native an `AssetURI` can be assigned with an asset reference which can be
 * obtained by, e.g., `require('./pathToStaticAssetResource.withExtension')` as `number`.
 * Every `AssetURI` as `number` contained in the `Configuration` will be resolved to a URI
 * as `string` when passed to the SDK.
 */
export type AssetURI = string | number

/**
 * Configuration options and asset definitions for image and video editing tasks.
 */
export interface Configuration {
  /**
   * When set to `true`, the user is forced to crop the asset to one of the allowed crop ratios in
   * `transform.items` before being able to use other features of the editor.
   * The transform tool will only be presented if the image does not already fit one of the allowed
   * aspect ratios. It will be presented automatically, if the user changes the orientation of the asset
   * and the result does not match an allowed aspect ratio.
   *
   * This property has no effect unless `transform.allowFreeCrop` is set to `false` or `null`.
   * @example // Defaults to:
   * false
   */
  forceCrop?: boolean;

  /**
   * Defines all allowed actions for the main screen that are displayed as overlay buttons on the canvas.
   * Only buttons for allowed actions are visible.
   * @note The `CanvasAction.REMOVE_BACKGROUND` action is only shown when editing photos where a person could be detected. This feature is only supported on devices running iOS 15+.
   * @note The `CanvasAction.SOUND_ON_OFF` and `CanvasAction.PLAY_PAUSE` action is only shown when editing videos.
   * @example // Defaults to:
   * [CanvasAction.SOUND_ON_OFF, CanvasAction.PLAY_PAUSE, CanvasAction.UNDO, CanvasAction.REDO]
   */
  mainCanvasActions?: Array<
    CanvasAction.REMOVE_BACKGROUND |
    CanvasAction.SOUND_ON_OFF |
    CanvasAction.PLAY_PAUSE |
    CanvasAction.UNDO |
    CanvasAction.REDO
  >;

  /**
   * Controls if the user can zoom the preview image.
   * @example // Defaults to:
   * true
   */
  enableZoom?: boolean;

  /**
   * Global snapping options for all sprites, e.g., stickers, texts, and text designs.
   */
  snapping?: {
    /**
     * Snapping options for positioning sprites.
     */
    position?: {
      /**
       * Whether sprites should snap to specific positions during pan interactions.
       * This switch enables or disables position snapping.
       * @example // Defaults to:
       * true
       */
      enabled?: boolean;
      /**
       * This threshold defines the distance of a pan gesture where snapping at a snap point occurs.
       * It is measured in points.
       * @example // Defaults to:
       * 20
       */
      threshold?: number;
      /**
       * If enabled a sprite's center snaps to the horizontal line through the center of the edited image.
       * @example // Defaults to:
       * true
       */
      snapToHorizontalCenter?: boolean;
      /**
       * If enabled a sprite's center snaps to the vertical line through the center of the edited image.
       * @example // Defaults to:
       * true
       */
      snapToVerticalCenter?: boolean;
      /**
       * The left side of a sprite's bounding box snaps to a vertical line which is shifted
       * from the left side of the edited image towards its center by this value. The value is measured in normalized
       * coordinates relative to the smaller side of the edited image.
       * If this value is explicitly set to `null` this snapping line is disabled.
       * @example // Defaults to:
       * 0.1
       */
      snapToLeft?: number | null;
      /**
       * The right side of a sprite's bounding box snaps to a vertical line which is shifted
       * from the right side of the edited image towards its center by this value. The value is measured in normalized
       * coordinates relative to the smaller side of the edited image.
       * If this value is explicitly set to `null` this snapping line is disabled.
       * @example // Defaults to:
       * 0.1
       */
      snapToRight?: number | null;
      /**
       * The top side of a sprite's bounding box snaps to a horizontal line which is shifted
       * from the top side of the edited image towards its center by this value. The value is measured in normalized
       * coordinates relative to the smaller side of the edited image.
       * If this value is explicitly set to `null` this snapping line is disabled.
       * @example // Defaults to:
       * 0.1
       */
      snapToTop?: number | null;
      /**
       * The bottom side of a sprite's bounding box snaps to a horizontal line which is shifted
       * from the bottom side of the edited image towards its center by this value. The value is measured in normalized
       * coordinates relative to the smaller side of the edited image.
       * If this value is explicitly set to `null` this snapping line is disabled.
       * @example // Defaults to:
       * 0.1
       */
      snapToBottom?: number | null;
    }
    /**
     * Snapping options for rotating sprites.
     */
    rotation?: {
      /**
       * Whether sprites should snap to specific orientations during rotation interactions.
       * This switch enables or disables rotation snapping.
       * @example // Defaults to:
       * true
       */
      enabled?: boolean;
      /**
       * This threshold defines the arc length of a rotation gesture where snapping at a snap angle occurs.
       * It is measured in points.
       * @example // Defaults to:
       * 20
       */
      threshold?: number;
      /**
       * Enabled snapping angles in degrees for rotating a sprite. The rotation angle is defined clockwise.
       * @example // Defaults to:
       * [0, 45, 90, 135, 180, 225, 270, 315]
       */
      snapToAngles?: number[];
    }
  }

  /**
   * Global watermark options.
   */
  watermark?: {
    /**
     * Input image for the watermark. No additional processing is performed on the image.
     * Transparency must be supported by the file itself.
     * If `null` no watermark will be applied.     
     * @note If the watermark is the only editing operation to be performed, `export.force` option
     * must be enabled for the change to be applied. 
     * @example // Defaults to:
     * null     
     */
    watermarkURI?: AssetURI;
    /**
     * The relative size of the watermark.
     * This value is measured in relation to the smaller side of the transformed image/video that the user is editing
     * and the longer side of the watermark image.
     * @note Values outside (0.0, 1.0) will be clamped.
     * @example // Defaults to:
     * 0.2
     */
    size?: number;
    /**
     * The relative spacing between the edges of the image/video and the watermark.
     * This value is measured in relation to the smaller side of the transformed image/video that the user is editing. 
     * @note Values outside (0.0, 0.5) will be clamped.
     * @example // Defaults to:
     * 0.05.
     */
    inset?: number;
    /**
     * It defines the layout of the watermark inside the canvas. 
     * @example // Defaults to:
     * AlignmentMode.TOP_RIGHT
     */
    alignment?: AlignmentMode
  }

  /**
   * The menu items (or tools) to display in the main menu.
   * @example // Defaults to:
   * [Tool.COMPOSITION, Tool.TRANSFORM, Tool.FILTER, Tool.ADJUSTMENT, Tool.FOCUS, Tool.STICKER, Tool.TEXT, Tool.TEXT_DESIGN, Tool.OVERLAY, Tool.FRAME, Tool.BRUSH]
   * // or if your license does not include `Tool.COMPOSITION`:
   * [Tool.TRIM, Tool.TRANSFORM, Tool.FILTER, Tool.ADJUSTMENT, Tool.FOCUS, Tool.STICKER, Tool.TEXT, Tool.TEXT_DESIGN, Tool.OVERLAY, Tool.FRAME, Tool.BRUSH]
   */
  tools?: Tool[];

  /**
   * Configuration options for `Tool.COMPOSITION`.
   */
  composition?: {
    /**
     * Defines all available video clips in the video clip library. Each video clip must be assigned to a category.
     * @note If this array is `null` the defaults are used. If this array is empty the video clip library won't be shown when the user
     * taps the add button in the composition menu instead the device's media library will be shown directly when `personalVideoClips` is enabled.
     * If `personalVideoClips` is disabled in this case the add button in the composition menu won't be shown at all.
     * @example // Defaults to:
     * []
     */
    categories?: (VideoClipCategory)[];
    /**
     * Defines all allowed actions for the composition tool that are displayed as overlay buttons on the canvas.
     * Only buttons for allowed actions are visible.
     * @example // Defaults to:
     * [CanvasAction.PLAY_PAUSE]
     */
    canvasActions?: Array<
      CanvasAction.PLAY_PAUSE
    >;
    /**
     * If enabled the user can add personal video clips from the device's media library. A button is added as last item in the composition
     * menu or as first item in the video clip library menu in front of the video clip categories if any `categories` are defined.
     * @example // Defaults to:
     * true
     */
    personalVideoClips?: boolean;
    /**
     * Configuration options for trimming individual video clips of the video composition.
     */
    clipTrim?: {
      /**
       * Defines all allowed actions for the clip trim tool that are displayed as overlay buttons on the canvas.
       * Only buttons for allowed actions are visible.
       * @example // Defaults to:
       * [CanvasAction.DELETE, CanvasAction.PLAY_PAUSE]
       */
      canvasActions?: Array<
        CanvasAction.DELETE |
        CanvasAction.PLAY_PAUSE
      >;
    }
  }

  /**
   * Configuration options for `Tool.TRIM`.
   */
  trim?: {
    /**
     * Defines all allowed actions for the trim tool that are displayed as overlay buttons on the canvas.
     * Only buttons for allowed actions are visible.
     * @example // Defaults to:
     * [CanvasAction.DELETE, CanvasAction.PLAY_PAUSE]
     */
    canvasActions?: Array<
      CanvasAction.PLAY_PAUSE
    >;
    /**
     * Enforces a minimum allowed duration in seconds for the edited video for the trim and composition tool.
     * The minimum allowed value is 0.5 seconds. See `forceMode` for additional options.
     * @example // Defaults to:
     * 0.5
     */
    minimumDuration?: number;
    /**
     * Enforces a maximum allowed duration in seconds for the edited video for the trim and composition tool
     * if set to a value different from `null`. See `forceMode` for additional options.
     * @example // Defaults to:
     * null
     */
    maximumDuration?: number;
    /**
     * With the force trim option, you're able to enforce a `minimumDuration` and `maximumDuration` for a video composition
     * in the composition tool and/or a single video in the trim tool. Thus users will not be able to export videos,
     * which are not within the defined video duration limits. This feature is implemented as part of the user interface only.
     * To be able to use this feature your subscription must include the trim feature.
     * @example // Defaults to:
     * ForceTrimMode.SILENT
     */
    forceMode?: ForceTrimMode;
  }

  /**
   * Configuration options for `Tool.AUDIO`.
   */
  audio?: {
    /**
     * Defines all available audio clips in the audio clip library. Each audio clip must be assigned to a category.
     * @example // Defaults to:
     * []
     */
    categories?: (AudioClipCategory)[];
    /**
     * Defines all allowed actions for the audio tool that are displayed as overlay buttons on the canvas.
     * Only buttons for allowed actions are visible.
     * @example // Defaults to:
     * [CanvasAction.DELETE]
     */
    canvasActions?: Array<
      CanvasAction.DELETE |
      CanvasAction.PLAY_PAUSE
    >;
  }

  /**
   * Configuration options for `Tool.TRANSFORM`.
   */
  transform?: {
    /**
     * Whether to show a reset button to reset the applied crop, rotation and tilt angle.
     * @example // Defaults to:
     * true
     */
    showResetButton?: boolean;
    /**
     * Whether to allow free cropping. If this is enabled, free cropping is always the first available option.
     * @example // Defaults to:
     * true
     */
    allowFreeCrop?: boolean;
    /**
     * Defines all allowed crop aspect ratios. The crop ratio buttons are shown in the given order.
     * @example // Defaults to:
     * [
     *   { width: 1, height: 1, name: "Square" },
     *   { width: 16, height: 9, toggleable: true },
     *   { width: 4, height: 3, toggleable: true },
     *   { width: 3, height: 2, toggleable: true },
     * ]
     */
    items?: CropRatio[];
  }

  /**
   * Configuration options for `Tool.FILTER`.
   */
  filter?: {
    /**
     * Defines all available filters. Each filter must be assigned to a category.
     * New items and categories can be mixed and matched with existing ones.
     * `NONE` is always added.
     * @example // Defaults to:
     * [
     *   { identifier: "imgly_filter_category_duotone", items: [
     *     { identifier: "imgly_duotone_desert" },
     *     { identifier: "imgly_duotone_peach" },
     *     { identifier: "imgly_duotone_clash" },
     *     { identifier: "imgly_duotone_plum" },
     *     { identifier: "imgly_duotone_breezy" },
     *     { identifier: "imgly_duotone_deepblue" },
     *     { identifier: "imgly_duotone_frog" },
     *     { identifier: "imgly_duotone_sunset" },
     *   ]},
     *   { identifier: "imgly_filter_category_bw", items: [
     *     { identifier: "imgly_lut_ad1920" },
     *     { identifier: "imgly_lut_bw" },
     *     { identifier: "imgly_lut_x400" },
     *     { identifier: "imgly_lut_litho" },
     *     { identifier: "imgly_lut_sepiahigh" },
     *     { identifier: "imgly_lut_plate" },
     *     { identifier: "imgly_lut_sin" },
     *   ]},
     *   { identifier: "imgly_filter_category_vintage", items: [
     *     { identifier: "imgly_lut_blues" },
     *     { identifier: "imgly_lut_front" },
     *     { identifier: "imgly_lut_texas" },
     *     { identifier: "imgly_lut_celsius" },
     *     { identifier: "imgly_lut_cool" },
     *   ]},
     *   { identifier: "imgly_filter_category_smooth", items: [
     *     { identifier: "imgly_lut_chest" },
     *     { identifier: "imgly_lut_winter" },
     *     { identifier: "imgly_lut_kdynamic" },
     *     { identifier: "imgly_lut_fall" },
     *     { identifier: "imgly_lut_lenin" },
     *     { identifier: "imgly_lut_pola669" },
     *   ]},
     *   { identifier: "imgly_filter_category_cold", items: [
     *     { identifier: "imgly_lut_elder" },
     *     { identifier: "imgly_lut_orchid" },
     *     { identifier: "imgly_lut_bleached" },
     *     { identifier: "imgly_lut_bleachedblue" },
     *     { identifier: "imgly_lut_breeze" },
     *     { identifier: "imgly_lut_blueshadows" },
     *   ]},
     *   { identifier: "imgly_filter_category_warm", items: [
     *     { identifier: "imgly_lut_sunset" },
     *     { identifier: "imgly_lut_eighties" },
     *     { identifier: "imgly_lut_evening" },
     *     { identifier: "imgly_lut_k2" },
     *     { identifier: "imgly_lut_nogreen" },
     *   ]},
     *   { identifier: "imgly_filter_category_legacy", items: [
     *     { identifier: "imgly_lut_ancient" },
     *     { identifier: "imgly_lut_cottoncandy" },
     *     { identifier: "imgly_lut_classic" },
     *     { identifier: "imgly_lut_colorful" },
     *     { identifier: "imgly_lut_creamy" },
     *     { identifier: "imgly_lut_fixie" },
     *     { identifier: "imgly_lut_food" },
     *     { identifier: "imgly_lut_fridge" },
     *     { identifier: "imgly_lut_glam" },
     *     { identifier: "imgly_lut_gobblin" },
     *     { identifier: "imgly_lut_highcontrast" },
     *     { identifier: "imgly_lut_highcarb" },
     *     { identifier: "imgly_lut_k1" },
     *     { identifier: "imgly_lut_k6" },
     *     { identifier: "imgly_lut_keen" },
     *     { identifier: "imgly_lut_lomo" },
     *     { identifier: "imgly_lut_lomo100" },
     *     { identifier: "imgly_lut_lucid" },
     *     { identifier: "imgly_lut_mellow" },
     *     { identifier: "imgly_lut_neat" },
     *     { identifier: "imgly_lut_pale" },
     *     { identifier: "imgly_lut_pitched" },
     *     { identifier: "imgly_lut_polasx" },
     *     { identifier: "imgly_lut_pro400" },
     *     { identifier: "imgly_lut_quozi" },
     *     { identifier: "imgly_lut_settled" },
     *     { identifier: "imgly_lut_seventies" },
     *     { identifier: "imgly_lut_soft" },
     *     { identifier: "imgly_lut_steel" },
     *     { identifier: "imgly_lut_summer" },
     *     { identifier: "imgly_lut_tender" },
     *     { identifier: "imgly_lut_twilight" },
     *   ]},
     * ]
     */
    categories?: (FilterCategory | ExistingFilterCategory)[];
    /**
     * Whether categories should be flattened which effectively hides the categories.
     * If this is enabled all filters will be shown in the top-level of the filter selection tool
     * orderer according to their parent category.
     * @example // Defaults to:
     * false
     */
    flattenCategories?: boolean;
  }

  /**
   * Configuration options for `Tool.ADJUSTMENT`.
   */
  adjustment?: {
    /**
     * Whether to show a reset button to reset the applied adjustments.
     * @example // Defaults to:
     * true
     */
    showResetButton?: boolean;
    /**
     * Defines all allowed adjustment tools. The adjustment tool buttons are always shown in the given order.
     * @example // Defaults to:
     * [AdjustmentTool.BRIGHTNESS, AdjustmentTool.CONTRAST, AdjustmentTool.SATURATION, AdjustmentTool.CLARITY, AdjustmentTool.SHADOWS, AdjustmentTool.HIGHLIGHTS, AdjustmentTool.EXPOSURE, AdjustmentTool.GAMMA, AdjustmentTool.BLACKS, AdjustmentTool.WHITES, AdjustmentTool.TEMPERATURE, AdjustmentTool.SHARPNESS]
     */
    items?: AdjustmentTool[];
  }

  /**
   * Configuration options for `Tool.FOCUS`.
   */
  focus?: {
    /**
     * Defines all allowed focus tools. The focus tool buttons are shown in the given order.
     * `NONE` is always added.
     * @example // Defaults to:
     * [FocusTool.NONE, FocusTool.RADIAL, FocusTool.MIRRORED, FocusTool.LINEAR, FocusTool.GAUSSIAN]
     */
    items?: FocusTool[];
  }

  /**
   * Configuration options for `Tool.STICKER`.
   */
  sticker?: {
    /**
     * Defines all available stickers. Each sticker must be assigned to a category.
     * New items and categories can be mixed and matched with existing ones.
     * @note If this array is `null` the defaults are used but the sticker category
     * with the identifier `imgly_sticker_category_animated` is only shown when editing videos.
     * @example // Defaults to:
     * [
     *   { identifier: "imgly_sticker_category_emoticons", items: [
     *     { identifier: "imgly_smart_sticker_weekday" },
     *     { identifier: "imgly_smart_sticker_date" },
     *     { identifier: "imgly_smart_sticker_time" },
     *     { identifier: "imgly_smart_sticker_time_clock" },
     *     { identifier: "imgly_sticker_emoticons_grin" },
     *     { identifier: "imgly_sticker_emoticons_laugh" },
     *     { identifier: "imgly_sticker_emoticons_smile" },
     *     { identifier: "imgly_sticker_emoticons_wink" },
     *     { identifier: "imgly_sticker_emoticons_tongue_out_wink" },
     *     { identifier: "imgly_sticker_emoticons_angel" },
     *     { identifier: "imgly_sticker_emoticons_kisses" },
     *     { identifier: "imgly_sticker_emoticons_loving" },
     *     { identifier: "imgly_sticker_emoticons_kiss" },
     *     { identifier: "imgly_sticker_emoticons_wave" },
     *     { identifier: "imgly_sticker_emoticons_nerd" },
     *     { identifier: "imgly_sticker_emoticons_cool" },
     *     { identifier: "imgly_sticker_emoticons_blush" },
     *     { identifier: "imgly_sticker_emoticons_duckface" },
     *     { identifier: "imgly_sticker_emoticons_furious" },
     *     { identifier: "imgly_sticker_emoticons_angry" },
     *     { identifier: "imgly_sticker_emoticons_steaming_furious" },
     *     { identifier: "imgly_sticker_emoticons_sad" },
     *     { identifier: "imgly_sticker_emoticons_anxious" },
     *     { identifier: "imgly_sticker_emoticons_cry" },
     *     { identifier: "imgly_sticker_emoticons_sobbing" },
     *     { identifier: "imgly_sticker_emoticons_loud_cry" },
     *     { identifier: "imgly_sticker_emoticons_wide_grin" },
     *     { identifier: "imgly_sticker_emoticons_impatient" },
     *     { identifier: "imgly_sticker_emoticons_tired" },
     *     { identifier: "imgly_sticker_emoticons_asleep" },
     *     { identifier: "imgly_sticker_emoticons_sleepy" },
     *     { identifier: "imgly_sticker_emoticons_deceased" },
     *     { identifier: "imgly_sticker_emoticons_attention" },
     *     { identifier: "imgly_sticker_emoticons_question" },
     *     { identifier: "imgly_sticker_emoticons_not_speaking_to_you" },
     *     { identifier: "imgly_sticker_emoticons_sick" },
     *     { identifier: "imgly_sticker_emoticons_pumpkin" },
     *     { identifier: "imgly_sticker_emoticons_boxer" },
     *     { identifier: "imgly_sticker_emoticons_idea" },
     *     { identifier: "imgly_sticker_emoticons_smoking" },
     *     { identifier: "imgly_sticker_emoticons_beer" },
     *     { identifier: "imgly_sticker_emoticons_skateboard" },
     *     { identifier: "imgly_sticker_emoticons_guitar" },
     *     { identifier: "imgly_sticker_emoticons_music" },
     *     { identifier: "imgly_sticker_emoticons_sunbathing" },
     *     { identifier: "imgly_sticker_emoticons_hippie" },
     *     { identifier: "imgly_sticker_emoticons_humourous" },
     *     { identifier: "imgly_sticker_emoticons_hitman" },
     *     { identifier: "imgly_sticker_emoticons_harry_potter" },
     *     { identifier: "imgly_sticker_emoticons_business" },
     *     { identifier: "imgly_sticker_emoticons_batman" },
     *     { identifier: "imgly_sticker_emoticons_skull" },
     *     { identifier: "imgly_sticker_emoticons_ninja" },
     *     { identifier: "imgly_sticker_emoticons_masked" },
     *     { identifier: "imgly_sticker_emoticons_alien" },
     *     { identifier: "imgly_sticker_emoticons_wrestler" },
     *     { identifier: "imgly_sticker_emoticons_devil" },
     *     { identifier: "imgly_sticker_emoticons_star" },
     *     { identifier: "imgly_sticker_emoticons_baby_chicken" },
     *     { identifier: "imgly_sticker_emoticons_rabbit" },
     *     { identifier: "imgly_sticker_emoticons_pig" },
     *     { identifier: "imgly_sticker_emoticons_chicken" },
     *   ]},
     *   { identifier: "imgly_sticker_category_shapes", items: [
     *     { identifier: "imgly_sticker_shapes_badge_01" },
     *     { identifier: "imgly_sticker_shapes_badge_04" },
     *     { identifier: "imgly_sticker_shapes_badge_12" },
     *     { identifier: "imgly_sticker_shapes_badge_06" },
     *     { identifier: "imgly_sticker_shapes_badge_13" },
     *     { identifier: "imgly_sticker_shapes_badge_36" },
     *     { identifier: "imgly_sticker_shapes_badge_08" },
     *     { identifier: "imgly_sticker_shapes_badge_11" },
     *     { identifier: "imgly_sticker_shapes_badge_35" },
     *     { identifier: "imgly_sticker_shapes_badge_28" },
     *     { identifier: "imgly_sticker_shapes_badge_32" },
     *     { identifier: "imgly_sticker_shapes_badge_15" },
     *     { identifier: "imgly_sticker_shapes_badge_20" },
     *     { identifier: "imgly_sticker_shapes_badge_18" },
     *     { identifier: "imgly_sticker_shapes_badge_19" },
     *     { identifier: "imgly_sticker_shapes_arrow_02" },
     *     { identifier: "imgly_sticker_shapes_arrow_03" },
     *     { identifier: "imgly_sticker_shapes_spray_01" },
     *     { identifier: "imgly_sticker_shapes_spray_04" },
     *     { identifier: "imgly_sticker_shapes_spray_03" },
     *   ]},
     *   { identifier: "imgly_sticker_category_animated", items: [
     *     { identifier: "imgly_sticker_animated_camera" },
     *     { identifier: "imgly_sticker_animated_clouds" },
     *     { identifier: "imgly_sticker_animated_coffee" },
     *     { identifier: "imgly_sticker_animated_fire" },
     *     { identifier: "imgly_sticker_animated_flower" },
     *     { identifier: "imgly_sticker_animated_gift" },
     *     { identifier: "imgly_sticker_animated_heart" },
     *     { identifier: "imgly_sticker_animated_movie_clap" },
     *     { identifier: "imgly_sticker_animated_rainbow" },
     *     { identifier: "imgly_sticker_animated_stars" },
     *     { identifier: "imgly_sticker_animated_sun" },
     *     { identifier: "imgly_sticker_animated_thumbs_up" },
     *   ]},
     * ]
     */
    categories?: (StickerCategory | ExistingStickerCategory | ExistingStickerProviderCategory)[];
    /**
     * Defines all available colors that can be applied to stickers with a `tintMode` other than `TintMode.NONE`.
     * The color pipette is always added.
     * @example // Defaults to:
     * [
     *   { color: [0.00, 0.00, 0.00, 0], name: "Transparent" },
     *   { color: [1.00, 1.00, 1.00, 1], name: "White" },
     *   { color: [0.49, 0.49, 0.49, 1], name: "Gray" },
     *   { color: [0.00, 0.00, 0.00, 1], name: "Black" },
     *   { color: [0.40, 0.80, 1.00, 1], name: "Light blue" },
     *   { color: [0.40, 0.53, 1.00, 1], name: "Blue" },
     *   { color: [0.53, 0.40, 1.00, 1], name: "Purple" },
     *   { color: [0.87, 0.40, 1.00, 1], name: "Orchid" },
     *   { color: [1.00, 0.40, 0.80, 1], name: "Pink" },
     *   { color: [0.90, 0.31, 0.31, 1], name: "Red" },
     *   { color: [0.95, 0.53, 0.33, 1], name: "Orange" },
     *   { color: [1.00, 0.80, 0.40, 1], name: "Gold" },
     *   { color: [1.00, 0.97, 0.39, 1], name: "Yellow" },
     *   { color: [0.80, 1.00, 0.40, 1], name: "Olive" },
     *   { color: [0.33, 1.00, 0.53, 1], name: "Green" },
     *   { color: [0.33, 1.00, 0.92, 1], name: "Aquamarin" },
     * ]
     */
    colors?: ColorPalette;
    /**
     * Defines all allowed actions for the sticker tool menu. Only buttons for allowed actions are visible and shown in the given order.
     * @note The `StickerAction.REMOVE_BACKGROUND` action is only shown for personal and external (non-animated) stickers where a person could be detected. This feature is only supported on devices running iOS 15+.
     * @note The `StickerAction.DURATION` action is only shown when editing videos.
     * @example // Defaults to:
     * [StickerAction.DURATION, StickerAction.REPLACE, StickerAction.OPACITY, StickerAction.COLOR, StickerAction.REMOVE_BACKGROUND]
     */
    actions?: StickerAction[];
    /**
     * Defines all allowed actions for the sticker tool that are displayed as overlay buttons on the canvas.
     * Only buttons for allowed actions are visible.
     * @example // Defaults to:
     * [CanvasAction.ADD, CanvasAction.DELETE, CanvasAction.FLIP, CanvasAction.BRING_TO_FRONT, CanvasAction.UNDO, CanvasAction.REDO]
     */
    canvasActions?: Array<
      CanvasAction.UNDO |
      CanvasAction.REDO |
      CanvasAction.DELETE |
      CanvasAction.BRING_TO_FRONT |
      CanvasAction.ADD |
      CanvasAction.FLIP
    >;
    /**
     * If enabled the user can create personal stickers from the device's photo library. A button is added as first item
     * in the menu in front of the sticker categories which modally presents an image selection dialog for personal sticker creation.
     * Personal stickers will be added to a personal sticker category with the identifier `"imgly_sticker_category_personal"` which
     * will be added between the button and the regular sticker categories if it does not exist.
     * @example // Defaults to:
     * false
     */
    personalStickers?: boolean;
    /**
     * The default tint mode for personal stickers.
     * @example // Defaults to:
     * TintMode.NONE
     */
    defaultPersonalStickerTintMode?: TintMode;
  }

  /**
   * Configuration options for `Tool.TEXT`.
   */
  text?: {
    /**
     * Defines all available fonts.
     * New items can be mixed and matched with existing ones.
     * @example // Defaults to:
     * [
     *   { identifier: "imgly_font_open_sans_bold" },
     *   { identifier: "imgly_font_aleo_bold" },
     *   { identifier: "imgly_font_amaticsc" },
     *   { identifier: "imgly_font_archivo_black" },
     *   { identifier: "imgly_font_bungee_inline" },
     *   { identifier: "imgly_font_campton_bold" },
     *   { identifier: "imgly_font_carter_one" },
     *   { identifier: "imgly_font_codystar" },
     *   { identifier: "imgly_font_fira_sans_regular" },
     *   { identifier: "imgly_font_galano_grotesque_bold" },
     *   { identifier: "imgly_font_krona_one" },
     *   { identifier: "imgly_font_kumar_one_outline" },
     *   { identifier: "imgly_font_lobster" },
     *   { identifier: "imgly_font_molle" },
     *   { identifier: "imgly_font_monoton" },
     *   { identifier: "imgly_font_nixie_one" },
     *   { identifier: "imgly_font_notable" },
     *   { identifier: "imgly_font_ostrich_sans_black" },
     *   { identifier: "imgly_font_ostrich_sans_bold" },
     *   { identifier: "imgly_font_oswald_semi_bold" },
     *   { identifier: "imgly_font_palanquin_dark_semi_bold" },
     *   { identifier: "imgly_font_permanent_marker" },
     *   { identifier: "imgly_font_poppins" },
     *   { identifier: "imgly_font_roboto_black_italic" },
     *   { identifier: "imgly_font_roboto_light_italic" },
     *   { identifier: "imgly_font_sancreek" },
     *   { identifier: "imgly_font_stint_ultra_expanded" },
     *   { identifier: "imgly_font_trash_hand" },
     *   { identifier: "imgly_font_vt323" },
     *   { identifier: "imgly_font_yeseva_one" },
     * ]
     */
    fonts?: (Font | ExistingItem)[];
    /**
     * Defines all allowed actions for the text tool menu. Only buttons for allowed actions are visible and shown in the given order.
     * @note The `TextAction.DURATION` action is only shown when editing videos.
     * @example // Defaults to:
     * [TextAction.DURATION, TextAction.FONT, TextAction.COLOR, TextAction.BACKGROUND_COLOR, TextAction.ALIGNMENT]
     */
    actions?: TextAction[];
    /**
     * Defines all allowed actions for the text tool that are displayed as overlay buttons on the canvas.
     * @example // Defaults to:
     * [CanvasAction.ADD, CanvasAction.DELETE, CanvasAction.BRING_TO_FRONT, CanvasAction.UNDO, CanvasAction.REDO]
     */
    canvasActions?: Array<
      CanvasAction.UNDO |
      CanvasAction.REDO |
      CanvasAction.DELETE |
      CanvasAction.BRING_TO_FRONT |
      CanvasAction.ADD |
      CanvasAction.FLIP
    >;
    /**
     * Defines all available colors that can be applied to the text.
     * The color pipette is always added.
     * @example // Defaults to:
     * [
     *   { color: [1.00, 1.00, 1.00, 1], name: "White" },
     *   { color: [0.49, 0.49, 0.49, 1], name: "Gray" },
     *   { color: [0.00, 0.00, 0.00, 1], name: "Black" },
     *   { color: [0.40, 0.80, 1.00, 1], name: "Light blue" },
     *   { color: [0.40, 0.53, 1.00, 1], name: "Blue" },
     *   { color: [0.53, 0.40, 1.00, 1], name: "Purple" },
     *   { color: [0.87, 0.40, 1.00, 1], name: "Orchid" },
     *   { color: [1.00, 0.40, 0.80, 1], name: "Pink" },
     *   { color: [0.90, 0.31, 0.31, 1], name: "Red" },
     *   { color: [0.95, 0.53, 0.33, 1], name: "Orange" },
     *   { color: [1.00, 0.80, 0.40, 1], name: "Gold" },
     *   { color: [1.00, 0.97, 0.39, 1], name: "Yellow" },
     *   { color: [0.80, 1.00, 0.40, 1], name: "Olive" },
     *   { color: [0.33, 1.00, 0.53, 1], name: "Green" },
     *   { color: [0.33, 1.00, 0.92, 1], name: "Aquamarin" },
     * ]
     */
    textColors?: ColorPalette;
    /**
     * Defines all available colors that can be applied to the background.
     * The color pipette is always added.
     * @example // Defaults to:
     * [
     *   { color: [0.00, 0.00, 0.00, 0], name: "Transparent" },
     *   { color: [1.00, 1.00, 1.00, 1], name: "White" },
     *   { color: [0.49, 0.49, 0.49, 1], name: "Gray" },
     *   { color: [0.00, 0.00, 0.00, 1], name: "Black" },
     *   { color: [0.40, 0.80, 1.00, 1], name: "Light blue" },
     *   { color: [0.40, 0.53, 1.00, 1], name: "Blue" },
     *   { color: [0.53, 0.40, 1.00, 1], name: "Purple" },
     *   { color: [0.87, 0.40, 1.00, 1], name: "Orchid" },
     *   { color: [1.00, 0.40, 0.80, 1], name: "Pink" },
     *   { color: [0.90, 0.31, 0.31, 1], name: "Red" },
     *   { color: [0.95, 0.53, 0.33, 1], name: "Orange" },
     *   { color: [1.00, 0.80, 0.40, 1], name: "Gold" },
     *   { color: [1.00, 0.97, 0.39, 1], name: "Yellow" },
     *   { color: [0.80, 1.00, 0.40, 1], name: "Olive" },
     *   { color: [0.33, 1.00, 0.53, 1], name: "Green" },
     *   { color: [0.33, 1.00, 0.92, 1], name: "Aquamarin" },
     * ]
     */
    backgroundColors?: ColorPalette;
    /**
     * Defines the default text color for newly created text.
     * @example // Defaults to:
     * [1, 1, 1, 1]
     */
    defaultTextColor?: Color;
    /**
     * Whether the user can use emojis as text input.
     * @note Emojis are not cross-platform compatible. If you use the serialization feature to share edits
     * across different platforms emojis will be renderd with the system's local set of emojis and will appear differently.
     * @example // Defaults to:
     * false
     */
    allowEmojis?: boolean;
  }

  /**
   * Configuration options for `Tool.TEXT_DESIGN`.
   */
  textdesign?: {
    /**
     * Defines all available text designs.
     * New items can be mixed and matched with existing ones.
     * @example // Defaults to:
     * [
     *   { identifier: "imgly_text_design_blocks" },
     *   { identifier: "imgly_text_design_rotated" },
     *   { identifier: "imgly_text_design_blocks_light" },
     *   { identifier: "imgly_text_design_equal_width" },
     *   { identifier: "imgly_text_design_masked" },
     *   { identifier: "imgly_text_design_celebrate" },
     *   { identifier: "imgly_text_design_sunshine" },
     *   { identifier: "imgly_text_design_masked_badge" },
     *   { identifier: "imgly_text_design_blocks_condensed" },
     *   { identifier: "imgly_text_design_celebrate_simple" },
     *   { identifier: "imgly_text_design_equal_width_fat" },
     *   { identifier: "imgly_text_design_watercolor" },
     *   { identifier: "imgly_text_design_particles" },
     *   { identifier: "imgly_text_design_masked_speech_bubble" },
     *   { identifier: "imgly_text_design_masked_speech_bubble_comic" },
     *   { identifier: "imgly_text_design_multiline" },
     * ]
     */
    items?: ExistingItem[];
    /**
     * Defines all allowed actions for the text design tool that are displayed as overlay buttons on the canvas.
     * @example // Defaults to:
     * [CanvasAction.ADD, CanvasAction.DELETE, CanvasAction.INVERT, CanvasAction.BRING_TO_FRONT, CanvasAction.UNDO, CanvasAction.REDO]
     */
    canvasActions?: Array<
      CanvasAction.UNDO |
      CanvasAction.REDO |
      CanvasAction.DELETE |
      CanvasAction.BRING_TO_FRONT |
      CanvasAction.ADD |
      CanvasAction.INVERT
    >;
    /**
     * Defines all available colors that can be applied to the text design.
     * @example // Defaults to:
     * [
     *   { color: [1.00, 1.00, 1.00, 1], name: "White" },
     *   { color: [0.49, 0.49, 0.49, 1], name: "Gray" },
     *   { color: [0.00, 0.00, 0.00, 1], name: "Black" },
     *   { color: [0.40, 0.80, 1.00, 1], name: "Light blue" },
     *   { color: [0.40, 0.53, 1.00, 1], name: "Blue" },
     *   { color: [0.53, 0.40, 1.00, 1], name: "Purple" },
     *   { color: [0.87, 0.40, 1.00, 1], name: "Orchid" },
     *   { color: [1.00, 0.40, 0.80, 1], name: "Pink" },
     *   { color: [0.90, 0.31, 0.31, 1], name: "Red" },
     *   { color: [0.95, 0.53, 0.33, 1], name: "Orange" },
     *   { color: [1.00, 0.80, 0.40, 1], name: "Gold" },
     *   { color: [1.00, 0.97, 0.39, 1], name: "Yellow" },
     *   { color: [0.80, 1.00, 0.40, 1], name: "Olive" },
     *   { color: [0.33, 1.00, 0.53, 1], name: "Green" },
     *   { color: [0.33, 1.00, 0.92, 1], name: "Aquamarin" },
     * ]
     */
    colors?: ColorPalette;
  }

  /**
   * Configuration options for `Tool.OVERLAY`.
   */
  overlay?: {
    /**
     * Defines all available overlays.
     * New items can be mixed and matched with existing ones.
     * `NONE` is always added.
     * @example // Defaults to:
     * [
     *   { identifier: "imgly_overlay_golden" },
     *   { identifier: "imgly_overlay_lightleak1" },
     *   { identifier: "imgly_overlay_rain" },
     *   { identifier: "imgly_overlay_mosaic" },
     *   { identifier: "imgly_overlay_vintage" },
     *   { identifier: "imgly_overlay_paper" },
     * ]
     */
    items?: (Overlay | ExistingItem)[];
    /**
     * Defines all allowed blend modes for the overlays.
     * @example // Defaults to:
     * [BlendMode.NORMAL, BlendMode.MULTIPLY, BlendMode.OVERLAY, BlendMode.SCREEN, BlendMode.LIGHTEN, BlendMode.SOFT_LIGHT, BlendMode.HARD_LIGHT, BlendMode.DARKEN, BlendMode.COLOR_BURN]
     */
    blendModes?: BlendMode[];
  }

  /**
   * Configuration options for `Tool.FRAME`.
   */
  frame?: {
    /**
     * Defines all available frames.
     * New items can be mixed and matched with existing ones.
     * `NONE` is always added.
     * @example // Defaults to:
     * [
     *   { identifier: "imgly_frame_dia" },
     *   { identifier: "imgly_frame_art_decor" },
     *   { identifier: "imgly_frame_black_passepartout" },
     *   { identifier: "imgly_frame_wood_passepartout" },
     * ]
     */
    items?: (Frame | ExistingItem)[];
    /**
     * Defines all allowed actions for the frame tool menu. Only buttons for allowed actions are visible and shown in the given order.
     * @example // Defaults to:
     * [FrameAction.REPLACE, FrameAction.WIDTH, FrameAction.OPACITY]
     */
    actions?: FrameAction[];
  }

  /**
   * Configuration options for `Tool.BRUSH`.
   */
  brush?: {
    /**
     * Defines all allowed actions for the brush tool menu. Only buttons for allowed actions are visible and shown in the given order.
     * @example // Defaults to:
     * [BrushAction.COLOR, BrushAction.SIZE, BrushAction.HARDNESS]
     */
    actions?: BrushAction[];
    /**
     * Defines all allowed actions for the brush tool that are displayed as overlay buttons on the canvas.
     * Only buttons for allowed actions are visible.
     * @example // Defaults to:
     * [CanvasAction.DELETE, CanvasAction.BRING_TO_FRONT, CanvasAction.UNDO, CanvasAction.REDO]
     */
    canvasActions?: Array<
      CanvasAction.UNDO |
      CanvasAction.REDO |
      CanvasAction.DELETE |
      CanvasAction.BRING_TO_FRONT
    >;
    /**
     * Defines all available colors that can be applied to the brush.
     * The color pipette is always added.
     * @example // Defaults to:
     * [
     *   { color: [1.00, 1.00, 1.00, 1], name: "White" },
     *   { color: [0.49, 0.49, 0.49, 1], name: "Gray" },
     *   { color: [0.00, 0.00, 0.00, 1], name: "Black" },
     *   { color: [0.40, 0.80, 1.00, 1], name: "Light blue" },
     *   { color: [0.40, 0.53, 1.00, 1], name: "Blue" },
     *   { color: [0.53, 0.40, 1.00, 1], name: "Purple" },
     *   { color: [0.87, 0.40, 1.00, 1], name: "Orchid" },
     *   { color: [1.00, 0.40, 0.80, 1], name: "Pink" },
     *   { color: [0.90, 0.31, 0.31, 1], name: "Red" },
     *   { color: [0.95, 0.53, 0.33, 1], name: "Orange" },
     *   { color: [1.00, 0.80, 0.40, 1], name: "Gold" },
     *   { color: [1.00, 0.97, 0.39, 1], name: "Yellow" },
     *   { color: [0.80, 1.00, 0.40, 1], name: "Olive" },
     *   { color: [0.33, 1.00, 0.53, 1], name: "Green" },
     *   { color: [0.33, 1.00, 0.92, 1], name: "Aquamarin" },
     * ]
     */
    colors?: ColorPalette;
    /**
     * Defines the default brush color.
     * @example // Defaults to:
     * [1, 1, 1, 1]
     */
    defaultColor?: Color;
    /**
     * The minimum size that a brush can have. This value is measured in relation to the
     * smaller side of the image that the user is editing. If the value is `null` the
     * minimum brush size is set to the absolute size of a single pixel of the edited image.
     * @example // Defaults to:
     * null
     */
    minimumSize?: number;
    /**
     * The maximum size that a brush can have. This value is measured in relation to the
     * smaller side of the image that the user is editing.
     * @example // Defaults to:
     * 0.125
     */
    maximumSize?: number;
    /**
     * The default size of the brush. This value is measured in relation to the
     * smaller side of the image that the user is editing.
     * @example // Defaults to:
     * 0.05
     */
    defaultSize?: number;
    /**
     * The minimum hardness factor a brush can have.
     * @example // Defaults to:
     * 0
     */
    minimumHardness?: number;
    /**
     * The maximum hardness factor a brush can have.
     * @example // Defaults to:
     * 1
     */
    maximumHardness?: number;
    /**
     * The default hardness factor of the brush.
     * @example // Defaults to:
     * 0.5
     */
    defaultHardness?: number;
  }

  /**
   * Export configuration options.
   */
  export?: {
    /**
     * Image export configuration if the editor supports image editing.
     */
    image?: {
      /**
       * The image export type.
       * @example // Defaults to:
       * ImageExportType.FILE_URL
       */
      exportType?: ImageExportType;
      /**
       * The image file format of the generated high resolution image.
       * @example // Defaults to:
       * ImageFormat.JPEG
       */
      format?: ImageFormat;
      /**
       * The compression quality to use when creating the output image with a lossy file format.
       * @example // Defaults to:
       * 0.9
       */
      quality?: number;
    }
    /**
     * Video export configuration if the editor supports video editing.
     */
    video?: {
      /**
       * The video container format to export.
       * @example // Defaults to:
       * VideoFormat.MP4
       */
      format?: VideoFormat;
      /**
       * The video codec to use for the exported video.
       * @example // Defaults to:
       * VideoCodec.H264
       */
      codec?: VideoCodec;
      /**
       * The compression quality to use when exporting to VideoCodec.HEVC.
       * @example // Defaults to:
       * 0.9
       */
      quality?: number;
      /**
       * The bit rate in bits per second to use when exporting to VideoCodec.H264.
       * @example // Defaults to:
       * null
       */
      bitRate?: number | null;
      /**
       * Whether the video editor should include the video segments of the composition
       * in the `VideoEditorResult`.
       * @note If enabled, you need to release the result via `VideoEditorResult.release()`
       * after processing the video segments in order to prevent memory leaks.
       * 
       * @example // Defaults to:
       * false
       */
       segments?: boolean;
    }
    /**
     * The filename for the exported data if the `exportType` is not `ImageExportType.DATA_URL`.
     * The correct filename extension will be automatically added
     * based on the selected export format. It can be an absolute path or file URL or a relative path.
     * If some relative path is chosen it will be created in a temporary system directory and overwritten
     * if the corresponding file already exists. If the value is `null` an new temporary file will be
     * created for every export.
     * @note Please make sure that the provided `filename` is valid for the different devices and that
     * your application has the corresponding access rights to write to the desired location. For Android,
     * you will want to make sure to set this inside one of the directories conforming to scoped storage:
     * - DCIM/
     * - Pictures/
     * 
     * For Videos you can additionally use:
     *  - Movies/
     * @example // Defaults to:
     * null
     */
    filename?: string | null;
    /** 
     * If enabled, the photo/video will be rendered and exported in the defined output format
     * even if no changes have been applied. Otherwise, the input asset will be passed 
     * through and might not match the defined output format.
     * @example // Defaults to:
     * false
     */
    force?: boolean;
    /**
     * Export configuration of the serialized image and video editing operations that were applied to
     * the input media loaded into the editor. This also allows to recover these operations the next
     * time the editor is opened again.
     */
    serialization?: {
      /**
       * Whether the serialization of the editing operations should be exported.
       * @example // Defaults to:
       * false
       */
      enabled?: boolean;
      /**
       * The serialization export type.
       * @example // Defaults to:
       * SerializationExportType.FILE_URL
       */
      exportType?: SerializationExportType;
      /**
       * The file URI for the exported serialization data if the `exportType` is `SerializationExportType.FILE_URL`.
       * The filename extension for JSON will be automatically added.
       * If the value is `null` an new temporary file will be created for every export based on the filename for 
       * the exported image or video data.
       * @note Please make sure that the provided `filename` is a valid file URI for the different devices and that
       * your application has the corresponding access rights to write to the desired location.
       * @example // Defaults to:
       * null
       */
      filename?: string | null;
      /**
       * Whether the serialization data should include the original input image data.
       * @example // Defaults to:
       * false
       */
      embedSourceImage?: boolean;
    }
  }

  /**
   * Defines the theme that should be used to style the user interface.
   * @note This runtime theming configuration is currently not supported on Android.
   * Please use the compile-time theming configuration instead:
   * https://docs.photoeditorsdk.com/guides/android/v7_1/customization/themes#color-theming
   * @example // Defaults to:
   * ExistingTheme.DARK
   */
  theme?: ExistingTheme | string;

  /**
   * Customization options.
   */
  custom?: {
    /**
     * Theming options to change the user interface appearance. This allows to alter predefined existing
     * theme presets or to create new themes which can be enabled when their corresponding key (name)
     * is set as the `Configuration.theme`.
     * @note This runtime theming configuration is currently not supported on Android.
     * Please use the compile-time theming configuration instead:
     * https://docs.photoeditorsdk.com/guides/android/v7_1/customization/themes#color-theming
     */
    themes?: {
      [key: string]: Theme;
    }
  }
}

/** An image and/or video editing tool. */
export enum Tool {
  /** A tool to compose a video from multiple video clips and to trim the timeline of the composition and the individual clips. */
  COMPOSITION = "composition",
  /** A tool to trim the timeline of videos. */
  TRIM = "trim",
  /** A tool to edit the audio track of videos. */
  AUDIO = "audio",
  /** A tool to apply an transformation, such as cropping or rotation. */
  TRANSFORM = "transform",
  /** A tool to apply an image filter effect. */
  FILTER = "filter",
  /** A tool to apply image adjustments. */
  ADJUSTMENT = "adjustment",
  /** A tool to add blur. */
  FOCUS = "focus",
  /** A tool to add stickers. */
  STICKER = "sticker",
  /** A tool to add texts. */
  TEXT = "text",
  /** A tool to add text designs. */
  TEXT_DESIGN = "textdesign",
  /** A tool to add an overlay. */
  OVERLAY = "overlay",
  /** A tool to add a frame. */
  FRAME = "frame",
  /** A tool to add drawings. */
  BRUSH = "brush",
}

/** An image format. */
export enum ImageFormat {
  JPEG = "image/jpeg",
  PNG = "image/png",
  HEIF = "image/heif",
  TIFF = "image/tiff",
}

/** A video format. */
export enum VideoFormat {
  MP4 = "video/mp4",
  MOV = "video/quicktime",
}

/** A video codec. */
export enum VideoCodec {
  H264 = "h264",
  HEVC = "hevc",
}

/** An image export type. */
export enum ImageExportType {
  /** The exported image is saved to a file and the corresponding file URL is returned. */
  FILE_URL = "file-url",
  /** The exported image is returned as a data URL which encodes the exported image. */
  DATA_URL = "data-url",
}

/** A serialization export type. */
export enum SerializationExportType {
  /** The exported serialization is saved to a file and the corresponding file URL is returned. */
  FILE_URL = "file-url",
  /** The exported serialization is returned as an object. */
  OBJECT = "object",
}

/** An adjustment tool. */
export enum AdjustmentTool {
  BRIGHTNESS = "brightness",
  CONTRAST = "contrast",
  SATURATION = "saturation",
  CLARITY = "clarity",
  SHADOWS = "shadows",
  HIGHLIGHTS = "highlights",
  EXPOSURE = "exposure",
  GAMMA = "gamma",
  BLACKS = "blacks",
  WHITES = "whites",
  TEMPERATURE = "temperature",
  SHARPNESS = "sharpness",
}

/** A blur tool. */
export enum FocusTool {
  NONE = "none",
  RADIAL = "radial",
  MIRRORED = "mirrored",
  LINEAR = "linear",
  GAUSSIAN = "gaussian",
}

/** A force trim mode. */
export enum ForceTrimMode {
  /**
   * Will always automatically present the composition tool or the trim tool
   * after opening the editor and force your users to change the length of the video(s).
   *
   * The composition tool will only be used if it is included in your subscription and if it is included in `tools`
   * or if both the composition and trim tool are not included in `tools`.
   * Otherwise, the trim tool is used if it is included in your subscription.
   */
  ALWAYS = "always",
  /**
   * Will automatically present the composition or trim tool if needed.
   *
   * Will only present:
   * - the composition tool, if your initial composition is longer than `trim.maximumDuration` or shorter than `trim.minimumDuration`, or
   * - the trim tool, if your initial video is longer than `trim.maximumDuration`. If the video is shorter than `trim.minimumDuration` an alert
   *   is displayed as soon as the editor is opened and after dismissing the alert, the editor is closed.
   *
   * The composition tool will only be used if it is included in your subscription and if it is included in `tools`
   * or if both the composition and trim tool are not included in `tools`.
   * Otherwise, the trim tool is used if it is included in your subscription.
   */
  IF_NEEDED = "ifneeded",
  /**
   * Will automatically trim the video to `trim.maximumDuration` without opening any tool.
   * If the length of the initially loaded video(s) is shorter than `trim.minimumDuration` and the user has the option to add more videos (because of composition),
   * an alert will be shown when tapping the export button and after dismissing the alert, the composition tool will automatically open.
   * If no additional videos can be added, an alert is displayed as soon as the editor is opened and after dismissing the alert, the editor is closed.
   */
  SILENT = "silent",
}

/** A tint mode. */
export enum TintMode {
  NONE = "none",
  SOLID = "solid",
  COLORIZED = "colorized",
}

/** A blend mode. */
export enum BlendMode {
  NORMAL = "normal",
  OVERLAY = "overlay",
  SOFT_LIGHT = "softlight",
  HARD_LIGHT = "hardlight",
  MULTIPLY = "multiply",
  DARKEN = "darken",
  COLOR_BURN = "colorburn",
  SCREEN = "screen",
  LIGHTEN = "lighten",
}

/** A frame layout mode. */
export enum FrameLayoutMode {
  HORIZONTAL_INSIDE = "horizontal-inside",
  VERTICAL_INSIDE = "vertical-inside",
}

/** A frame tile mode. */
export enum FrameTileMode {
  REPEAT = "repeat",
  STRETCH = "stretch",
}

/** An alignment mode. */
export enum AlignmentMode {
  CENTER = "center",
  TOP_LEFT = "top-left",
  TOP_RIGHT = "top-right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_RIGHT = "bottom-right"
}

/** A canvas action. */
export enum CanvasAction {
  UNDO = "undo",
  REDO = "redo",
  DELETE = "delete",
  BRING_TO_FRONT = "bringtofront",
  ADD = "add",
  FLIP = "flip",
  INVERT = "invert",
  SOUND_ON_OFF = "soundonoff",
  PLAY_PAUSE = "playpause",
  REMOVE_BACKGROUND = "removebackground",
}

/** A sticker action. */
export enum StickerAction {
  COLOR = "color",
  STRAIGHTEN = "straighten",
  BRIGHTNESS = "brightness",
  CONTRAST = "contrast",
  SATURATION = "saturation",
  REPLACE = "replace",
  OPACITY = "opacity",
  REMOVE_BACKGROUND = "removebackground",
  DURATION = "duration"
}

/** A text action. */
export enum TextAction {
  FONT = "font",
  COLOR = "color",
  BACKGROUND_COLOR = "backgroundcolor",
  ALIGNMENT = "alignment",
  DURATION = "duration"
}

/** A frame action. */
export enum FrameAction {
  REPLACE = "replace",
  WIDTH = "width",
  OPACITY = "opacity",
}

/** A brush action. */
export enum BrushAction {
  COLOR = "color",
  SIZE = "size",
  HARDNESS = "hardness",
}

/** A predefined theme preset to define the user interface appearance. */
export enum ExistingTheme {
  /** A user interface style with dark appearance. */
  DARK = "dark",
  /** A user interface style with light appearance. */
  LIGHT = "light",
  /** A theme that switches dynamically between the light and the
   * dark theme based on the active system user interface style. */
  DYNAMIC = "dynamic",
}

/**
 * A color can be represented as:
 * - `number[]`: which encodes a single gray value or a RGB(A) tuple of floating point values where
 *   each channel is defined in the range of `[0, 1]`.
 * - `string`: which is a hex color code string of a 12-bit RGB, 24-bit RGB, or 32-bit ARGB color value.
 * - `number`: which is the the binary representation of a 32-bit ARGB color value.
 *   The function `processColor` in React Native returns colors in this format.
 */
export type Color = number[] | number | string | null;

/** A named color. */
export interface NamedColor {
  /** The color. */
  color: Color;
  /** The name of the color which is also used for accessibliblity. */
  name: string;
}

/** A color palette of named colors. */
export type ColorPalette = NamedColor[];

/** A crop aspect ratio. */
export interface CropRatio {
  /** The width of the ratio. */
  width: number;
  /** The height of the ratio. */
  height: number;
  /**
   * If enabled the `width` and `height` of a ratio can be toggled in the UI.
   * @example // Defaults to:
   * false
   */
  toggleable?: boolean;
  /**
   * A displayable name for the item which is also used for accessibliblity.
   * If `null` the name is automatically generated from the `width` and `height` values and
   * the name will always be overwritten by this auto-generated name if the user toggles the
   * aspect when `toggleable` is enabled.
   * @example // Defaults to:
   * null
   */
  name?: string;
}

/** A unique identifiable item. */
export interface UniqueItem {
  /** A unqiue string that makes the item unique identifiable. */
  identifier: string;
}

/** An existing item. */
export interface ExistingItem extends UniqueItem {}

/** A named and unique identifiable item. */
export interface NamedItem extends UniqueItem {
  /** A displayable name for the item which is also used for accessibliblity. */
  name: string;
}

/** A media item. */
export interface MediaItem extends UniqueItem {
  /**
   * The title of the media item.
   * @example // Defaults to:
   * null
   */
  title?: string;
  /**
   * The artist of the media item.
   * @example // Defaults to:
   * null
   */
  artist?: string;
}

/** A video clip category. */
export interface VideoClipCategory extends NamedItem {
  /**
   * A URI for the thumbnail image of the category.
   * If `null` a placeholder image will be used.
   */
  thumbnailURI?: AssetURI;
  /**
   * Items of the category.
   * If `null` an empty category will be created.
   * @example // Defaults to:
   * null
   */
  items?: (VideoClip)[];
}

/** A video clip. */
export interface VideoClip extends MediaItem {
  /**
   * A URI for the thumbnail image of the video clip.
   * If `null` the thumbnail will be automatically generated from the `videoURI`.
   * @example // Defaults to:
   * null
   */
  thumbnailURI?: AssetURI;
  /** A URI for the video clip.
   * @note Remote resources are not optimized and therefore should be downloaded
   * in advance and then passed to the editor as local resources.
   */
  videoURI: AssetURI;
}

/** A audio clip category. */
export interface AudioClipCategory extends NamedItem {
  /**
   * A URI for the thumbnail image of the category.
   * If `null` a placeholder image will be used.
   */
  thumbnailURI?: AssetURI;
  /**
   * Items of the category.
   * If `null` an empty category will be created.
   * @example // Defaults to:
   * null
   */
  items?: (AudioClip)[];
}

/** An audio clip. */
export interface AudioClip extends MediaItem {
  /**
   * A URI for the thumbnail image of the audio clip.
   * If `null` a placeholder image will be used.
   * @example // Defaults to:
   * null
   */
  thumbnailURI?: AssetURI;
  /**
   * The duration of the audio clip in seconds.
   * If `null` the duration will be automatically derived from the asset.
   * @example // Defaults to:
   * null
   */
  duration?: number;
  /** A URI for the audio clip.
   * @note Remote resources are not optimized and therefore should be downloaded
   * in advance and then passed to the editor as local resources.
   */
  audioURI: AssetURI;
}

/** An existing filter category. */
export interface ExistingFilterCategory extends ExistingItem {
  /**
   * Items of the category which can be existing or new defined filters.
   * If `null` the referenced existing category will keep its predefined items.
   * @example // Defaults to:
   * null
   */
  items?: (Filter | ExistingItem)[];
}

/** A filter category. */
export interface FilterCategory extends NamedItem {
  /**
   * A URI for the thumbnail image of the category. If `null` the category will not have a thumbnail
   * image which won't be required if `flattenCategories` is enabled for the `Tool.FILTER`.
   * @example // Defaults to:
   * null
   */
  thumbnailURI?: AssetURI;
  /**
   * Items of the category which can be existing or new defined filters.
   * If `null` an empty category will be created.
   * @example // Defaults to:
   * null
   */
  items?: (Filter | ExistingItem)[];
}

/** An image filter. */
export type Filter = LUTFilter | DuoToneFilter;

/** A look up table (LUT) image filter. */
export interface LUTFilter extends NamedItem {
  /** A URI for the look up table (LUT) image. */
  lutURI: AssetURI;
  /**
   * The number of horizontal tiles in the LUT image.
   * @example // Defaults to:
   * 5
   */
  horizontalTileCount?: number;
  /**
   * The number of vertical tiles in the LUT image.
   * @example // Defaults to:
   * 5
   */
  verticalTileCount?: number;
}

/** A duotone image filter. */
export interface DuoToneFilter extends NamedItem {
  /** The duotone color that is mapped to light colors of the input image. */
  lightColor: Color;
  /** The duotone color that is mapped to dark colors of the input image. */
  darkColor: Color;
}

/** An existing sticker category. */
export interface ExistingStickerCategory extends ExistingItem {
  /**
   * Items of the category which can be existing or new defined stickers.
   * If `null` the referenced existing category will keep its predefined items.
   * @example // Defaults to:
   * null
   */
  items?: (Sticker | ExistingItem)[];
}

/** A sticker category. */
export interface StickerCategory extends NamedItem {
  /** A URI for the thumbnail image of the category. */
  thumbnailURI: AssetURI;
  /**
   * Items of the category which can be existing or new defined stickers.
   * If `null` an empty category will be created.
   * @example // Defaults to:
   * null
   */
  items?: (Sticker | ExistingItem)[];
}

/** An existing sticker provider category. */
export interface ExistingStickerProviderCategory extends ExistingItem {
  /**
   * The used sticker provider that must match the category's identifier.
   */
   provider: GiphyStickerProvider;
}

/**
 * A GIPHY sticker provider.
 * @note This sticker provider requires to use the identifier `imgly_sticker_category_giphy` for its `ExistingStickerProviderCategory`.
 */
export interface GiphyStickerProvider {
  /**
   * The key used to authorize API requests, obtained from GIPHY.
   */
  apiKey: string;
  /**
   * The default language for regional content in 2-letter ISO 639-1 language code.
   * If `null` the language setting of the current locale is used.  
   * @example // Defaults to:
   * null
   */
  language?: string;
  /**
   * The audience category used for content filtering. Available values are `"g"`, `"pg"`, `"pg-13"`, `"r"`.
   * @example // Defaults to:
   * "g"
   */
  rating?: string;
}

/** A sticker. */
export interface Sticker extends NamedItem {
  /**
   * A URI for the thumbnail image of the sticker.
   * If `null` the thumbnail will be automatically generated from the `stickerURI`.
   * @example // Defaults to:
   * null
   */
  thumbnailURI?: AssetURI;
  /** A URI for the sticker image. */
  stickerURI: AssetURI;
  /**
   * The sticker tint mode.
   * @example // Defaults to:
   * TintMode.NONE
   */
  tintMode?: TintMode;
  /**
   * If enabled the brightness, contrast, and saturation of a sticker can be changed if
   * the corresponding `StickerAction`s in the `Tool.STICKER` are enabled.
   * @example // Defaults to:
   * false
   */
  adjustments?: boolean;
}

/** A font. */
export interface Font extends NamedItem {
  /**
   * The actual font name or system font name, e.g. `Chalkduster`.
   */
  fontName: string;
  /**
   * A URI for the font file. `TTF` and `OTF` fonts are allowed.
   * If `null` the `fontName` is assumed to be a system font.
   * @example // Defaults to:
   * null
   * */
  fontURI?: AssetURI;
}

/** An overlay. */
export interface Overlay extends NamedItem {
  /**
   * A URI for the thumbnail image of the overlay.
   * If `null` the thumbnail will be automatically generated form the `overlayURI`.
   * @example // Defaults to:
   * null
   */
  thumbnailURI?: AssetURI;
  /** A URI for the overlay image. */
  overlayURI: AssetURI;
  /** The default blend mode that is used to apply the overlay. */
  defaultBlendMode: BlendMode;
}

/** A frame. */
export interface Frame extends NamedItem {
  /** A URI for the thumbnail image of the frame. */
  thumbnailURI: AssetURI;
  /**
   * The layout mode of the patches of the frame.
   * @example // Defaults to:
   * FrameLayoutMode.HORIZONTAL_INSIDE
   */
  layoutMode?: FrameLayoutMode;
  /** The relative scale of the frame which is defined in relatation to the shorter side of the
   * resulting output image. */
  relativeScale: number;
  /** Images for the 12-patch layout of a dynamic frame that automatically adapts to
   * any output image resolution. */
  imageGroups: {
    /**
     * The top image group.
     * If `null` there is no top group.
     * @example // Defaults to:
     * null
     */
    top?: FrameImageGroup;
    /**
     * The left image group.
     * If `null` there is no left group.
     * @example // Defaults to:
     * null
     */
    left?: FrameImageGroup;
    /**
     * The right image group.
     * If `null` there is no right group.
     * @example // Defaults to:
     * null
     */
    right?: FrameImageGroup;
    /**
     * The bottom image group.
     * If `null` there is no bottom group.
     * @example // Defaults to:
     * null
     */
    bottom?: FrameImageGroup;
  }
}

/** An image group for the 12-patch layout of a dynamic frame. */
export interface FrameImageGroup {
  /**
   * A URI for the start image.
   * If `null` there is no start image.
   * @example // Defaults to:
   * null
   */
  startURI?: AssetURI;
  /**
   * A URI for the middle image.
   */
  midURI: AssetURI;
  /**
   * The render mode for the middle image.
   * @example // Defaults to:
   * FrameTileMode.REPEAT
   */
  midMode?: FrameTileMode;
  /**
   * A URI for the end image.
   * If `null` there is no end image.
   * @example // Defaults to:
   * null
   */
  endURI?: AssetURI;
}

/** A theme which defines the appearance of the user interface. */
export interface Theme {
  /**
   * The tint color of highlighted user interface elements.
   * If `null` it defaults to the system tint color if available or the value of the theme that is modified.
   * @example // Defaults to:
   * null
   */
  tint?: Color;
  /**
   * The primary color which is mainly used for the text and the icons on the menu bar.
   * If `null` it defaults to the `ExistingTheme.DARK`'s value or the value of the theme that is modified.
   * @example // Defaults to:
   * null
   */
  primary?: Color;
  /**
   * The background color of the canvas.
   * If `null` it defaults to the `ExistingTheme.DARK`'s value or the value of the theme that is modified.
   * @example // Defaults to:
   * null
   */
  background?: Color;
  /**
   * The background color of the menu and accesory controls above the menu.
   * If `null` it defaults to the `ExistingTheme.DARK`'s value or the value of the theme that is modified.
   * @example // Defaults to:
   * null
   */
  menuBackground?: Color;
  /**
   * The background color of the toolbar that hosts the title of the active tool, the discard,
   * and the apply button.
   * If `null` it defaults to the `ExistingTheme.DARK`'s value or the value of the theme that is modified.
   * @example // Defaults to:
   * null
   */
  toolbarBackground?: Color;
}
