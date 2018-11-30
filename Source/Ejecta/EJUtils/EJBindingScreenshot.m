#import "EJBindingScreenshot.h"

@implementation EJBindingScreenshot

- (id)initWithContext:(JSContextRef)ctxp argc:(size_t)argc argv:(const JSValueRef [])argv {
    if( self = [super initWithContext:ctxp argc:argc argv:argv] ) {
    }
    return self;
}


EJ_BIND_FUNCTION(takeSreenshot, ctx, argc, argv ){
    // set the screen size, adjust for over scaled image
    NSInteger width = (gameWidth*2);
    NSInteger height = (gameHeight*2);

    NSInteger myDataLength = width * height * 4;

    // read the pixel data
    GLubyte *buffer = (GLubyte *) malloc(myDataLength);
    glReadPixels(0, 0, width, height, GL_RGBA, GL_UNSIGNED_BYTE, buffer);
    CGDataProviderRef provider = CGDataProviderCreateWithData(NULL, buffer, myDataLength, NULL);

    int bitsPerComponent = 8;
    int bitsPerPixel = 32;
    int bytesPerRow = 4 * width;
    CGColorSpaceRef colorSpaceRef = CGColorSpaceCreateDeviceRGB();
    CGBitmapInfo bitmapInfo = kCGBitmapByteOrderDefault;
    CGColorRenderingIntent renderingIntent = kCGRenderingIntentDefault;

    // create the image data from screen data
    CGImageRef imageRef = CGImageCreate(width, height, bitsPerComponent, bitsPerPixel, bytesPerRow, colorSpaceRef, bitmapInfo, provider, NULL, NO, renderingIntent);

    // make images and save to phone
    UIImage *myImage = [UIImage imageWithCGImage:imageRef];
    UIImageWriteToSavedPhotosAlbum(myImage, nil, nil, nil);
    
    NSLog(@"Took Screenshot");
    return NULL;
}

//fengchiwei 可以参考这里 js 从客户端 拿数据
EJ_BIND_GET( gameHeight, ctx ) {
    return JSValueMakeNumber( ctx, gameHeight );
}
EJ_BIND_GET( gameWidth, ctx ) {
    return JSValueMakeNumber( ctx, gameWidth );
}

//fengchiwei 可以参考这里 js 给客户端 设置数据
EJ_BIND_SET( gameHeight, ctx, value) {
    gameHeight = JSValueToNumberFast( ctx, value);
}
EJ_BIND_SET( gameWidth, ctx, value) {
    gameWidth = JSValueToNumberFast( ctx, value);
}


@end
