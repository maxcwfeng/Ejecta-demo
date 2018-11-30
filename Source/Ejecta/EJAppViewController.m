#import <objc/runtime.h>

#import "EJAppViewController.h"
#import "EJJavaScriptView.h"

@implementation EJAppViewController

- (id)initWithScriptAtPath:(NSString *)pathp {
	if( self = [super init] ) {
		path = [pathp retain];
	}
	return self;
}

- (void)dealloc {
	self.view = nil;
	[path release];
	[super dealloc];
}

- (void)loadView
{
    [super loadView];
    
	CGRect frame = UIScreen.mainScreen.bounds;
    EJJavaScriptView *view = [[EJJavaScriptView alloc] initWithFrame:frame appFolder:@"App_daeModel/"];
	[self.view addSubview:view];
    self.view.backgroundColor = [UIColor whiteColor];
	
	[view loadScriptAtPath:path];
	[view release];
    
    
//    CGRect frameEx = UIScreen.mainScreen.bounds;
//    frameEx.origin.y = frameEx.size.height / 2.0;
//    frameEx.size.height /= 2.0;
//    view = [[EJJavaScriptView alloc] initWithFrame:frameEx appFolder:@"App_3D/"];
//    [self.view addSubview:view];
//    
//    [view loadScriptAtPath:path];
//    [view release];
}

@end
