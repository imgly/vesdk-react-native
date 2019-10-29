#import "RNVideoEditorSDK.h"
#import "RNImglyKitSubclass.h"

@import VideoEditorSDK;

@interface RNVideoEditorSDK () <PESDKVideoEditViewControllerDelegate>

@end

@implementation RNVideoEditorSDK

RCT_EXPORT_MODULE();

- (void)present:(nonnull PESDKVideo *)video withConfiguration:(nullable NSDictionary *)dictionary andSerialization:(nullable NSDictionary *)state
        resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject
{
  [self present:^PESDKMediaEditViewController * _Nullable(PESDKConfiguration * _Nonnull configuration, NSData * _Nullable serializationData) {

    PESDKPhotoEditModel *photoEditModel = [[PESDKPhotoEditModel alloc] init];

    if (serializationData != nil) {
      PESDKDeserializationResult *deserializationResult = [PESDKDeserializer deserializeWithData:serializationData imageDimensions:video.size];
      photoEditModel = deserializationResult.model ?: photoEditModel;
    }

    PESDKVideoEditViewController *videoEditViewController = [[PESDKVideoEditViewController alloc] initWithVideoAsset:video
                                                                                                       configuration:configuration
                                                                                                      photoEditModel:photoEditModel];
    videoEditViewController.modalPresentationStyle = UIModalPresentationFullScreen;
    videoEditViewController.delegate = self;
    return videoEditViewController;

  } withUTI:^CFStringRef _Nonnull(PESDKConfiguration * _Nonnull configuration) {

    return configuration.videoEditViewControllerOptions.videoContainerFormatUTI;

  } configuration:dictionary serialization:state resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(unlockWithLicenseURL:(nonnull NSURL *)url)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSError *error = nil;
    [VESDK unlockWithLicenseFromURL:url error:&error];
    [self handleLicenseError:error];
  });
}

RCT_EXPORT_METHOD(unlockWithLicenseString:(nonnull NSString *)string)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSError *error = nil;
    [VESDK unlockWithLicenseFromString:string error:&error];
    [self handleLicenseError:error];
  });
}

RCT_EXPORT_METHOD(unlockWithLicenseObject:(nonnull NSDictionary *)dictionary)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSError *error = nil;
    [VESDK unlockWithLicenseFromDictionary:dictionary error:&error];
    [self handleLicenseError:error];
  });
}

RCT_EXPORT_METHOD(unlockWithLicense:(nonnull id)json)
{
  [super unlockWithLicense:json];
}

RCT_EXPORT_METHOD(present:(nonnull NSURLRequest *)request
                  configuration:(nullable NSDictionary *)configuration
                  serialization:(nullable NSDictionary *)state
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  // TODO: Handle React Native URLs from camera roll.
  if (request.URL.isFileURL) {
    if (![[NSFileManager defaultManager] fileExistsAtPath:request.URL.path]) {
      reject(kErrorUnableToLoad, @"File does not exist", nil);
      return;
    }
  }
  PESDKVideo *video = [[PESDKVideo alloc] initWithURL:request.URL];
  [self present:video withConfiguration:configuration andSerialization:state resolve:resolve reject:reject];
}

#pragma mark - PESDKVideoEditViewControllerDelegate

- (void)videoEditViewController:(nonnull PESDKVideoEditViewController *)videoEditViewController didFinishWithVideoAtURL:(nullable NSURL *)url {
  NSError *error = nil;
  id serialization = nil;

  if (self.serializationEnabled)
  {
    NSData *serializationData = [videoEditViewController serializedSettings];
    if ([self.serializationType isEqualToString:kExportTypeFileURL]) {
      if ([serializationData imgly_writeToURL:self.serializationFile andCreateDirectoryIfNecessary:YES error:&error]) {
        serialization = self.serializationFile.absoluteString;
      }
    } else if ([self.serializationType isEqualToString:kExportTypeObject]) {
      serialization = [NSJSONSerialization JSONObjectWithData:serializationData options:kNilOptions error:&error];
    }
  }

  if (error == nil) {
    self.resolve(@{ @"video": (url != nil) ? url.absoluteString : [NSNull null],
                    @"hasChanges": @(videoEditViewController.hasChanges),
                    @"serialization": (serialization != nil) ? serialization : [NSNull null] });
  } else {
    self.reject(kErrorUnableToExport, [NSString imgly_string:@"Unable to export video or serialization." withError:error], error);
  }
  [self dismiss:videoEditViewController animated:YES];
}

- (void)videoEditViewControllerDidCancel:(nonnull PESDKVideoEditViewController *)videoEditViewController {
  [self dismiss:videoEditViewController animated:YES];
}

- (void)videoEditViewControllerDidFailToGenerateVideo:(nonnull PESDKVideoEditViewController *)videoEditViewController {
  self.reject(kErrorUnableToExport, @"Unable to generate video", nil);
  [self dismiss:videoEditViewController animated:YES];
}

@end
