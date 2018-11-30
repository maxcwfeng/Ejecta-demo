var VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;

void main(){
gl_Position = a_Position;
v_TexCoord = a_TexCoord;
}`;



var FSHADER_SOURCE = `
precision mediump float;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;

void main(){
    //随便一个高亮滤镜
//    vec4 textureColor = texture2D(u_Sampler,v_TexCoord);
//    textureColor.rgb = (textureColor.rgb - 0.5) / (1.0 - 0.9) + 0.5;
//    gl_FragColor = textureColor;
    
    //随便一个黑白滤镜
    vec4 color = texture2D(u_Sampler, v_TexCoord);
    float gray = 0.2989*color.r+0.5870*color.g+0.1140*color.b;
    gl_FragColor = vec4(gray,gray,gray , color.a);

}`;



/*第二部分 main()方法 初始化着色器，设置顶点信息，调用配置纹理方法*/
main();
function main() {
    var canvas = document.getElementById("canvas");
    
    var gl = canvas.getContext('webgl');
    
    if(!gl){
        
        console.log("你的电脑不支持WebGL！");
        
        return;
        
    }
    
    initShaders(gl);
    
    
    
    //设置顶点的相关信息
    
    var n = initVertexBuffers(gl);
    
    
    
    if(n < 0){
        
        console.log("无法获取到点的数据");
        
        return;
        
    }
    
    
    
    //配置纹理
    
    if(!initTextures(gl,n)){
        
        console.log("无法配置纹理");
        
        return;
        
    }
    
    
    
}

function initShaders(gl)
{
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);// 创建顶点着色器
    gl.shaderSource(vertexShader, VSHADER_SOURCE);// 绑定顶点着色器源码
    gl.compileShader(vertexShader);// 编译定点着色器
    
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);// 创建片段着色器
    gl.shaderSource(fragmentShader, FSHADER_SOURCE);// 绑定片段着色器源码
    gl.compileShader(fragmentShader);// 编译片段着色器
    
    var shaderProgram = gl.createProgram();// 创建着色器程序
    gl.attachShader(shaderProgram, vertexShader);// 指定顶点着色器
    gl.attachShader(shaderProgram, fragmentShader);// 指定片段着色色器
    gl.linkProgram(shaderProgram);// 链接程序
    gl.useProgram(shaderProgram);//使用着色器
    
    gl.program = shaderProgram;
}



/*第三部分 initVertexBuffers() 设置顶点坐标和纹理坐标 调用initTextures()进行下一步处理*/

function initVertexBuffers(gl) {
    
    var verticesSizes = new Float32Array([
                                          
                                          //四个顶点的位置和纹理数据
                                          
                                          -0.5,0.5,0.0,1.0,
                                          
                                          -0.5,-0.5,0.0,0.0,
                                          
                                          0.5,0.5,1.0,1.0,
                                          
                                          0.5,-0.5,1.0,0.0
                                          
                                          ]);
    
    
    
    var n = 4;
    
    var vertexSizeBuffer = gl.createBuffer();
    
    if(!vertexSizeBuffer){
        
        console.log("无法创建缓冲区");
        
        return -1;
        
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexSizeBuffer);
    
    gl.bufferData(gl.ARRAY_BUFFER,verticesSizes,gl.STATIC_DRAW);
    
    var a_Position = gl.getAttribLocation(gl.program,"a_Position");
    
    if(a_Position < 0){
        
        console.log("无法获取到存储位置");
        
        return;
        
    }
    
    
    
    //获取数组一个值所占的字节数
    
    var fsize = verticesSizes.BYTES_PER_ELEMENT;
    
    
    
    //将顶点坐标的位置赋值
    
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,fsize*4,0);
    
    gl.enableVertexAttribArray(a_Position);
    
    
    
    //将顶点的纹理坐标分配给a_TexCoord并开启它
    
    var a_TexCoord = gl.getAttribLocation(gl.program,"a_TexCoord");
    
    if(a_TexCoord < 0){
        
        console.log("无法获取到存储位置");
        
        return;
        
    }
    
    
    
    //将纹理坐标赋值
    
    gl.vertexAttribPointer(a_TexCoord,2,gl.FLOAT,false,fsize*4,fsize*2);
    
    gl.enableVertexAttribArray(a_TexCoord);
    
    return n;
    
}



/*第四部分 initTextures() 创建纹理对象 并调用纹理绘制方法*/

function initTextures(gl,n) {
    
    var texture = gl.createTexture();//创建纹理对象
    
    if(!texture){
        
        console.log("无法创建纹理对象");
        
        return;
        
    }
    
    
    
    //获取u_Sampler的存储位置
    
    var u_Sampler = gl.getUniformLocation(gl.program,"u_Sampler");
    
    if(u_Sampler < 0){
        
        console.log("无法获取变量的存储位置");
        
        return;
        
    }
    
    
    
    //创建Image对象，并绑定加载完成事件
    
    var image = new Image();
    
    image.onload = function () {
        
        loadTexture(gl,n,texture,u_Sampler,image);
        
    };
    
    
    
    image.src = "1.png";
    
    return true;
    
}



/*第五部分 设置纹理相关信息供WebGL使用，并进行绘制*/

function loadTexture(gl,n,texture,u_Sampler,image) {
    
    //对纹理图像进行y轴反转
    
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
    
    //开启0号纹理单元
    
    gl.activeTexture(gl.TEXTURE0);
    
    //向target绑定纹理对象
    
    gl.bindTexture(gl.TEXTURE_2D,texture);
    
    //配置纹理参数
    
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    
    //配置纹理图像
    
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
    
    //将0号纹理传递给着色器
    
    gl.uniform1i(u_Sampler,0);
    
    
    
    //绘制
    
    gl.clearColor(1.0,0.0,0.0,1.0);
    
    
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    
    
    gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
    
}

