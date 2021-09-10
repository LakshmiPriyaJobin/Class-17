var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud;
var r
var cloudImg;
var cactus;
var c1Img,c2Img,c3Img,c4Img,c5Img,c6Img;
var trex_score = 0;
var jumpSound,dieSound,milestoneSound;

var obstacleGroup;
var cloudGroup;
 var gameOver, gameOverImg;
var restart,restartImg;
//capital letters ->which hold value that do not change
var PLAY = 1;
var END = 0;

var gameState = PLAY;

function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
 cloudImg = loadImage('cloud.png');
  
c1Img = loadImage('obstacle1.png');
c2Img = loadImage('obstacle2.png');
c3Img = loadImage('obstacle3.png');
c4Img = loadImage('obstacle4.png');
c5Img = loadImage('obstacle5.png');
c6Img = loadImage('obstacle6.png');
 
gameOverImg = loadImage('gameOver.png');
 restartImg = loadImage('restart.png');

jumpSound = loadSound('jump.mp3');
dieSound = loadSound ('die.mp3');
milestoneSound = loadSound('checkpoint.mp3');

}


function setup() {

  createCanvas(600,200)
  
  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  trex.debug= false;
 //trex.setCollider('rectangle', 0, 0,400, trex.height);
  trex.setCollider('circle',0,0,60)

  

  
  //create a ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  //creating invisible ground
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
   
  // r = Math.round(random(100, 300));
 // r = round(random(100, 300));
 //  console.log(r)

 //created the group
 obstacleGroup = new Group();
 cloudGroup = new Group();


gameOver = createSprite(300,100);
gameOver.addImage(gameOverImg);
gameOver.scale = 0.5;
gameOver.visible = false;


restart = createSprite(300,140);
restart.addImage(restartImg);
restart.scale = 0.5;
restart.visible = false;

 //local variable
 var message = "This is C17 trex activity";
 console.log(message);
}

function draw() {
  //set background color
  background(180);

 // console.log("game State is :" ,gameState )
  //score display
  fill('black')
  textSize(15)
  text('score: ' + trex_score,500,20);
  

  if(gameState === PLAY)
  {
      //logic for the score
      //trex_score = trex_score + Math.round(frameCount/60);

      //trex_score = trex_score +  Math.round(0.9);
      trex_score = trex_score + Math.round(getFrameRate()/60)

      //move the ground
      ground.velocityX = -(4 + 3*trex_score/100);

    // jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 148) {
      trex.velocityY = -10;
      jumpSound.play();
    } 
     //gravity logic
  trex.velocityY = trex.velocityY + 0.8
  
   //reset the ground infinite look
   if (ground.x < 0){
    ground.x = ground.width/2;
  }
 //call the function of spawn clouds
 spawnCloud();

 //call th obstacles
 spawnObstacles();
 //console.log(frameCount)

if(trex_score >0 && trex_score%100===0)
{
  
   milestoneSound.play();
}
 
 if(obstacleGroup.isTouching(trex))
 {
    // trex.velocityY = -12;
    // jumpSound.play();
    gameState = END; 
      dieSound.play();

 }
  }

else if(gameState === END)
{
   
  ground.velocityX = 0;
  obstacleGroup.setVelocityXEach(0);
  cloudGroup.setVelocityXEach(0);
  trex.changeAnimation("collided",trex_collided);
  obstacleGroup.setLifetimeEach(-1);
  cloudGroup.setLifetimeEach(-1);
  //edge case don't want the trex to go up 
  trex.velocityY = 0;
  gameOver.visible = true;
  restart.visible = true;

  if(mousePressedOver(restart))
  {
      reset()
  }
}

 
    
  //stop trex from falling down
  trex.collide(invisibleGround);
  
 
  drawSprites();
  
}

function reset()
{
   gameState = PLAY;
   gameOver.visible = false;
   restart.visible = false;

   obstacleGroup.destroyEach();
   cloudGroup.destroyEach();
    
    trex.changeAnimation("running", trex_running);

    trex_score = 0;

}


//user defined 
function spawnCloud()
{
  if(frameCount% 60 === 0)
  {
    //cloud = createSprite(600,round(random(10, 100)),20,20);
    cloud = createSprite(600,10,20,20) 
    cloud.velocityX = -3;
    cloud.addImage(cloudImg);
    cloud.scale = 0.5
    cloud.y = Math.round(random(10,100))
    //console.log('cloud depth: ', cloud.depth);
    //console.log('trex depth: ', trex.depth);
    



    trex.depth = cloud.depth +1;
    //memory leak - distance/3
    cloud.lifetime = 210;

   cloudGroup.add(cloud) ;
  }

}

function spawnObstacles()
{
  if(frameCount % 80 === 0)
  {
    cactus = createSprite(600,170,10,10);
    cactus.velocityX = -(7+trex_score/100);

     //random num 
     var r = Math.round(random(1,6))
     switch(r)
     {
        case 1 : cactus.addImage(c1Img);
                  break;

         case 2 : cactus.addImage(c2Img);
                  break;

         case 3 : cactus.addImage(c3Img);
                  break;
                  
          case 4 :cactus.addImage(c4Img)  ;
                  break;
          
          case 5 :cactus.addImage(c5Img);
                  break;

           case 6 : cactus.addImage(c6Img)   ;
                    break;
                        

          default : break;

     } //closing of switch

     cactus.scale = 0.5;
     cactus.lifetime = 200;

     //add each obstacle inside the group
     obstacleGroup.add(cactus);


  }

 
}
