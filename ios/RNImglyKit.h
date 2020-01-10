#import "RNImgly.h"

#define RN_IMGLY_CONCATENATE(a,b) a ## b

#define RN_IMGLY_ImglyKit_HELPER(prefix) RN_IMGLY_CONCATENATE(prefix, ImglyKit)
#define RN_IMGLY_ImglyKit RN_IMGLY_ImglyKit_HELPER(RN_IMGLY)

@import Foundation;

@interface RN_IMGLY_ImglyKit : NSObject

@end
