package ly.img.react_native.vesdk

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.util.Log
import com.facebook.react.bridge.*
import ly.img.android.IMGLY
import ly.img.android.VESDK
import ly.img.android.pesdk.VideoEditorSettingsList
import ly.img.android.pesdk.backend.model.state.LoadSettings
import ly.img.android.pesdk.backend.model.state.manager.SettingsList
import ly.img.android.pesdk.kotlin_extension.continueWithExceptions
import ly.img.android.pesdk.ui.activity.VideoEditorBuilder
import ly.img.android.pesdk.utils.MainThreadRunnable
import ly.img.android.pesdk.utils.SequenceRunnable
import ly.img.android.pesdk.utils.UriHelper
import ly.img.android.sdk.config.*
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.io.File
import ly.img.android.pesdk.backend.encoder.Encoder
import ly.img.android.pesdk.backend.model.EditorSDKResult
import ly.img.android.pesdk.backend.model.VideoPart
import ly.img.android.pesdk.backend.model.state.LoadState
import ly.img.android.pesdk.backend.model.state.VideoCompositionSettings
import ly.img.android.serializer._3.IMGLYFileReader
import ly.img.android.serializer._3.IMGLYFileWriter
import java.util.UUID

class RNVideoEditorSDKModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), ActivityEventListener {
    companion object {
        // This number must be unique. It is public to allow client code to change it if the same value is used elsewhere.
        var EDITOR_RESULT_ID = 29065
    }

    init {
        reactContext.addActivityEventListener(this)
    }

    private var currentPromise: Promise? = null
    private var currentConfig: Configuration? = null
    private var resolveManually: Boolean = false
    private var currentEditorUID: String = UUID.randomUUID().toString()
    private var settingsLists: MutableMap<String, SettingsList> = mutableMapOf()

    @ReactMethod
    fun unlockWithLicense(license: String) {
        VESDK.initSDKWithLicenseData(license)
        IMGLY.authorize()
    }

    @ReactMethod
    fun releaseTemporaryData(identifier: String) {
        val settingsList = settingsLists[identifier]
        if (settingsList != null) {
            settingsList.release()
            settingsLists.remove(identifier)
        }
    }

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, intent: Intent?) {
        val data = try {
          intent?.let { EditorSDKResult(it) }
        } catch (e: EditorSDKResult.NotAnImglyResultException) {
          null
        } ?: return // If data is null the result is not from us.

        when (requestCode) {
            EDITOR_RESULT_ID -> {
                when (resultCode) {
                    Activity.RESULT_CANCELED -> {
                        currentPromise?.resolve(null)
                    }
                    Activity.RESULT_OK -> {
                        SequenceRunnable("Export Done") {
                            val sourcePath = data.sourceUri
                            val resultPath = data.resultUri

                            val serializationConfig = currentConfig?.export?.serialization

                            var serialization: Any? = null
                            val settingsList = data.settingsList

                            if (serializationConfig?.enabled == true) {
                                skipIfNotExists {
                                    settingsList.let { settingsList ->
                                        if (serializationConfig.embedSourceImage == true) {
                                            Log.i(
                                                "ImgLySdk",
                                                "EmbedSourceImage is currently not supported by the Android SDK"
                                            )
                                        }
                                        serialization = when (serializationConfig.exportType) {
                                            SerializationExportType.FILE_URL -> {
                                                val uri = serializationConfig.filename?.let {
                                                    Uri.parse("$it.json")
                                                } ?: Uri.fromFile(
                                                    File.createTempFile(
                                                        "serialization-" + UUID.randomUUID()
                                                            .toString(), ".json"
                                                    )
                                                )
                                                Encoder.createOutputStream(uri)
                                                    .use { outputStream ->
                                                        IMGLYFileWriter(settingsList).writeJson(
                                                            outputStream
                                                        )
                                                    }
                                                uri.toString()
                                            }
                                            SerializationExportType.OBJECT -> {
                                                ReactJSON.convertJsonToMap(
                                                    JSONObject(
                                                        IMGLYFileWriter(settingsList).writeJsonAsString()
                                                    )
                                                )
                                            }
                                        }
                                    }
                                } ?: run {
                                    Log.i(
                                        "ImgLySdk",
                                        "You need to include 'backend:serializer' Module, to use serialisation!"
                                    )
                                }
                            }

                            var segments: ReadableArray? = null
                            val canvasSize = settingsList[LoadState::class].sourceSize
                            val serializedSize = reactMap(
                                "height" to canvasSize.height,
                                "width" to canvasSize.width
                            )

                            if (resolveManually) {
                                settingsLists[currentEditorUID] = settingsList
                                segments = serializeVideoSegments(settingsList)
                            }

                            currentPromise?.resolve(
                                reactMap(
                                    "video" to resultPath?.toString(),
                                    "hasChanges" to (sourcePath?.path != resultPath?.path),
                                    "serialization" to serialization,
                                    "segments" to segments,
                                    "identifier" to currentEditorUID,
                                    "videoSize" to serializedSize
                                )
                            )
                            if (!resolveManually) {
                                settingsList.release()
                            }
                            resolveManually = false
                        }()
                    }
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent?) {
    }

    @ReactMethod
    fun present(video: String, config: ReadableMap?, serialization: String?, promise: Promise) {
        val configuration = ConfigLoader.readFrom(config?.toHashMap() ?: mapOf())
        val exportVideoSegments = config?.getMap("export")?.getMap("video")?.getBoolean("segments") == true
        val createTemporaryFiles = configuration.export?.serialization?.enabled == true || exportVideoSegments
        resolveManually = exportVideoSegments

        val settingsList = VideoEditorSettingsList(createTemporaryFiles)
        configuration.applyOn(settingsList)
        currentConfig = configuration
        currentPromise = promise

        settingsList.configure<LoadSettings> { loadSettings ->
            loadSettings.source = retrieveURI(video)
        }

        readSerialisation(settingsList, serialization, false)
        startEditor(settingsList)
    }

    @ReactMethod
    fun presentComposition(videos: ReadableArray, config: ReadableMap?, serialization: String?, size: ReadableMap?, promise: Promise) {
        val videoArray = deserializeVideoParts(videos)
        var source = resolveSize(size)

        val configuration = ConfigLoader.readFrom(config?.toHashMap() ?: mapOf())

        val exportVideoSegments = config?.getMap("export")?.getMap("video")?.getBoolean("segments") == true
        val createTemporaryFiles = configuration.export?.serialization?.enabled == true || exportVideoSegments
        resolveManually = exportVideoSegments

        val settingsList = VideoEditorSettingsList(createTemporaryFiles)
        configuration.applyOn(settingsList)
        currentConfig = configuration
        currentPromise = promise

        if (videoArray.isNotEmpty()) {
            if (source == null) {
                if (size != null) {
                    promise.reject("VESDK", "Invalid video size: width and height must be greater than zero.")
                    return
                }
                val video = videoArray.first()
                source = video.videoSource.getSourceAsUri()
            }

            settingsList.configure<VideoCompositionSettings> { loadSettings ->
                videoArray.forEach {
                    loadSettings.addCompositionPart(it)
                }
            }
        } else {
            if (source == null) {
                promise.reject("VESDK", "The editor requires a valid size when initialized without a video.")
                return
            }
        }

        settingsList.configure<LoadSettings> {
            it.source = source
        }

        readSerialisation(settingsList, serialization, false)
        startEditor(settingsList)
    }

    private fun serializeVideoSegments(settingsList: SettingsList): ReadableArray {
        val compositionParts = WritableNativeArray()
        settingsList[VideoCompositionSettings::class].videos.forEach {
            val source = it.videoSource.getSourceAsUri().toString()
            val trimStart = it.trimStartInNano / 1000000000.0f
            val trimEnd = it.trimEndInNano / 1000000000.0f

            val videoPart = reactMap(
                "videoURI" to source,
                "startTime" to trimStart.toDouble(),
                "endTime" to trimEnd.toDouble()
            )
            compositionParts.pushMap(videoPart)
        }
        return compositionParts
    }

    private fun deserializeVideoParts(videos: ReadableArray) : List<VideoPart> {
        val parts = emptyList<VideoPart>().toMutableList()

        videos.toArrayList().forEach {
            if (it is String) {
                val videoPart = VideoPart(retrieveURI(it))
                parts.add(videoPart)
            } else if (it is Map<*, *>) {
                val uri = it["videoURI"] as String?
                val trimStart = it["startTime"] as Double?
                val trimEnd = it["endTime"] as Double?

                if (uri != null) {
                    val videoPart = VideoPart(retrieveURI(uri))
                    if (trimStart != null) {
                        videoPart.trimStartInNanoseconds = (trimStart * 1000000000.0f).toLong()
                    }
                    if (trimEnd != null) {
                        videoPart.trimEndInNanoseconds = (trimEnd * 1000000000.0f).toLong()
                    }
                    parts.add(videoPart)
                }
            }
        }
        return parts
    }

    private fun retrieveURI(source: String) : Uri {
        return if (source.startsWith("data:")) {
            UriHelper.createFromBase64String(source.substringAfter("base64,"))
        } else {
            val potentialFile = continueWithExceptions { File(source) }
            if (potentialFile?.exists() == true) {
                Uri.fromFile(potentialFile)
            } else {
                ConfigLoader.parseUri(source)
            }
        }
    }

    private fun resolveSize(size: ReadableMap?) : Uri? {
        val sizeMap = size?.toHashMap()
        val height = sizeMap?.get("height") as? Double ?: 0.0
        val width = sizeMap?.get("width") as? Double ?: 0.0
        if (height == 0.0 || width == 0.0) {
            return null
        }
        return LoadSettings.compositionSource(width.toInt(), height.toInt(), 60)
    }

    private fun readSerialisation(settingsList: SettingsList, serialization: String?, readImage: Boolean) {
        if (serialization != null) {
            skipIfNotExists {
                IMGLYFileReader(settingsList).also {
                    it.readJson(serialization, readImage)
                }
            }
        }
    }

    private fun startEditor(settingsList: VideoEditorSettingsList?) {
        val currentActivity = this.currentActivity ?: throw RuntimeException("Can't start the Editor because there is no current activity")
        currentEditorUID = UUID.randomUUID().toString()
        if (settingsList != null) {
            MainThreadRunnable {
                VideoEditorBuilder(currentActivity)
                  .setSettingsList(settingsList)
                  .startActivityForResult(currentActivity, EDITOR_RESULT_ID)
                settingsList.release()
            }()
        }
    }

    operator fun WritableMap.set(id: String, value: Boolean) = this.putBoolean(id, value)
    operator fun WritableMap.set(id: String, value: String?) = this.putString(id, value)
    operator fun WritableMap.set(id: String, value: Double) = this.putDouble(id, value)
    operator fun WritableMap.set(id: String, value: Float) = this.putDouble(id, value.toDouble())
    operator fun WritableMap.set(id: String, value: WritableArray?) = this.putArray(id, value)
    operator fun WritableMap.set(id: String, value: Int) = this.putInt(id, value)
    operator fun WritableMap.set(id: String, value: WritableMap?) = this.putMap(id, value)

    fun reactMap(vararg pairs: Pair<String, Any?>): WritableMap {
        val map = Arguments.createMap()

        for (pair in pairs) {
            val id = pair.first
            when (val value = pair.second) {
                is String? -> map[id] = value
                is Boolean -> map[id] = value
                is Double -> map[id] = value
                is Float -> map[id] = value
                is Int -> map[id] = value
                is WritableMap? -> map[id] = value
                is WritableArray? -> map[id] = value
                else -> if (value == null) {
                    map.putNull(id)
                } else {
                    throw RuntimeException("Type not supported by WritableMap")
                }
            }
        }

        return map
    }


    object ReactJSON {
        @Throws(JSONException::class) fun convertJsonToMap(jsonObject: JSONObject): WritableMap? {
            val map: WritableMap = WritableNativeMap()
            val iterator: Iterator<String> = jsonObject.keys()
            while (iterator.hasNext()) {
                val key = iterator.next()
                when (val value: Any = jsonObject.get(key)) {
                    is JSONObject -> {
                        map.putMap(key, convertJsonToMap(value))
                    }
                    is JSONArray -> {
                        map.putArray(key, convertJsonToArray(value))
                    }
                    is Boolean -> {
                        map.putBoolean(key, value)
                    }
                    is Int -> {
                        map.putInt(key, value)
                    }
                    is Double -> {
                        map.putDouble(key, value)
                    }
                    is String -> {
                        map.putString(key, value)
                    }
                    else -> {
                        map.putString(key, value.toString())
                    }
                }
            }
            return map
        }

        @Throws(JSONException::class) fun convertJsonToArray(jsonArray: JSONArray): WritableArray? {
            val array: WritableArray = WritableNativeArray()
            for (i in 0 until jsonArray.length()) {
                when (val value: Any = jsonArray.get(i)) {
                    is JSONObject -> {
                        array.pushMap(convertJsonToMap(value))
                    }
                    is JSONArray -> {
                        array.pushArray(convertJsonToArray(value))
                    }
                    is Boolean -> {
                        array.pushBoolean(value)
                    }
                    is Int -> {
                        array.pushInt(value)
                    }
                    is Double -> {
                        array.pushDouble(value)
                    }
                    is String -> {
                        array.pushString(value)
                    }
                    else -> {
                        array.pushString(value.toString())
                    }
                }
            }
            return array
        }
    }

    override fun getName() = "RNVideoEditorSDK"
}