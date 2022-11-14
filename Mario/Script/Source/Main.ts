namespace Script {
  import fc = FudgeCore;
  import ƒAid = FudgeAid;

  let viewport: fc.Viewport;
  let pos: fc.Vector3;

  let marioSpriteNode: ƒAid.NodeSprite;
  let goombaSpriteNode: ƒAid.NodeSprite;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  let marioTransform: fc.Node;
  let marioNode: fc.Node;
  let marioTransformComponent: fc.ComponentTransform;

  let enemiesNodes: fc.Node;
  let goombaNodes: fc.Node[];

  export let gravity: number = -90;
  let marioWalkSpeed: number = 5;
  let marioVelocityY: number = 0;
  let marioJumpHeight: number = 18.5;

  let animationWalk: ƒAid.SpriteSheetAnimation;
  let animationStand: ƒAid.SpriteSheetAnimation;
  let animationGoomba: ƒAid.SpriteSheetAnimation;
  let animationJump: ƒAid.SpriteSheetAnimation;

  let currentAnimation: ƒAid.SpriteSheetAnimation;
  
  let cmpCamera: fc.ComponentCamera;

  let cmpAudioMario: fc.ComponentAudio;
  let jumpAudio: fc.Audio;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, update);
    fc.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    let branch: fc.Node = viewport.getBranch();
    marioTransform = branch.getChildrenByName("MarioTransform")[0];
    marioNode = marioTransform.getChildrenByName("Mario")[0];

    enemiesNodes = branch.getChildrenByName("Enemies")[0];
    goombaNodes = enemiesNodes.getChildren();
    marioTransformComponent = marioTransform.getComponent(fc.ComponentTransform);
    createAnimations(_event);

    // let cmpCamera: fc.ComponentCamera = branch.getComponent(fc.ComponentCamera);
    // cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 1.2, -7);

    cmpCamera = viewport.camera;

    let cmpAudio: fc.ComponentAudio = branch.getComponent(fc.ComponentAudio);
    cmpAudio.volume = 1;
    loadJumpAudio();
  }

  let isFacingRight: boolean = true;
  let isWalking: boolean = false;
  let isJumping: boolean = false;
  let alreadyJumped: boolean = false;

  let currentFloorHeight = 0;

  function update(_event: Event): void {
    
    let deltaTime: number = fc.Loop.timeFrameGame / 1000;
    marioVelocityY += gravity * deltaTime;
    pos = marioTransformComponent.mtxLocal.translation;
    if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SPACE]) && !isJumping) {
      if (!alreadyJumped) {
        marioVelocityY = marioJumpHeight;
        isJumping = true;
        alreadyJumped = true;
        cmpAudioMario.play(true);
        currentFloorHeight = -10;
      }
    }
    else if (!fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SPACE])) {
      alreadyJumped = false;
    }

    if (pos.y + marioVelocityY > currentFloorHeight) {
      marioSpriteNode.setAnimation(animationJump);
      currentAnimation = animationJump;
    }
    else if (pos.y <= currentFloorHeight){
      marioVelocityY = 0;
      pos.y = currentFloorHeight;
      marioTransformComponent.mtxLocal.translation = pos;
      isJumping = false;
      if (currentAnimation != animationWalk) {
        marioSpriteNode.setAnimation(animationWalk);
        currentAnimation = animationWalk;
      }
    }

    marioTransformComponent.mtxLocal.translateY(marioVelocityY*deltaTime);

    if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SHIFT_LEFT])) {
      marioWalkSpeed = 8;
      marioSpriteNode.framerate = 30;
    }
    if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.D, fc.KEYBOARD_CODE.ARROW_RIGHT])) {
      if (!isWalking && !isJumping) {
        marioSpriteNode.setAnimation(animationWalk);
        currentAnimation = animationWalk;
        isWalking = true;
      }
      marioTransformComponent.mtxLocal.translateX(deltaTime * marioWalkSpeed);
      if (!isFacingRight) {
        marioSpriteNode.getComponent(fc.ComponentTransform).mtxLocal.rotateY(180);
        isFacingRight = true;
      }
    }
    else if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.A, fc.KEYBOARD_CODE.ARROW_LEFT])) {
      if (!isWalking && !isJumping) {
        marioSpriteNode.setAnimation(animationWalk);
        currentAnimation = animationWalk;
        isWalking = true;
      }
      marioTransformComponent.mtxLocal.translateX(-deltaTime * marioWalkSpeed);
      if (isFacingRight) {
        marioSpriteNode.getComponent(fc.ComponentTransform).mtxLocal.rotateY(180);
        isFacingRight = false;
      }
    }
    else if (!isJumping && !isWalking) {
      marioSpriteNode.setAnimation(animationStand);
      currentAnimation = animationStand;
    }
    else {
      isWalking = false;
    }
    marioWalkSpeed = 4;
    marioSpriteNode.framerate = 15;
    checkCollision();
    //cmpCamera.mtxPivot.translation = new ƒ.Vector3(-pos.x, 1.0, -10);
    updateCamera();
    viewport.draw(); 
  }

  function updateCamera(): void {
    let pos: fc.Vector3 = marioTransformComponent.mtxLocal.translation;
    let origin: fc.Vector3 = cmpCamera.mtxPivot.translation;
    cmpCamera.mtxPivot.translation = new fc.Vector3(- pos.x,origin.y,origin.z);
  }

  function loadJumpAudio(){
    jumpAudio = new ƒ.Audio("./Audio/jumpAudio.wav");
    cmpAudioMario = new ƒ.ComponentAudio(jumpAudio, false, false);
    cmpAudioMario.connect(true);
    cmpAudioMario.volume = 1;
  }

  function checkCollision(): void {
    let floors: fc.Node[] = viewport.getBranch().getChildrenByName("BaseFloor")[0].getChildrenByName("10x2");
    for (let eightByTwo: number = 0; eightByTwo < floors.length; eightByTwo++){
      let currentFloorChunks: fc.Node[] = floors[eightByTwo].getChildrenByName("GroundFloor");
      for (let singleChunk: number = 0; singleChunk < currentFloorChunks.length; singleChunk++) {
        let singleBlocks: fc.Node[] = currentFloorChunks[singleChunk].getChildrenByName("FloorPosition");
        for(let block: number = 0; block < singleBlocks.length; block++) {
          let currentBlock: fc.Node = singleBlocks[block];
          if(Math.abs(pos.x - currentBlock.mtxWorld.translation.x) < 0.5){
            let blockPos: fc.Vector3 = currentBlock.mtxWorld.translation;
            let blockMargin = blockPos.y + 1;
            if(pos.y < blockMargin){
              pos.y = blockMargin;
              marioTransform.mtxLocal.translation = blockPos;
              currentFloorHeight = blockMargin;
              marioVelocityY = 0;
            }
          }
        }
      }
    }
  }


  async function createAnimations(_event: Event): Promise<void> {

    let imgSpriteSheetWalk: fc.TextureImage = new fc.TextureImage();
    await imgSpriteSheetWalk.load("./Textures/mariowalkx16Image.png");
    let coatWalk: fc.CoatTextured = new fc.CoatTextured(undefined, imgSpriteSheetWalk);

    let imgSpriteSheetStand: fc.TextureImage = new fc.TextureImage();
    await imgSpriteSheetStand.load("./Textures/mariowalkx16Stand.png");
    let coatStand: fc.CoatTextured = new fc.CoatTextured(undefined, imgSpriteSheetStand);

    let imgSpriteSheetJump: fc.TextureImage = new fc.TextureImage();
    await imgSpriteSheetJump.load("./Textures/marioJump.png");
    let coatJump: fc.CoatTextured = new fc.CoatTextured(undefined, imgSpriteSheetJump);

    let goombaSpriteSheetWalk: fc.TextureImage = new fc.TextureImage();
    await goombaSpriteSheetWalk.load("./Textures/goombaWalk.png");
    let coatGoomba: fc.CoatTextured = new fc.CoatTextured(undefined, goombaSpriteSheetWalk);

    animationWalk = new ƒAid.SpriteSheetAnimation("Walk", coatWalk);
    animationWalk.generateByGrid(fc.Rectangle.GET(0, 0, 15, 16), 3, 16, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(16));

    animationStand = new ƒAid.SpriteSheetAnimation("Stand", coatStand);
    animationStand.generateByGrid(fc.Rectangle.GET(0, 0, 14, 16), 1, 16, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(16));

    animationJump = new ƒAid.SpriteSheetAnimation("Jump", coatJump);
    animationJump.generateByGrid(fc.Rectangle.GET(0, 0, 16, 16), 1, 16, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(16));

    animationGoomba = new ƒAid.SpriteSheetAnimation("GoombaWalk", coatGoomba);
    animationGoomba.generateByGrid(fc.Rectangle.GET(0, 0, 18, 16), 2, 16, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(16));

    marioSpriteNode = new ƒAid.NodeSprite("Mario");
    marioSpriteNode.addComponent(new fc.ComponentTransform(new fc.Matrix4x4()));
    marioSpriteNode.setAnimation(animationStand);
    marioSpriteNode.setFrameDirection(1);
    marioSpriteNode.mtxLocal.translateY(-0.5);
    marioSpriteNode.framerate = 15;
    marioTransform.removeAllChildren();
    marioTransform.addChild(marioSpriteNode);

    goombaSpriteNode = new ƒAid.NodeSprite("Goomba");
    goombaSpriteNode.addComponent(new fc.ComponentTransform(new fc.Matrix4x4()));
    goombaSpriteNode.setAnimation(animationGoomba);
    goombaSpriteNode.setFrameDirection(1);
    goombaSpriteNode.mtxLocal.translateY(-0.5);
    goombaSpriteNode.mtxLocal.translateX(4);
    goombaSpriteNode.framerate = 2;
    for (let i: number = 0; i < 2; i++) {
      goombaNodes[i].removeAllChildren();
      goombaNodes[i].addChild(goombaSpriteNode);
      goombaNodes[i].mtxLocal.translateX(i + 1);
    }
    goombaSpriteNode.removeAllChildren();
    goombaSpriteNode.addChild(marioSpriteNode);
    //marioNode = marioSpriteNode;
    //ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 100);

  }

}