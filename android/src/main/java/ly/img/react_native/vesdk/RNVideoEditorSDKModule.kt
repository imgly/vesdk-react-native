package ly.img.react_native.vesdk

import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener
import ly.img.android.IMGLY
import ly.img.android.VESDK
import ly.img.android.pesdk.VideoEditorSettingsList
import ly.img.android.pesdk.backend.model.state.LoadSettings
import ly.img.android.pesdk.backend.model.state.SaveSettings
import ly.img.android.pesdk.backend.model.state.manager.SettingsList
import ly.img.android.pesdk.kotlin_extension.continueWithExceptions
import ly.img.android.pesdk.ui.activity.ImgLyIntent
import ly.img.android.pesdk.ui.activity.VideoEditorBuilder
import ly.img.android.pesdk.ui.utils.PermissionRequest
import ly.img.android.pesdk.utils.MainThreadRunnable
import ly.img.android.pesdk.utils.SequenceRunnable
import ly.img.android.pesdk.utils.UriHelper
import ly.img.android.sdk.config.*
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.io.File
import ly.img.android.pesdk.backend.encoder.Encoder
import ly.img.android.serializer._3.IMGLYFileReader
import ly.img.android.serializer._3.IMGLYFileWriter


class RNVideoEditorSDKModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), ActivityEventListener, PermissionListener {
    companion object {
        // This number must be unique. It is public to allow client code to change it if the same value is used elsewhere.
        var EDITOR_RESULT_ID = 29065
    }

    init {
        reactContext.addActivityEventListener(this)
    }

    private var currentSettingsList: VideoEditorSettingsList? = null
    private var currentPromise: Promise? = null
    private var currentConfig: Configuration? = null

    @ReactMethod
    fun unlockWithLicense(license: String) {
        VESDK.initSDKWithLicenseData(license)
        IMGLY.authorize()
    }

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, resultData: Intent?) {
        val data = resultData ?: return // If resultData is null the result is not from us.
        when (requestCode) {
            EDITOR_RESULT_ID -> {
                when (resultCode) {
                    Activity.RESULT_CANCELED -> {
                        currentPromise?.resolve(null)
                    }
                    Activity.RESULT_OK -> {
                        SequenceRunnable("Export Done") {
                            val sourcePath = data.getParcelableExtra<Uri>(ImgLyIntent.SOURCE_IMAGE_URI)
                            val resultPath = data.getParcelableExtra<Uri>(ImgLyIntent.RESULT_IMAGE_URI)

                            val serializationConfig = currentConfig?.export?.serialization
                            val settingsList = data.getParcelableExtra<SettingsList>(ImgLyIntent.SETTINGS_LIST)

                            val serialization: Any? = if (serializationConfig?.enabled == true) {
                                skipIfNotExists {
                                    settingsList.let { settingsList ->
                                        if (serializationConfig.embedSourceImage == true) {
                                            Log.i("ImgLySdk", "EmbedSourceImage is currently not supported by the Android SDK")
                                        }
                                        when (serializationConfig.exportType) {
                                            SerializationExportType.FILE_URL -> {
                                                 val uri = serializationConfig.filename?.let { 
                                                    Uri.parse(it)
                                                } ?: Uri.fromFile(File.createTempFile("serialization", ".json"))
                                                Encoder.createOutputStream(uri).use { outputStream -> 
                                                    IMGLYFileWriter(settingsList).writeJson(outputStream);
                                                }
                                                uri.toString()
                                            }
                                            SerializationExportType.OBJECT -> {
                                                ReactJSON.convertJsonToMap(
                                                  JSONObject(
                                                    IMGLYFileWriter(settingsList).writeJsonAsString()
                                                  )
                                                ) as Any?
                                            }
                                        }
                                    }
                                } ?: run {
                                    Log.i("ImgLySdk", "You need to include 'backend:serializer' Module, to use serialisation!")
                                    null
                                }
                            } else {
                                null
                            }

                            currentPromise?.resolve(
                              reactMap(
                                "video" to resultPath?.toString(),
                                "hasChanges" to (sourcePath?.path != resultPath?.path),
                                "serialization" to serialization
                              )
                            )
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

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
            val settingsList = VideoEditorSettingsList()

            currentSettingsList = settingsList
            currentConfig = ConfigLoader.readFrom(config?.toHashMap() ?: mapOf()).also {
                it.applyOn(settingsList)
            }
            currentPromise = promise


            settingsList.configure<LoadSettings> { loadSettings ->
                video.also {
                    if (it.startsWith("data:")) {
                        loadSettings.source = UriHelper.createFromBase64String(it.substringAfter("base64,"))
                    } else {
                        val potentialFile = continueWithExceptions { File(it) }
                        if (potentialFile?.exists() == true) {
                            loadSettings.source = Uri.fromFile(potentialFile)
                        } else {
                            loadSettings.source = ConfigLoader.parseUri(it)
                        }
                    }
                }
            }

            readSerialisation(settingsList, serialization, false)

            if (checkPermissions()) {
                startEditor(settingsList)
            }
        } else {
            promise.reject("VESDK", "The video editor is only available in Android 4.3 and later.")
        }
    }

    private fun checkPermissions(): Boolean {
        (currentActivity as? PermissionAwareActivity)?.also {
            var haveAllPermissions = true
            for (permission in PermissionRequest.NEEDED_EDITOR_PERMISSIONS) {
                if (it.checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED) {
                    haveAllPermissions = false
                }
            }
            if (!haveAllPermissions) {
                it.requestPermissions(PermissionRequest.NEEDED_EDITOR_PERMISSIONS, 0, this)
                return false
            }
        }

        return true
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
        if (settingsList != null) {
            (currentActivity as? PermissionAwareActivity)?.also {
                for (permission in PermissionRequest.NEEDED_EDITOR_PERMISSIONS) {
                    if (it.checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED) {
                        return
                    }
                }
            }
            MainThreadRunnable {
                VideoEditorBuilder(currentActivity)
                  .setSettingsList(settingsList)
                  .startActivityForResult(currentActivity, EDITOR_RESULT_ID)
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
                val value: Any = jsonObject.get(key)
                when (value) {
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
    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>?, grantResults: IntArray): Boolean {
        PermissionRequest.onRequestPermissionsResult(requestCode, permissions, grantResults)
        startEditor(currentSettingsList)
        return false
    }
}