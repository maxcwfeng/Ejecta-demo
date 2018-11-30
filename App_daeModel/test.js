var container;
var camera, scene, renderer;
var modelObj;

function main(){
    
    ejecta.log("11111111111111111111111111111111");
    
    init();
    load3DModel();
    render();
}
main();

/**
* 初始化相机、场景、渲染器和光线，和其它例子是一样的，无需特别设置。
*/
function init() {
    
    ejecta.log("initinitinitinitinitinitinit");
    
    container = document.body;
    camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( -5, -5, 5 );
    camera.up.set( 0, 0, 1 );
    scene = new THREE.Scene();
    var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
    if(!light)
    {
        ejecta.log("lightlightlightlightlightlightlightlightlight");
    }
    light.position.set( 0, -4, -4 ).normalize();
    scene.add( light );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    
    if(!renderer)
    {
        ejecta.log("renderer 错");
    }
    renderer.setClearColor( 0xfff4e5 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
}

/**
* 加载3D模型，所有加载的代码在这里
*/
function load3DModel(){
    
    ejecta.log("load3DModelload3DModelload3DModelload3DModelload3DModel");
    /*****************************************************************
     * 1、collada是一种基于XML的3D模型交互方案，简单来说，就是一种3D模型可以通过collada转换成另一种3D模型，
     * 从而，各种3D模型都可以通过collada转换成web支持的3D模型。
     * 2、。dae是一个钟3D模型的格式
     * 3、加载时注意浏览器同源策略的限制
     *****************************************************************/
    var loader = new THREE.ColladaLoader();
    if(!loader)
    {
      ejecta.log("aaaaaaaaaaaa");
    }
    
    ejecta.log("kkkkkkk");
    loader.load( "./model/avatar.dae", function ( collada ) {
          //找到模型中需要的对象。将相机看向这个对象是为了让这个对象显示在屏幕中心
                
          ejecta.log("bbbbbbbbbbbbbb");
          collada.scene.traverse( function ( child ) {
            if ( child instanceof THREE.SkinnedMesh ) {
              ejecta.log("ccccccccccccccc");
              modelObj = child;
              camera.lookAt( child.position );
            }
          } );
          //将模型的场景加入到整体的场景
          modelObj.material.opacity = 0.8;
          scene.add( collada.scene );

          //显示出模型的骨骼的代码
          var helper = new THREE.SkeletonHelper( modelObj );
          helper.material.linewidth = 3;
          scene.add( helper );
    }, function ( collada ) {
            ejecta.log("eeeeeeeeeeeeeeeeee");
    }, function ( dic) {
      ejecta.log("ddddddddddddddddddddd");
    });
    
    ejecta.log("ffffffffffffff");
}

/**
* 渲染
*/
function render() {
    /*******************************************
        *由于加载3D模型是异步的，所以要把render函数放在requestAnimationFrame循环里，
        * 这样，当模型加载完成后，才能渲染出来
    ******************************************/
    requestAnimationFrame( render, renderer.domElement );
    if(modelObj){
        modelObj.rotation.z += 0.01;
        
        ejecta.log("ggggggggg");
    }
    renderer.render( scene, camera );
}

