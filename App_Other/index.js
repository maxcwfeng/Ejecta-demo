/*

	INSTRUCTIONS:
	This file must be copied into ./App in order to work

*/
var w = window.innerWidth;
var h = window.innerHeight;
var scale = window.devicePixelRatio;
var w2 = w/2;
var h2 = h/2;

var canvas = document.getElementById('canvas');
canvas.width = w * scale;
canvas.height = h * scale;
canvas.style.width = w;
canvas.style.height = h;

var ctx = canvas.getContext('2d');
ctx.scale(scale, scale);

ctx.strokeStyle = 'red';
ctx.lineWidth = 5;
ctx.fillStyle = '#000000';
ctx.fillRect( 0, 0, w, h );

var internal = 0;//初始化间隔
var internal_Max = 60; //最大间隔
var rotation_angle = 360.0/internal_Max;//旋转角度
var internal_time = 1000;//事件间隔(毫秒)
var timer = null;

init();
function init() {
	// Clear the screen - note that .globalAlpha is still honored,
	// so this will only "darken" the sceen a bit

    
// 绘制直线
    ctx.beginPath();
    // 起点
    ctx.moveTo(100, 100);
    // 终点
    ctx.lineTo(200, 200);
    ctx.closePath();
    ctx.stroke();
    ctx.closePath();

// 绘制本地图片
    var tempImg = new Ejecta.Image();
    tempImg.src = 'demo.png';
    tempImg.onload = function() {
        ctx.drawImage(tempImg, 0, h / 2.0, w, h);
    }

//简单动画
    startWindmill();
    upSpeed();
};

//开始风车
function startWindmill(){
    //转动风车
    function rotateWindmill(){
        internal++;
        if(internal>internal_Max){
            internal=0;
        };
        drawWindmill();
        timer = setTimeout(rotateWindmill, internal_time);
    };
    rotateWindmill();
};
//停止风车
function stopWindmill(){
    clearInterval(timer);
};
//加速风车
function upSpeed(){
    internal_time *= 0.01;
};
//减速风车
function downSpeed(){
    internal_time*=1.5;
};

//绘制风车
function drawWindmill(){
    var now = new Date();
    ctx.save();
    ctx.clearRect(0,0,300,300);
    
    ctx.fillStyle = "black";
    var circle_x = w/2.0;
    var circle_y = h / 2.0;
    
    //绘制旗杆
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    var line_start_x =  circle_x;
    var line_start_y = circle_y;
    var line_end_x = circle_x;
    var line_end_y = h / 6.0;
    ctx.moveTo(line_start_x,line_start_y);
    ctx.lineTo(line_end_x,line_end_y);
    ctx.stroke();
    
    //绘制扇叶
    ctx.strokeStyle = "green";
    var sy_length = h/8.0;
    ctx.save();
    ctx.translate(line_end_x,line_end_y);
    ctx.rotate(internal*rotation_angle);
    for(var i = 1;i<=3;i++){
        ctx.rotate(Math.PI*2/3);
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(50,0);
        ctx.stroke();
    };
    
    ctx.restore();
    ctx.restore();
};

document.addEventListener('touchend', function (ev) {
                          
                          var imagePicker = new Ejecta.ImagePicker();
                          
                          // all options are optional
                          var options = {
                          sourceType     : 'PhotoLibrary',              // 'PhotoLibrary' or 'SavedPhotosAlbum' (or experimental 'Camera')
                          
                          popupX         : ev.changedTouches[0].pageX,  // Popup position, relevant only on iPad when sourceType is not Camera,
                          popupY         : ev.changedTouches[0].pageY,  // best value is the tap coordinates or the center of the tapped element
                          
                          maxWidth       : w,                           // Max image size (resolution), by default it's GL ES max texture size
                          maxHeight      : h                            // ..
                          };
                          
                          imagePicker.getPicture(function (error, image) {
                                                 if (error) {
                                                    return console.log('Loading failed: ' + error);
                                                 }
                                                    ctx.drawImage(image, 0, 0, w, h);
                                                    //测试截屏
                                                    var Screenshot = new Ejecta.Screenshot();
                                                    Screenshot.gameHeight = 320;
                                                    Screenshot.gameWidth = 564;
                                                    Screenshot.takeSreenshot();
                                                 }, options);
                          
                          }, false);


