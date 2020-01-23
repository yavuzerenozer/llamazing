var scene,
  camera,fakeCamera,cameraOffset,
  controls,controlsLock,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  shadowLight,
  backLight,
  light,
  renderer,
  pointFiled,
  container;
var instructionField2=document.getElementById('instructions2');
var moveSpeed = 1;
var point = 0;
var isFlatShading = true;
var mousedown = false;
var collidableMeshList = [];
var applelist = [];
var INTERSECTED;
var trees;
var arrowList = [];
var minAppleIx;
var directionList = [];  
var freeze = false;
//SCENE
var env, floor, llama,arrow,curve,
        globalSpeedRate = 1,
        map = {},
        maxSpitLoad = .5, spitLoadRate= 0;
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
//SCREEN VARIABLES
var spitObj;
var HEIGHT,
  WIDTH,
  windowHalfX,
  windowHalfY,
  mousePos = {
    x: 0,
    y: 0
  };
  javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
  function init() {
      
    pointField = document.getElementById('point');
    instructionField2 = document.getElementById('instructions2');
    instructionField = document.getElementById('instructions');
    scene = new THREE.Scene();

    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 40;
    nearPlane = 1;
    farPlane = 6000;
    camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane);
    camera.position.x = 100;
    camera.position.z = -250;
    camera.position.y = 100;
    cameraOffset = camera.position;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    fakeCamera = camera.clone();
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);
    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;
    
    
    onkeydown = onkeyup = function(e){
        e = e || event;
        map[e.keyCode] = e.type === 'keydown';
    }
    
    
    window.addEventListener('resize', onWindowResize, false);    
    
    
    document.addEventListener('mousedown', function(){ mousedown = true;}, false);
    document.addEventListener('mouseup', mouseUp, false);
    
    
    document.addEventListener('keydown', handleMoveOneHit, false);
    
    document.addEventListener('mousemove', setPickPosition);

    controls = new THREE.OrbitControls(fakeCamera, renderer.domElement);
    
    
    controls.minPolarAngle = -Math.PI / 2; 
    controls.maxPolarAngle = Math.PI / 2;
    controls.noZoom = false;
    controls.noPan = false;
    controls.target.add(new THREE.Vector3(50,20,100));
    controls.enabled = false;
    spitObj = makeCube(new THREE.MeshLambertMaterial({color: 0xffffff,
    flatShading: isFlatShading}),2,2,2,0,0,0,0,0,0);
  }

 function mouseDown(){
     handleSpitDown();
    changed = true;
 }
 function mouseUp(){
     mousedown = false;
     if(!controls.enabled){
        handleSpitUp();
        changed= false;}
 }
     
 function rayVertex(){
     
    
    
     raycaster.setFromCamera( mouse.clone(), camera );
    //console.log(scene.children);
    var objects = [];
     scene.traverse(function(object){
         objects.push(object);
     });
    
    var obj = raycaster.intersectObjects(objects);
    if(obj.length !== 0){
        //console.log(obj[0]);
        return obj[0].point;
         //obj[0].object.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
    }
     
 }
function setPickPosition(event) {
  mouse.x = (event.x / WIDTH ) *  2 - 1;
  mouse.y = (event.y / HEIGHT) * -2 + 1;
  
}
 
  function onWindowResize() 
  {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
  }
  var inc = 0.1;
  function handleSpitDown()
  {
        if(spitLoadRate<maxSpitLoad)
            spitLoadRate +=  inc*inc;
        else 
            spitLoadRate = maxSpitLoad;
        llama.SpitLoad(spitLoadRate);
        llama.smile.visible = false;
        

      
  }
  function handleSpitUp()
  {
      llama.spit();
      spitLoadRate = 0;
      llama.SpitLoad(spitLoadRate);
      llama.smile.visible = true;
      
  }
  var morningColor;
  var changed = false;
  var eatTime = new Date().getTime();
  function handleMoveOneHit(event){
      if(event.keyCode === 70 && isFlatShading == true){ 
        isFlatShading = false;
    }
    else if (event.keyCode === 70  && isFlatShading == false){
        isFlatShading = true;
    }
    if(event.keyCode === 67 && !controls.enabled ){ 
        controls.enabled = true;
    }
    else if(event.keyCode === 67 && controls.enabled){ 
        controls.enabled = false;
    }
    if(event.keyCode === 82 && llama.headLightBody.visible == true){ 
        llama.headLightBody.visible = false;
        
    }else if(event.keyCode === 82 && llama.headLightBody.visible == false){ 
        llama.headLightBody.visible = true;
    }
    if(event.keyCode === 78 && shadowLight.visible == true){ 
        shadowLight.visible = false;
        light.intensity = .3;
        var world = document.querySelector('#world');
        world.style.setProperty("background","#000000");
        
        for(i= 1; i<5; i++){
            env.children[i].material.emissive = [0,0,0];
        }
    }else if(event.keyCode === 78 && shadowLight.visible == false){ 
        shadowLight.visible = true;
        light.intensity = .8;
        var world = document.querySelector('#world');
        world.style.setProperty("background","#87ceeb");
        for(i= 1; i<5; i++){
            env.children[i].material.emissive = morningColor ;
        }
        console.log(env);
    }
    if(event.keyCode === 73){
        closeHelpDiv1();
        flag_inst = !flag_inst; 
    }
  }
  function handleMove(){
    if(map[87] && !freeze)
    {
        llama.MoveForward();
    }else if(map[83] && !freeze){
        llama.MoveBackward();
    }
    else{
        llama.stableFeet();
    }
    if(map[65] && !freeze){
        llama.look("left");
    }
    else if(map[68] && !freeze){
        llama.look("right");
    }
    
    if(map[80]){
        controlsLock.lock();
    }
    
    if(map[69] && eatFlag === -1){
        eatFlag = 1;
        eatTime = new Date().getTime();
        llama.eat();
        freeze = true;
    }
    if((!map[69]|| new Date().getTime() > eatTime+2000)  && eatFlag ===1 ){
        if(new Date().getTime() > eatTime+2000){
            removeEntity(applelist[minAppleIx]);
            applelist.splice(minAppleIx,1);
            point++;
        }
            
        eatFlag = -1;
        llama.eat();
        freeze = false;
    }
    
    
    
    if(map[16]){
        moveSpeed = 3;
    }else{
        moveSpeed = 1;
    }
        
    
}
  function removeEntity(obj) {
      if(typeof obj.parent !== 'undefined'){
        obj.parent.remove(obj);
    }
    

}

  function createLights() {
  light = new THREE.HemisphereLight(0xffffff, 0xb3858c, .8);

  shadowLight = new THREE.DirectionalLight(0xffffff, .8);
  shadowLight.position.set(100, 100, 50);
  shadowLight.castShadow = true;
  shadowLight.shadowDarkness = .15;

  backLight = new THREE.DirectionalLight(0xffffff, .4);
  backLight.position.set(200, 100, 100);
  backLight.shadowDarkness = .1;
  backLight.castShadow = true;

  //scene.add(backLight);
  scene.add(light);
  scene.add(shadowLight);
}
function createFloor() {
  
  var geom = new THREE.PlaneGeometry(20000, 20000);
  geom.computeFlatVertexNormals();
  floor = new THREE.Mesh(geom, new THREE.MeshLambertMaterial({
    color: 0X5be686,
    flatShading: isFlatShading
  }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -36;
  floor.receiveShadow = true;

  env.add(floor);
  scene.add(env);
}
function createWalls(){
    env = new THREE.Group();
    var wall1 = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), new THREE.MeshLambertMaterial({
    color: 0X000000,
    flatShading: isFlatShading,
    emissive: 0X87cfeb
  }));
    morningColor = wall1.material.emissive; 
    wall1.position.y = -40;
    wall1.position.z = -6000;
    wall1.rotation.z = -Math.PI / 2;
    var wall2 = wall1.clone();
    wall2.rotation.y = -Math.PI / 2;
    wall2.position.z = 0;
    wall2.position.x = 6000;
    var wall3 = wall1.clone();
    wall3.rotation.y= Math.PI ;
    wall3.position.z = 6000;
    var wall4= wall2.clone();
    wall4.position.x = -6000;
    wall4.rotation.y= Math.PI / 2;
    env.add(wall2);
    env.add(wall1);
    env.add(wall3);
    env.add(wall4);
}
var redAppleMat = new THREE.MeshLambertMaterial({
    color: 0xff0000,
    flatShading: isFlatShading
  });
var greenAppleMat = new THREE.MeshLambertMaterial({
    color: 0x659e20,
    flatShading: isFlatShading
  });
function createTrees() {
  var tree = makeCube(new THREE.MeshLambertMaterial({
    color: 0x874a5c,
    flatShading: isFlatShading
  }), 20, 180, 20, -120, 25, 170, 0, 0, 0);
  var treegrass = makeCube(new THREE.MeshLambertMaterial({
    color: 0x95c088,
    flatShading: isFlatShading
  }), 120, 80, 120, 0, 105, 0, 0, 0, 0);
  var treeapple = makeCube(redAppleMat, 10, 10, 10, 0, 105, 0, 0, 0, 0);
  var treeapple1 = treeapple.clone();
  
  treeapple1.position.z-=20;
  treeapple1.position.y-=30;
  var treeapple2 = treeapple.clone();
  treeapple2.position.x-=60;
  treeapple2.position.y-=20;
  treeapple2.position.z-=70;
  tree.add(treegrass);
  //treegrass.add(treeapple);
  //treegrass.add(treeapple1);
  //treegrass.add(treeapple2);
  var tree2 = tree.clone();
  trees = [tree,tree2]; 
  var bTree = makeCube(new THREE.MeshLambertMaterial({
    color: 0xb05307,
    flatShading: isFlatShading
  }), 20, 250, 20, -120, 25, 170, 0, 0, 0);
  var bTreeGrass = makeCube(new THREE.MeshLambertMaterial({
    color: 0x95c088,
    flatShading: isFlatShading
  }), 40, 20, 100, 0, 105, -60, THREE.Math.degToRad(-20), 0, 0);
  var bTreeGrass1 = makeCube(new THREE.MeshLambertMaterial({
    color: 0x95c088,
    flatShading: isFlatShading
  }), 100, 20, 40, -60, 105, 0, 0, 0, THREE.Math.degToRad(20));
  var bTreeGrass2 = makeCube(new THREE.MeshLambertMaterial({
    color: 0x95c088,
    flatShading: isFlatShading
  }), 100, 20, 40, 60, 105, 0, 0, 0, THREE.Math.degToRad(-20));
  var bTreeGrass3 = makeCube(new THREE.MeshLambertMaterial({
    color: 0x95c088,
    flatShading: isFlatShading
  }), 40, 20, 100, 0, 105, 60, THREE.Math.degToRad(20), 0, 0);
  bTree.add(bTreeGrass);
  bTree.add(bTreeGrass1);
  bTree.add(bTreeGrass2);
  bTree.add(bTreeGrass3);
  var bGeo = new THREE.TorusGeometry( 10, 3, 16, 100, Math.PI*3/4 ); 
  var banana = new THREE.Mesh(bGeo,new THREE.MeshLambertMaterial({
    color: 0xffff00,
    flatShading: isFlatShading}));
  var bananas = new THREE.Group();
  banana.position.y = 110;
  banana.position.x = 10;
  banana.rotation.z = THREE.Math.degToRad(-90);
  ban1 = banana.clone();
  ban1.rotation.y = THREE.Math.degToRad(45);
  ban2 = banana.clone();
  ban2.rotation.y = THREE.Math.degToRad(-45);
  bananas.add(banana);
  bananas.add(ban1);
  bananas.add(ban2);
  //bTree.add(bananas);
  //scene.add(bTree);
  
  for(i = 0; i < 60; i++)
  {
      var temp;
      var rand =  Math.random()-0.5;
      var rand1 =  Math.random()-0.5;
      var rand2 =  Math.random()-0.5;
      if(Math.random()>0.1){
        temp = tree.clone();
        
        var color;
        if(Math.random()>0.5)
                color = greenAppleMat;
        else
            color = redAppleMat;
        for(e = 0; e < 12; e++){
            var treeap = treeapple.clone();
            treeap.material = color;
            if(e < 3){
                treeap.position.x-=60;
                treeap.position.y+= (Math.random()-0.5) *70;
                treeap.position.z+= (Math.random()-0.5) *110;
            }else if(e < 6){
                treeap.position.x+=60;
                treeap.position.y+= (Math.random()-0.5) *70;
                treeap.position.z+= (Math.random()-0.5) *110;
            }else if(e < 9){
                treeap.position.z+=60;
                treeap.position.y+= (Math.random()-0.5) *70;
                treeap.position.x+= (Math.random()-0.5) *110;
            }
            else if(e < 12){
                treeap.position.z-=60;
                treeap.position.y+= (Math.random()-0.5) *70;
                treeap.position.x+= (Math.random()-0.5) *110;
            }
            temp.add(treeap);
            applelist.push(treeap);
        }
          
      }
      else{
          temp = bTree.clone();
          var ban = bananas.clone();
          temp.add(ban);
          applelist.push(ban.children[0]);
          applelist.push(ban.children[1]);
          applelist.push(ban.children[2]);
      }
      temp.position.y += (Math.random()/2-0.5)*40;
      temp.position.x += rand *5000;
      temp.position.z += rand1 *5000;
      temp.rotation.y += rand2 *200;
      trees.push(temp);      
      scene.add(trees[i+2]);
      collidableMeshList.push(trees[i+2]);

        
  }
  
  
  
}

Llama = function() 
{
    this.threegroup = new THREE.Group();
    var llamaMat = new THREE.MeshLambertMaterial({
    color: 0xc1aa7a,
        //color: 0x5da683,
    flatShading: isFlatShading
  });
  var lightGreenMat = new THREE.MeshLambertMaterial({
    color: 0x95c088,
    flatShading: isFlatShading
  });

  var yellowMat = new THREE.MeshLambertMaterial({
    color: 0xfdde8c,
    flatShading: isFlatShading
  });

  var redMat = new THREE.MeshLambertMaterial({
    color: 0xf8e1af,
    flatShading: isFlatShading
  });

  var whiteMat = new THREE.MeshLambertMaterial({
    color: 0xfaf3d7,
    flatShading: isFlatShading
  });

  var brownMat = new THREE.MeshLambertMaterial({
    color: 0x874a5c,
    flatShading: isFlatShading
  });

  var blackMat = new THREE.MeshLambertMaterial({
    color: 0x403133,
    flatShading: isFlatShading
  });
  var pinkMat = new THREE.MeshLambertMaterial({
    color: 0xd0838e,
    flatShading: isFlatShading
  });
  var normalYellowMat = new THREE.MeshLambertMaterial({
    color: 0xf9ff79,
    flatShading: isFlatShading
  });
  this.body = new THREE.Group();
  this.body.name = 'body';
  this.belly = makeCube(llamaMat, 30, 30, 70, 0, 0, -15, 0, 0, 0);
  this.neck = makeCube(llamaMat, 15, 55, 15, 0, 35, 20, 0.2, 0, 0);
  
  this.body.add(this.belly);

  this.head = new THREE.Group();
  this.head.name = 'head';
  this.face = makeCube(llamaMat, 60, 50, 80, 0, 25, 40, 0, 0, 0);
  this.face.name = 'face';
  var earInGeom = new THREE.CylinderGeometry(0, 6, 10, 4, 1);
  this.earInL = new THREE.Mesh(earInGeom, yellowMat);
  this.earInL.position.y = 55;
  this.earInL.position.z = 11;
  this.earInL.position.x = 17;
  this.earInL.name = 'earIn';
  this.earInR = this.earInL.clone();
  this.earInR.position.x = -17;
  this.earInR.name = 'earIn';
  this.earL = makeCube(llamaMat, 5, 10, 20, 32, 42, 2, 0, 0, 0);
  this.earL.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(15, -10, -15));
  this.earL.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));
  this.earL.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI ));
  this.earL.name = 'earl';
  this.earR = makeCube(llamaMat, 5, 10, 20, -32, 42, 2, 0, 0, 0);
  this.earR.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-15, -10, -15));
  this.earR.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));
  this.earR.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI ));
  this.earR.name = 'earr';
  this.mouth = new THREE.Group();
  this.mouth.position.z = 10;
  this.mouth.position.y = 3;
  this.mouth.rotation.x = 0;//Math.PI / 8;
  this.mouth.name = 'mouth';
  this.jaw = makeCube(llamaMat, 30, 10, 30, 0, 0, 65, 0, 0, 0);
  this.jaw.name = 'jaw';
  this.mouth.add(this.jaw);
  
  // head smile
  var smileGeom = new THREE.TorusGeometry( 6, 2, 2, 10, Math.PI );
  this.smile = new THREE.Mesh(smileGeom, blackMat);
  this.smile.position.z = 82;  
  this.smile.position.y = 5;
  this.smile.rotation.z = -Math.PI;
  this.smile.name = 'smile';
  // head cheek
  this.cheekL = makeCube(redMat, 4, 20, 20, 30, 18, 55, 0, 0, 0);
  this.cheekR = this.cheekL.clone();
  this.cheekR.position.x = -this.cheekL.position.x;
  
    this.eyeL = makeCube(whiteMat, 10, 22, 22, 27, 34, 18, 0, 0, 0);
  this.eyeR = this.eyeL.clone();
  this.eyeR.position.x = -27;

  // head iris
  this.irisL = makeCube(brownMat, 10, 12, 12, 28, 30, 24, 0, 0, 0);
  this.irisR = this.irisL.clone();
  this.irisR.position.x = -this.irisL.position.x;
  
  
  // head nose
  this.noseL = makeCube(blackMat, 5, 5, 8, 5, 40, 77, 0, 0, 0);
  this.noseR = this.noseL.clone();
  this.noseR.position.x = -this.noseL.position.x;
  
  this.headLight = new THREE.SpotLight(0xf9ff79);
  this.headLight.position.set(0,0,1);
  this.headLight.castShadow = true;
  this.headLight.shadow.mapSize.width = 1024;
  this.headLight.shadow.mapSize.height = 1024;
  this.headLight.shadow.camera.near = 500;
  this.headLight.shadow.camera.far = 4000;
  this.headLight.shadow.camera.fov = 30;
  this.headLight.angle = THREE.Math.degToRad(10);
  
  this.headLightBody = makeCube(blackMat, 10,10,40,0,55,60,0,0,0);
  var cone = makeCone(blackMat,15,20,8,0,0,20,0,0,0);
  var bulb = new THREE.Mesh(new THREE.CircleGeometry(15),normalYellowMat);
  bulb.position.z = 30;
  this.headLightBody.add(bulb);
  cone.rotation.x = THREE.Math.degToRad(-90);
  this.headLightBody.add(cone);
  
  this.target = new THREE.Object3D();
  this.target.position.set(0,0,1+0.1);
  this.headLightBody.add(this.target);
  this.headLight.target = this.target;
  this.head.add(this.headLightBody);
  this.head.add(this.face);
  this.head.add(this.earInL);
  this.head.add(this.earInR);
  this.head.add(this.earL);
  this.head.add(this.earR);
  this.head.add(this.mouth);
  this.head.add(this.jaw);
  this.head.add(this.smile);
  this.head.add(this.cheekR);
  this.head.add(this.cheekL);
  this.head.add(this.eyeL);
  this.head.add(this.eyeR);
  this.head.add(this.irisL);
  this.head.add(this.irisR);
  this.head.add(this.noseL);
  this.head.add(this.noseR);
  this.headLightBody.add(this.headLight);
  this.head.scale.set(.5,.5,.5);
  
  
  this.dummyHead = this.face.clone();
  this.dummyHead.material = llamaMat.clone();
  this.dummyHead .scale.set(.5,.5,.5);
  this.dummyHead .position.y+=35;
  this.dummyHead .position.z-=30;
  this.dummyHead.material.transparent = true;
  this.dummyHead.material.opacity = 0; 
  this.legFL = makeCube(llamaMat, 10, 30, 10, 10, -20, 8, 0, 0, 0);
  this.legFR = this.legFL.clone();
  this.legFR.position.x = -10;
  this.legBL = this.legFL.clone();
  this.legBL.position.z = -35;
  this.legBR = this.legBL.clone();
  this.legBR.position.x = -10;
  
    this.upper = new THREE.Group();

  this.upper.add(this.neck);
  this.upper.add(this.dummyHead);
  this.body.add(camera);
  this.earR.name = 'upper';
  this.threegroup.add(this.body);
  this.threegroup.add(this.upper);
  this.threegroup.add(this.legFL);
  this.threegroup.add(this.legFR);
  this.threegroup.add(this.legBL);
  this.threegroup.add(this.legBR);

  
  this.threegroup.traverse(function(object) {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = false;
    }
  });
  }
  Llama.prototype.SpitLoad = function(l)
  {
      var speed = globalSpeedRate/3;
      if(l === 0)
          speed = globalSpeedRate;

      TweenLite.to(this.upper.rotation,speed,{
          x: -l,
          ease : Back.easeOut
      })
      TweenLite.to(this.jaw.rotation,speed,{
          x: l,
          ease : Back.easeOut
      })
      
  }
  Llama.prototype.MoveForward = function()
{
    this.threegroup.position.x+=Math.sin(this.threegroup.rotation.y)*moveSpeed;
    
    this.threegroup.position.z+=Math.cos(this.threegroup.rotation.y)*moveSpeed;
    var originPoint = this.threegroup.position.clone();//farklı originler denenebilir.

    for(var vertexIndex = 0; vertexIndex < this.threegroup.getObjectByName('face').geometry.vertices.length; vertexIndex++)//face koymamın sebebi ileri giderken 
	{                                                                                                                  //vücudunun en ileri kısmının orası olması geri giderken     
                                                                                                                           //body koyulması daha mantıklı     
		var localVertex = this.threegroup.getObjectByName('face').geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4( this.threegroup.getObjectByName('face').matrix );
		var directionVector = globalVertex.sub( this.threegroup.getObjectByName('face').position );
		
		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );

		var collisionResults = ray.intersectObjects( collidableMeshList );
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
                {this.MoveBackward();}//stop the movement for example.
	}
         

        this.moveFeet();

    
};
Llama.prototype.MoveBackward = function()
{

    this.threegroup.position.x-=Math.sin(this.threegroup.rotation.y)*moveSpeed;
    
    this.threegroup.position.z-=Math.cos(this.threegroup.rotation.y)*moveSpeed;
    var originPoint = this.threegroup.position.clone();
    for(var vertexIndex = 0; vertexIndex < this.threegroup.getObjectByName('face').geometry.vertices.length; vertexIndex++)//origin ya da referans değişecek.
	{		            

		var localVertex = this.threegroup.getObjectByName('face').geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4( this.threegroup.getObjectByName('face').matrix );
		var directionVector = globalVertex.sub( this.threegroup.getObjectByName('face').position );
		
		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );

		var collisionResults = ray.intersectObjects( collidableMeshList );
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
                {this.MoveForward();}//stop the movement for example.
	}
         
    this.moveFeet();
};
Llama.prototype.look = function(dir){
  var speed = .01*globalSpeedRate;
  //timeFire = Math.round(s * 10);
  if(dir === "left"){
    this.threegroup.rotation.y+=speed;
}
else{
    this.threegroup.rotation.y-=speed;
}
}
eatFlag = -1;
var eatAnim;
Llama.prototype.eat = function(){
  var speed = 1*globalSpeedRate;
  
  if(eatFlag === 1)
  {
     TweenLite.to(this.upper.rotation,speed,{
          x:  1.40 ,
          ease: Back.easeOut
          
      });
      TweenLite.to(this.upper.position,speed,{

          y:  20,
          ease: Back.easeOut

      });
      anim = TweenMax.to(this.jaw.rotation,speed/3,{
          repeat:-1,
          x:  0.3
          

      });
      
  }
  else{
      anim.kill();
      this.jaw.rotation.x = 0;
      TweenLite.to(this.upper.rotation,speed,{

          x:  0 ,
          ease: Back.easeOut

      });
      TweenLite.to(this.upper.position,speed,{

          y:  0,
          ease: Back.easeOut

      });
      
  }
}
Llama.prototype.spit = function()
{
    var sp = spitObj.clone();
    
    sp.position.z = this.head.position.z+this.mouth.position.z;
    sp.position.x = this.head.position.x+this.mouth.position.x;
    sp.position.y = this.head.position.y+this.mouth.position.y;
    scene.add(sp);
    var points = curveg.getPoints(30);

    init(0);
    function init(i){
        var anim = TweenMax.to(sp.position,0.0001,{
            x: points[i].x,
            y: points[i].y,
            z: points[i].z,
            ease: Back.easeOut,
            
        });
        if(i < points.length-1){
            anim.eventCallback("onComplete",init,[i+1]);
            var originPoint = sp.position.clone();
            for(var vertexIndex = 0; vertexIndex < sp.geometry.vertices.length; vertexIndex++){    
                var localVertex = sp.geometry.vertices[vertexIndex].clone();
                var globalVertex = localVertex.applyMatrix4( sp.matrix );
                var directionVector = globalVertex.sub( sp.position );
                
                var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
        
                var collisionResults = ray.intersectObjects( applelist );
                if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
                        {scene.remove(sp);
                         INTERSECTED = collisionResults[0].object;
                         TweenLite.to(INTERSECTED.position,0.5,{
                y: floor.position.y+4-INTERSECTED.parent.position.y,
                ease: 0
            });
                         //INTERSECTED.position.y = floor.position.y -18;
                         }
            }}
        else
            scene.remove(sp);
    }
    
}
flag = -1;
var d = new Date();
var time = d.getTime();
Llama.prototype.moveFeet = function() {
    var speed = 1.3 * globalSpeedRate / moveSpeed;
    
    if(time < new Date().getTime() -500/moveSpeed){
        time = new Date().getTime();
        flag = -flag;
    }
    TweenLite.to(this.legFL.rotation,speed,{
       
        x:  -0.35 *flag ,
        ease: Back.easeOut
        
    });
    TweenLite.to(this.legBL.rotation,speed,{
        
        x: .35 *flag,
        ease: Back.easeOut
    });
    TweenLite.to(this.legFR.rotation,speed,{
        transformOrigin:"0% 100%",
        x:  .35*flag ,
        ease: Back.easeOut
    });
    TweenLite.to(this.legBR.rotation,speed,{
        transformOrigin:"0% 100%",
        x:  -0.35*flag ,
        ease: Back.easeOut
    });
    }
Llama.prototype.stableFeet = function()
{
    var speed = .7*globalSpeedRate;
  //timeFire = Math.round(s * 10);
  TweenLite.to(this.legFL.rotation,speed,{
        x: 0,
        ease: Back.easeOut
    });
    TweenLite.to(this.legBL.rotation,speed,{
        x: 0,
        ease: Back.easeOut
    });
    TweenLite.to(this.legBR.rotation,speed,{
        x: 0,
        ease: Back.easeOut
    });
    TweenLite.to(this.legFR.rotation,speed,{
        x: 0,
        ease: Back.easeOut
    });
}
function makeCone(mat, w, h, d, posX, posY, posZ, rotX, rotY, rotZ) {
  var geom = new THREE.ConeGeometry(w, h, d,1,true);
  var mesh = new THREE.Mesh(geom, mat);
  mesh.position.x = posX;
  mesh.position.y = posY;
  mesh.position.z = posZ;
  mesh.rotation.x = rotX;
  mesh.rotation.y = rotY;
  mesh.rotation.z = rotZ;
  return mesh;
}
function makeCube(mat, w, h, d, posX, posY, posZ, rotX, rotY, rotZ) {
  var geom = new THREE.BoxGeometry(w, h, d);
  var mesh = new THREE.Mesh(geom, mat);
  mesh.position.x = posX;
  mesh.position.y = posY;
  mesh.position.z = posZ;
  mesh.rotation.x = rotX;
  mesh.rotation.y = rotY;
  mesh.rotation.z = rotZ;
  return mesh;
}


var geometry = new THREE.Geometry()
function createLlama(){
    llama = new Llama();
    scene.add(llama.threegroup);
    
    controlsLock = new THREE.PointerLockControls( llama.head);
    controlsLock.addEventListener( 'lock', function () {

	document.addEventListener('mousedown', handleSpitDown, false);
        document.addEventListener('mouseup', handleSpitUp, false);
    } );
    controlsLock.addEventListener( 'unlock', function () {
        document.removeEventListener('mousedown', handleSpitDown, false);
        document.removeEventListener('mouseup', handleSpitUp, false);
    } );
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3( 0, 0, 0) );
    geometry.vertices.push(new THREE.Vector3( 20, 10, 0) );
    
    arrow = new THREE.Line( geometry,  new THREE.LineDashedMaterial( { color: 0x0000ff } ) );
    arrow.linewidth = 24;
    scene.add(arrow);
    
}
;
var spitLength = 50;
flag = true;
var curveg;
var distList = [];
var minApple ;
var hold = "";
var hold2 = "";
var flag_inst = true;
function loop() {
    if(mousedown && !controls.enabled)
        mouseDown();
    pointField.innerHTML = point;
    handleMove();
    changeShading();
    distList = [];
    applelist.forEach(appleDist);
    
    
    minApple = Math.min.apply(Math,distList);

    
    if(instructionField.innerHTML !=="Hold E to eat" )
        hold = instructionField.innerHTML;
    if(minApple > 90){
        instructionField.innerHTML = hold;
        eatFlag = 0;
    }else if(eatFlag === 0){
        eatFlag = -1;
    }
    else{
        instructionField.innerHTML ="Hold E to eat";
    }
    //scene.add(new THREE.ArrowHelper(raycaster.ray.direction, llama.threegroup.position, 300, 0xff0000) );   
    aim();
    
    camera.copy(fakeCamera);
    
    
    render();

    requestAnimationFrame(loop);
}
function closeHelpDiv1(){
	if(flag_inst )
	{
                document.getElementById("helper").style.display=" none";
		instructionField2.innerHTML = "<p>Press 'R' to activate/deactivate headlight</p><p>Press 'N' change day/night settings.</p><p>Press 'F' to switch between shadings.</p><p>Press 'C' to change the camera position.</p> ";
	}
	else if(!flag_inst)
	{
		document.getElementById("instructions2").innerHTML="";		
	}
    }
    
function appleDist(item,index)
    {
        var vec = new THREE.Vector3();
        vec.setFromMatrixPosition(item.matrixWorld);
        distList.push(llama.threegroup.position.distanceTo(vec));
    }

function aim(){
    scene.remove(arrow);
    scene.remove(curve);
    var vector = new THREE.Vector3();
    vector.setFromMatrixPosition( llama.mouth.matrixWorld );
    
    geometry.vertices[0] = vector;
    var v = rayVertex();
    if(v!== undefined)
            {
        geometry.vertices[1] = v;
        
        llama.head.position.setFromMatrixPosition( llama.dummyHead.matrixWorld );
        if(!map[69])
            llama.head.lookAt(v);
        else{
            distList.forEach(func);
            function func(item,index){
                if(item === minApple){
                    minAppleIx = index;
                }
            }
            var vec = new THREE.Vector3();
            vec.setFromMatrixPosition(applelist[minAppleIx].matrixWorld);
            llama.head.lookAt(vec);
        }
        scene.add(llama.head);
        //llama.dummyHead.position.copy(llama.head.position);
            }
    spitLength = spitLoadRate*300 + 50;
    arrow = new THREE.Line( geometry,  new THREE.LineDashedMaterial( { color: 0x555555,dashSize: 2,
	gapSize: 1 } ) );
    var curveGeom = new THREE.Geometry();
    var point1 = getPointInBetweenByLen(geometry.vertices[0],geometry.vertices[1],spitLength);
    var point0 =geometry.vertices[0].clone();
    point0.y-=2;
    point0.z += 3;
    point1.y +=10;
    var point2 =getPointInBetweenByLen(geometry.vertices[0],geometry.vertices[1],spitLength*2);;
    point2.y -=30;
    
    curveg = new THREE.QuadraticBezierCurve3(
	point0,
        point1,
        point2,
    );
    var points = curveg.getPoints( 100 );
    var curveGeom = new THREE.BufferGeometry().setFromPoints( points );
    var material = new THREE.LineDashedMaterial( { color : 0x666666 } );
    
    curve = new THREE.Line( curveGeom, material );
    if(spitLoadRate !== 0)    
        scene.add(curve);
    else
        scene.add(arrow);
}
function changeShading()
{
    if(isFlatShading){
        floor.material = new THREE.MeshPhongMaterial({
    color: 0X5be686,
    flatShading: true
    });
    trees.forEach(forfunc);
    function forfunc(item,index){
        item.children[0].material =new THREE.MeshPhongMaterial({
    color: 0x95c088,
    flatShading: true});
        item.material = new THREE.MeshPhongMaterial({
    color: 0x874a5c,
    flatShading: true});
    }
    }
    else{
        floor.material = new THREE.MeshLambertMaterial({
    color: 0X5be686,
    flatShading: false
        
    });
    trees.forEach(forfunc);
    function forfunc(item,index){
        item.children[0].material =new THREE.MeshLambertMaterial({
    color: 0x95c088,
    flatShading: false});
    item.material = new THREE.MeshLambertMaterial({
    color: 0x874a5c,
    flatShading: true});
    }
    }
}
function distanceVector( v1, v2 )
{
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt( dx * dx + dy * dy + dz * dz );
}
function getPointInBetweenByLen(pointA, pointB, length) {

    var dir = pointB.clone().sub(pointA).normalize().multiplyScalar(length);
    return pointA.clone().add(dir);

}
var iss = 0;
function render() {
  if (controls) controls.update();
  arrow.geometry.verticesNeedUpdate = true;
  curve.geometry.verticesNeedUpdate = true;
  floor.material.needsUpdate = true;
  arrow.geometry.computeBoundingSphere();
  curve.geometry.computeBoundingSphere();
  arrow.computeLineDistances();
  curve.computeLineDistances();
  renderer.render(scene, camera);
}
init();
createLights();
createWalls();
createFloor();
createTrees();
createLlama();
loop();
