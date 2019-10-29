#import <MobileCoreServices/MobileCoreServices.h>

#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTLog.h>
#import <React/RCTUtils.h>

@import ImglyKit;

@interface RNVESDKImglyKit ()

@property (strong, atomic, nullable) NSError* licenseError;
@property (strong, atomic, nullable) NSString* exportType;
@property (strong, atomic, nullable) NSURL* exportFile;
@property (atomic) BOOL serializationEnabled;
@property (strong, atomic, nullable) NSString* serializationType;
@property (strong, atomic, nullable) NSURL* serializationFile;
@property (atomic) BOOL serializationEmbedImage;
@property (strong, atomic, nullable) RCTPromiseResolveBlock resolve;
@property (strong, atomic, nullable) RCTPromiseRejectBlock reject;
@property (strong, atomic, nullable) PESDKMediaEditViewController* mediaEditViewController;

typedef PESDKMediaEditViewController * _Nullable (^PESDKMediaEditViewControllerBlock)(PESDKConfiguration * _Nonnull configuration, NSData * _Nullable serializationData);
typedef CFStringRef _Nonnull (^IMGLYUTIBlock)(PESDKConfiguration * _Nonnull configuration);

- (void)present:(nonnull PESDKMediaEditViewControllerBlock)mediaEditViewController withUTI:(nonnull IMGLYUTIBlock)uti
  configuration:(nullable NSDictionary *)dictionary serialization:(nullable NSDictionary *)state
        resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject;

- (void)dismiss:(nonnull PESDKMediaEditViewController *)mediaEditViewController animated:(BOOL)animated;
- (void)handleLicenseError:(nullable NSError *)error;
- (void)unlockWithLicenseURL:(nonnull NSURL *)url;
- (void)unlockWithLicenseString:(nonnull NSString *)string;
- (void)unlockWithLicenseObject:(nonnull NSDictionary *)dictionary;
- (void)unlockWithLicense:(nonnull id)json;

extern NSString * _Nonnull const kErrorUnableToUnlock;
extern NSString * _Nonnull const kErrorUnableToLoad;
extern NSString * _Nonnull const kErrorUnableToExport;

extern NSString * _Nonnull const kExportTypeFileURL;
extern NSString * _Nonnull const kExportTypeDataURL;
extern NSString * _Nonnull const kExportTypeObject;

@end

@interface NSString (IMGLYStringWithError)

+ (nonnull NSString *)imgly_string:(nonnull NSString *)message withError:(nullable NSError *)error;

@end

@interface NSData (IMGLYCreateDirectoryOnWrite)

- (BOOL)imgly_writeToURL:(nonnull NSURL *)fileURL andCreateDirectoryIfNecessary:(BOOL)createDirectory error:(NSError *_Nullable*_Nullable)error;

@end

@interface RCTConvert (IMGLYExportURLs)

typedef NSURL IMGLYExportURL;
typedef NSURL IMGLYExportFileURL;

+ (nullable IMGLYExportURL *)IMGLYExportURL:(nullable id)json;
+ (nullable IMGLYExportFileURL *)IMGLYExportFileURL:(nullable id)json withExpectedUTI:(nonnull CFStringRef)expectedUTI;

@end

@interface NSDictionary (IMGLYDefaultValueForKeyPath)

- (nullable id)imgly_valueForKeyPath:(nonnull NSString *)keyPath default:(nullable id)defaultValue;
+ (nullable id)imgly_dictionary:(nullable NSDictionary *)dictionary valueForKeyPath:(nonnull NSString *)keyPath default:(nullable id)defaultValue;

@end
