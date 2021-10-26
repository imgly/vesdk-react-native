import {
    ConfigPlugin,
    withAppBuildGradle,
    withProjectBuildGradle,
    withMainApplication,
    withPlugins,
} from '@expo/config-plugins';

const withMultidexMainApplication: ConfigPlugin = (config) => {
    return withMainApplication(config, (config) => {
        config.modResults.contents = addMultidexMainApplication(
            config.modResults.contents
        );
        return config;
    });
};

function addMultidexMainApplication(contents: string): string {
    const pattern = 'class MainApplication extends Application';
    const replacement =
        'class MainApplication extends androidx.multidex.MultiDexApplication';
    if (contents.match(pattern)) {
        return contents.replace(pattern, replacement);
    }
    throw new Error(
        'Cannot setup VideoEditor: MainApplication does not extend Application'
    );
}

const withMultidexAppBuildGradle: ConfigPlugin = (config) => {
    return withAppBuildGradle(config, (config) => {
        config.modResults.contents = addMultidexAppBuildGradle(
            config.modResults.contents
        );
        return config;
    });
};

function addMultidexAppBuildGradle(contents: string): string {
    const addBottom = `
  android {
      defaultConfig {
          multiDexEnabled true
      }
  }
  dependencies {
      implementation 'androidx.multidex:multidex:2.0.1'
  }
  `;
    return contents.concat(addBottom);
}

const withImgLyProjectBuildGradle: ConfigPlugin<{ version: string }> = (
    config,
    { version }
) => {
    return withProjectBuildGradle(config, (config) => {
        config.modResults.contents = addImgLy(config.modResults.contents, version);
        return config;
    });
};

function addImgLy(contents: string, version: string) {
    const addTop = `
  buildscript {
      repositories {
          jcenter()
          maven { url "https://plugins.gradle.org/m2/" }
          maven { url "https://artifactory.img.ly/artifactory/imgly" }
      }
      dependencies {
          classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:1.4.10"
          classpath 'ly.img.android.sdk:plugin:${version}'
      }
  }
  `;
    return addTop.concat(contents);
}

const withVESDKConfig: ConfigPlugin = (config) => {
    return withAppBuildGradle(config, (config) => {
        config.modResults.contents = addVideoEditorSDKConfig(
            config.modResults.contents
        );
        return config;
    });
};

function addVideoEditorSDKConfig(contents: string) {
    const pattern = 'apply plugin: "com.android.application"';
    const addAfter = `
  apply plugin: 'ly.img.android.sdk'
  apply plugin: 'kotlin-android'
  
  // Comment out the modules you don't need, to save size.
  imglyConfig {
      modules {
          include 'ui:text'
          include 'ui:focus'
          include 'ui:frame'
          include 'ui:brush'
          include 'ui:filter'
          include 'ui:sticker'
          include 'ui:overlay'
          include 'ui:transform'
          include 'ui:adjustment'
          include 'ui:text-design'
          include 'ui:video-trim'
          include 'ui:video-library'
          include 'ui:video-composition'
          include 'ui:audio-composition'
  
          // This module is big, remove the serializer if you don't need that feature.
          include 'backend:serializer'
  
          // Remove the asset packs you don't need, these are also big in size.
          include 'assets:font-basic'
          include 'assets:frame-basic'
          include 'assets:filter-basic'
          include 'assets:overlay-basic'
          include 'assets:sticker-shapes'
          include 'assets:sticker-emoticons'
          include 'assets:sticker-animated'
  
          include 'backend:sticker-animated'
          include 'backend:sticker-smart'
      }
  }
  `;
    if (contents.match(pattern)) {
        return contents.replace(pattern, pattern + addAfter);
    }
    throw new Error(
        'Cannot setup VideoEditor: plugin "com.android.application" not found'
    );
}

const withReactNativeVideoEditorSDK: ConfigPlugin<{ imgLyVersion?: string }> = (
    config,
    { imgLyVersion = '8.3.1' } = {}
) => {
    return withPlugins(config, [
        withMultidexMainApplication,
        withMultidexAppBuildGradle,
        [withImgLyProjectBuildGradle, { version: imgLyVersion }],
        withVESDKConfig,
    ]);
};

export default withReactNativeVideoEditorSDK;
