#import <MobileCoreServices/MobileCoreServices.h>

#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTLog.h>
#import <React/RCTUtils.h>

#import "RNImgly.h"

#define RN_IMGLY_CONCATENATE(a,b) a ## b

#define RN_IMGLY_ImglyKit_HELPER(prefix) RN_IMGLY_CONCATENATE(prefix, ImglyKit)
#define RN_IMGLY_ImglyKit RN_IMGLY_ImglyKit_HELPER(RN_IMGLY)

#define RN_IMGLY_Constants_HELPER(prefix) RN_IMGLY_CONCATENATE(prefix, Constants)
#define RN_IMGLY_Constants RN_IMGLY_Constants_HELPER(RN_IMGLY)

#define RN_IMGLY_Category_HELPER(prefix) RN_IMGLY_CONCATENATE(prefix, Category)
#define RN_IMGLY_Category RN_IMGLY_Category_HELPER(RN_IMGLY)

#define RN_IMGLY_string_HELPER(prefix) RN_IMGLY_CONCATENATE(prefix, _string)
#define RN_IMGLY_string RN_IMGLY_string_HELPER(RN_IMGLY)

#define RN_IMGLY_writeToURL_HELPER(prefix) RN_IMGLY_CONCATENATE(prefix, _writeToURL)
#define RN_IMGLY_writeToURL RN_IMGLY_writeToURL_HELPER(RN_IMGLY)

#define RN_IMGLY_ExportURL_HELPER(prefix) RN_IMGLY_CONCATENATE(prefix, ExportURL)
#define RN_IMGLY_ExportURL RN_IMGLY_ExportURL_HELPER(RN_IMGLY)

#define RN_IMGLY_ExportFileURL_HELPER(prefix) RN_IMGLY_CONCATENATE(prefix, ExportFileURL)
#define RN_IMGLY_ExportFileURL RN_IMGLY_ExportFileURL_HELPER(RN_IMGLY)

#define RN_IMGLY_URLRequestArray_HELPER(prefix) RN_IMGLY_CONCATENATE(prefix, URLRequestArray)
#define RN_IMGLY_URLRequestArray RN_IMGLY_URLRequestArray_HELPER(RN_IMGLY)

#define RN_IMGLY_valueForKeyPath_HELPER(prefix) RN_IMGLY_CONCATENATE(prefix, _valueForKeyPath)
#define RN_IMGLY_valueForKeyPath RN_IMGLY_valueForKeyPath_HELPER(RN_IMGLY)

#define RN_IMGLY_dictionary_HELPER(prefix) RN_IMGLY_CONCATENATE(prefix, _dictionary)
#define RN_IMGLY_dictionary RN_IMGLY_dictionary_HELPER(RN_IMGLY)

@import ImglyKit;

@interface RN_IMGLY_ImglyKit ()

typedef void (^IMGLYConfigurationBlock)(PESDKConfigurationBuilder * _Nonnull builder);
typedef PESDKMediaEditViewController * _Nullable (^IMGLYMediaEditViewControllerBlock)(PESDKConfiguration * _Nonnull configuration, NSData * _Nullable serializationData);
typedef CFStringRef _Nonnull (^IMGLYUTIBlock)(PESDKConfiguration * _Nonnull configuration);
typedef void (^IMGLYCompletionBlock)(void);

@property (class, strong, atomic, nullable) IMGLYConfigurationBlock configureWithBuilder;

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
@property (atomic) BOOL exportVideoSegments;
@property (strong, atomic, nullable) NSString* uuid;

- (void)present:(nonnull IMGLYMediaEditViewControllerBlock)createMediaEditViewController withUTI:(nonnull IMGLYUTIBlock)getUTI
  configuration:(nullable NSDictionary *)dictionary serialization:(nullable NSDictionary *)state
        resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject;

- (void)dismiss:(nullable PESDKMediaEditViewController *)mediaEditViewController animated:(BOOL)animated completion:(nullable IMGLYCompletionBlock)completion;
- (void)handleLicenseError:(nullable NSError *)error;
- (void)unlockWithLicenseURL:(nonnull NSURL *)url;
- (void)unlockWithLicenseString:(nonnull NSString *)string;
- (void)unlockWithLicenseObject:(nonnull NSDictionary *)dictionary;
- (void)unlockWithLicense:(nonnull id)json;

extern const struct RN_IMGLY_Constants
{
  NSString * _Nonnull const kErrorUnableToUnlock;
  NSString * _Nonnull const kErrorUnableToLoad;
  NSString * _Nonnull const kErrorUnableToExport;

  NSString * _Nonnull const kExportTypeFileURL;
  NSString * _Nonnull const kExportTypeDataURL;
  NSString * _Nonnull const kExportTypeObject;
} RN_IMGLY;

@end

@interface NSString (RN_IMGLY_Category)

+ (nonnull NSString *)RN_IMGLY_string:(nonnull NSString *)message withError:(nullable NSError *)error;

@end

@interface NSData (RN_IMGLY_Category)

- (BOOL)RN_IMGLY_writeToURL:(nonnull NSURL *)fileURL andCreateDirectoryIfNecessary:(BOOL)createDirectory error:(NSError *_Nullable*_Nullable)error;

@end

@interface RCTConvert (RN_IMGLY_Category)

typedef NSURL RN_IMGLY_ExportURL;
typedef NSURL RN_IMGLY_ExportFileURL;
typedef NSArray<NSURLRequest *> RN_IMGLY_URLRequestArray;

+ (nullable RN_IMGLY_ExportURL *)RN_IMGLY_ExportURL:(nullable id)json;
+ (nullable RN_IMGLY_ExportFileURL *)RN_IMGLY_ExportFileURL:(nullable id)json withExpectedUTI:(nonnull CFStringRef)expectedUTI;
+ (nullable RN_IMGLY_URLRequestArray *)RN_IMGLY_URLRequestArray:(nullable id)json;

@end

@interface NSDictionary (RN_IMGLY_Category)

- (nullable id)RN_IMGLY_valueForKeyPath:(nonnull NSString *)keyPath default:(nullable id)defaultValue;
+ (nullable id)RN_IMGLY_dictionary:(nullable NSDictionary *)dictionary valueForKeyPath:(nonnull NSString *)keyPath default:(nullable id)defaultValue;

@end
