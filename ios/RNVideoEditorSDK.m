#import "RNVideoEditorSDK.h"
#import "RNImglyKit.h"
#import "RNImglyKitSubclass.h"
#import <AVFoundation/AVFoundation.h>

@interface RNVideoEditorSDK () <PESDKVideoEditViewControllerDelegate>

@end

@implementation RNVideoEditorSDK

RCT_EXPORT_MODULE();

+ (RNVESDKConfigurationBlock)configureWithBuilder {
  return RN_IMGLY_ImglyKit.configureWithBuilder;
}

+ (void)setConfigureWithBuilder:(RNVESDKConfigurationBlock)configurationBlock {
  RN_IMGLY_ImglyKit.configureWithBuilder = configurationBlock;
}

static RNVESDKWillPresentBlock _willPresentVideoEditViewController = nil;

+ (RNVESDKWillPresentBlock)willPresentVideoEditViewController {
  return _willPresentVideoEditViewController;
}

+ (void)setWillPresentVideoEditViewController:(RNVESDKWillPresentBlock)willPresentBlock {
  _willPresentVideoEditViewController = willPresentBlock;
}

- (void)handleError:(nonnull PESDKVideoEditViewController *)videoEditViewController code:(nullable NSString *)code message:(nullable NSString *)message error:(nullable NSError *)error {
  RCTPromiseRejectBlock reject = self.reject;
  [self dismiss:videoEditViewController animated:YES completion:^{
    reject(code, message, error);
  }];
}

- (void)present:(nonnull PESDKVideo *)video withConfiguration:(nullable NSDictionary *)dictionary andSerialization:(nullable NSDictionary *)state
        resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject
{
  [self present:^PESDKMediaEditViewController * _Nullable(PESDKConfiguration * _Nonnull configuration, NSData * _Nullable serializationData) {
    self.uuid = [[NSUUID new] UUIDString];

    PESDKPhotoEditModel *photoEditModel = [[PESDKPhotoEditModel alloc] init];

    if (serializationData != nil) {
      PESDKDeserializationResult *deserializationResult = [PESDKDeserializer deserializeWithData:serializationData imageDimensions:video.size assetCatalog:configuration.assetCatalog];
      photoEditModel = deserializationResult.model ?: photoEditModel;
    }

    PESDKVideoEditViewController *videoEditViewController = [PESDKVideoEditViewController videoEditViewControllerWithVideoAsset:video configuration:configuration photoEditModel:photoEditModel];
    videoEditViewController.modalPresentationStyle = UIModalPresentationFullScreen;
    videoEditViewController.delegate = self;
    RNVESDKWillPresentBlock willPresentVideoEditViewController = RNVideoEditorSDK.willPresentVideoEditViewController;
    if (willPresentVideoEditViewController != nil) {
      willPresentVideoEditViewController(videoEditViewController);
    }
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
  if (![self isValidURL:request.URL]) {
    reject(RN_IMGLY.kErrorUnableToLoad, @"File does not exist", nil);
    return;
  }
  PESDKVideo *video = [[PESDKVideo alloc] initWithURL:request.URL];
  [self present:video withConfiguration:configuration andSerialization:state resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(presentVideoSegments:(nonnull NSArray<NSDictionary *> *)requests
                  configuration:(nullable NSDictionary *)configuration
                  serialization:(nullable NSDictionary *)state
                  videoSize:(CGSize)videoSize
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [self openEditorFromVideos:requests videoSize:videoSize configuration:configuration serialization:state resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(presentComposition:(nonnull RN_IMGLY_URLRequestArray *)requests
                  configuration:(nullable NSDictionary *)configuration
                  serialization:(nullable NSDictionary *)state
                  videoSize:(CGSize)videoSize
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [self openEditorFromVideos:requests videoSize:videoSize configuration:configuration serialization:state resolve:resolve reject:reject];
}

- (void)openEditorFromVideos:(nonnull NSArray *)videos videoSize:(CGSize)videoSize configuration:(nullable NSDictionary *)configuration serialization:(nullable NSDictionary *)state resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock) reject
{
  NSMutableArray<PESDKVideoSegment *> *segments = [NSMutableArray<PESDKVideoSegment *> new];

  for (id video in videos) {
    if ([video isKindOfClass:[NSURLRequest class]]) {
      NSURLRequest *request = video;
      if (![self isValidURL:request.URL]) {
        reject(RN_IMGLY.kErrorUnableToLoad, @"File does not exist", nil);
        return;
      }
      PESDKVideoSegment *videoSegment = [[PESDKVideoSegment alloc] initWithURL:request.URL];
      [segments addObject: videoSegment];
    } else {
      NSURLRequest *request = [RCTConvert NSURLRequest:video];
      if (request == nil) {
        // Segment.
        NSURLRequest *segmentRequest = [RCTConvert NSURLRequest:[video valueForKey:@"videoURI"]];
        NSNumber *startTime;
        NSNumber *endTime;

        id start = [video valueForKey:@"startTime"];
        id end = [video valueForKey:@"endTime"];

        if (![start isKindOfClass:[NSNull class]]) {
          startTime = [RCTConvert NSNumber:start];
        }
        if (![end isKindOfClass:[NSNull class]]) {
          endTime = [RCTConvert NSNumber:end];
        }

        if (![self isValidURL:segmentRequest.URL]) {
          reject(RN_IMGLY.kErrorUnableToLoad, @"File does not exist", nil);
          return;
        }
        PESDKVideoSegment *videoSegment = [[PESDKVideoSegment alloc] initWithURL:segmentRequest.URL startTime:startTime endTime:endTime];
        [segments addObject: videoSegment];
      } else {
        if (![self isValidURL:request.URL]) {
          reject(RN_IMGLY.kErrorUnableToLoad, @"File does not exist", nil);
          return;
        }
        PESDKVideoSegment *videoSegment = [[PESDKVideoSegment alloc] initWithURL:request.URL];
        [segments addObject: videoSegment];
      }
    }
  }

  PESDKVideo *video;

  if (CGSizeEqualToSize(videoSize, CGSizeZero)) {
    if (segments.count == 0) {
      RCTLogError(@"A video without assets must have a specific size.");
      reject(RN_IMGLY.kErrorUnableToLoad, @"The editor requires a valid size when initialized without a video.", nil);
      return;
    }
    video = [[PESDKVideo alloc] initWithSegments:segments];
  } else {
    if (videoSize.height <= 0 || videoSize.width <= 0) {
      RCTLogError(@"Invalid video size: width and height must be greater than zero");
      reject(RN_IMGLY.kErrorUnableToLoad, @"Invalid video size: width and height must be greater than zero", nil);
      return;
    }
    if (segments.count == 0) {
      video = [[PESDKVideo alloc] initWithSize:videoSize];
    }
    video = [[PESDKVideo alloc] initWithSegments:segments size:videoSize];
  }

  [self present:video withConfiguration:configuration andSerialization:state resolve:resolve reject:reject];
}

- (BOOL)isValidURL:(nonnull NSURL*)url {
  if (url.isFileURL) {
    if (![[NSFileManager defaultManager] fileExistsAtPath:url.path]) {
      return false;
    }
  }
  return true;
}

- (NSArray<NSDictionary *> *)serializeVideoSegments:(nonnull NSArray<PESDKVideoSegment *> *)segments {
  NSMutableArray<NSDictionary *> *videoSegments = [NSMutableArray<NSDictionary *> new];
  for (PESDKVideoSegment *segment in segments) {
    NSDictionary *videoSegment = @{
      @"videoURI": segment.url.absoluteString,
      @"startTime": (segment.startTime != nil) ? segment.startTime : [NSNull null],
      @"endTime": (segment.endTime != nil) ? segment.endTime : [NSNull null]
    };
    [videoSegments addObject: videoSegment];
  }
  return [videoSegments copy];
}

#pragma mark - PESDKVideoEditViewControllerDelegate

- (void)videoEditViewControllerDidFinish:(nonnull PESDKVideoEditViewController *)videoEditViewController result:(nonnull PESDKVideoEditorResult *)result {
  NSError *error = nil;
  id serialization = nil;

  if (self.serializationEnabled)
  {
    NSData *serializationData = [videoEditViewController serializedSettings];
    if ([self.serializationType isEqualToString:RN_IMGLY.kExportTypeFileURL]) {
      if ([serializationData RN_IMGLY_writeToURL:self.serializationFile andCreateDirectoryIfNecessary:YES error:&error]) {
        serialization = self.serializationFile.absoluteString;
      }
    } else if ([self.serializationType isEqualToString:RN_IMGLY.kExportTypeObject]) {
      serialization = [NSJSONSerialization JSONObjectWithData:serializationData options:kNilOptions error:&error];
    }
  }

  if (error == nil) {
    RCTPromiseResolveBlock resolve = self.resolve;
    NSArray<NSDictionary *> *segments;

    if (self.exportVideoSegments) {
      segments = [self serializeVideoSegments:result.task.video.segments];
    }

    [self dismiss:videoEditViewController animated:YES completion:^{
      resolve(@{ @"video": (result.output.url != nil) ? result.output.url.absoluteString : [NSNull null],
                 @"hasChanges": @(result.status == VESDKVideoEditorStatusRenderedWithChanges),
                 @"serialization": (serialization != nil) ? serialization : [NSNull null],
                 @"segments": (segments != nil) ? segments : [NSNull null],
                 @"videoSize": @{@"height": @(result.task.video.size.height), @"width": @(result.task.video.size.height)},
                 @"identifier": self.uuid
              });
    }];
  } else {
    [self handleError:videoEditViewController code:RN_IMGLY.kErrorUnableToExport message:[NSString RN_IMGLY_string:@"Unable to export video or serialization." withError:error] error:error];
  }
}

- (void)videoEditViewControllerDidCancel:(nonnull PESDKVideoEditViewController *)videoEditViewController {
  RCTPromiseResolveBlock resolve = self.resolve;
  [self dismiss:videoEditViewController animated:YES completion:^{
    resolve([NSNull null]);
  }];
}

- (void)videoEditViewControllerDidFail:(nonnull PESDKVideoEditViewController *)videoEditViewController error:(PESDKVideoEditorError *)error {
  [self handleError:videoEditViewController code:RN_IMGLY.kErrorUnableToExport message:@"Unable to generate video" error:error];
}

@end
