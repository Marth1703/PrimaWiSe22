namespace Script {
  import fc = FudgeCore;
  import ƒAid = FudgeAid;
  fc.Debug.info("Main Program Template running!");

  let viewport: fc.Viewport;
  let deltaTime: number;
  let pos: fc.Vector3;

  let marioSpriteNode: ƒAid.NodeSprite;
  let goombaSpriteNode: ƒAid.NodeSprite;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  let marioTransform: fc.Node;
  let marioNode: fc.Node;
  let marioTransformComponent: fc.ComponentTransform;

  let enemiesNodes: fc.Node;
  let goombaNodes: fc.Node[];

  let gravity: number = -2.5;
  let marioWalkSpeed: number = 5;
  let marioVelocityY: number = 0;
  let marioJumpHeight: number = 0.5;

  let animationWalk: ƒAid.SpriteSheetAnimation;
  let animationStand: ƒAid.SpriteSheetAnimation;
  let animationGoomba: ƒAid.SpriteSheetAnimation;
  let animationJump: ƒAid.SpriteSheetAnimation;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, update);
    fc.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    console.log(viewport);
    let branch: fc.Node = viewport.getBranch();
    console.log(branch);
    marioTransform = branch.getChildrenByName("MarioTransform")[0];
    marioNode = marioTransform.getChildrenByName("Mario")[0];

    enemiesNodes = branch.getChildrenByName("Enemies")[0];
    goombaNodes = enemiesNodes.getChildren();
    marioTransformComponent = marioTransform.getComponent(fc.ComponentTransform);
    console.log("Mario:");
    hndLoad(_event);
    
  }

  let isFacingRight: boolean = true;
  let isWalking: boolean = false;
  let isJumping: boolean = false;
  let alreadyJumped: boolean = false;

  function update(_event: Event): void {
    deltaTime = fc.Loop.timeFrameGame/1000;
    marioVelocityY += gravity*deltaTime;
    marioTransformComponent.mtxLocal.translateY(marioVelocityY);
    
    pos = marioTransformComponent.mtxLocal.translation;

    if(fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SPACE]) && !isJumping){ 
      if(!alreadyJumped){
        marioVelocityY = marioJumpHeight;
        isJumping = true;
        alreadyJumped = true;
      }
    }
    else if(!fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SPACE])) {
      alreadyJumped = false;
    }

    if (pos.y + marioVelocityY > 0){
      marioSpriteNode.setAnimation(animationJump);
      marioTransformComponent.mtxLocal.translateY(marioVelocityY*deltaTime);
    }
    else {
      marioVelocityY = 0;
      pos.y = 0;
      marioTransformComponent.mtxLocal.translation = pos;
      isJumping = false;
    }

    if(fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SHIFT_LEFT])){ 
      marioWalkSpeed = 10;
      marioSpriteNode.framerate = 30;
    }
    if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.D, fc.KEYBOARD_CODE.ARROW_RIGHT])) {
      if (!isWalking && !isJumping){
        marioSpriteNode.setAnimation(animationWalk);
        isWalking = true;   
      }   
      marioTransformComponent.mtxLocal.translateX(deltaTime * marioWalkSpeed);
      if (!isFacingRight) {
        marioSpriteNode.getComponent(fc.ComponentTransform).mtxLocal.rotateY(180);
        isFacingRight = true;
      }
    }
    else if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.A, fc.KEYBOARD_CODE.ARROW_LEFT])) {
      if (!isWalking && !isJumping){
        marioSpriteNode.setAnimation(animationWalk);
        isWalking = true;   
      }
      marioTransformComponent.mtxLocal.translateX(-deltaTime * marioWalkSpeed);
      if (isFacingRight) {
        marioSpriteNode.getComponent(fc.ComponentTransform).mtxLocal.rotateY(180);
        isFacingRight = false;
      }
    }
    else if(!isJumping) {
      marioSpriteNode.setAnimation(animationStand);
      isWalking = false;
    }
    marioWalkSpeed = 5;
    marioSpriteNode.framerate = 15;
    viewport.draw();

  }

  async function hndLoad(_event: Event): Promise<void> {

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
    goombaSpriteNode.framerate = 2;
    for(let i:number = 0; i < 2; i++){
      goombaNodes[i].removeAllChildren();
      goombaNodes[i].addChild(goombaSpriteNode);
      goombaNodes[i].mtxLocal.translateX(i+1);
    }
    goombaSpriteNode.removeAllChildren();
    goombaSpriteNode.addChild(marioSpriteNode);
    //marioNode = marioSpriteNode;
    //ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 100);

  }

}