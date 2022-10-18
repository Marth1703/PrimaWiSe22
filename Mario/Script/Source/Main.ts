namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let marioSpriteNode: ƒAid.NodeSprite;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  let marioTransform: ƒ.Node;
  let marioNode: ƒ.Node;
  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    console.log(viewport);
    let branch: ƒ.Node = viewport.getBranch();
    console.log(branch);
    marioTransform = branch.getChildrenByName("MarioTransform")[0];
    marioNode = marioTransform.getChildrenByName("Mario")[0];
    console.log("Mario:");

    hndLoad(_event);
  }

  let tempPos: number = 1;
  function update(_event: Event): void {
    // ƒ.Physics.simulate();
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
      tempPos += 0.1;
      ƒ.AudioManager.default.update();
      marioTransform.getComponent(ƒ.ComponentTransform).mtxLocal.translateX(0.15 * Math.sin(tempPos));
    }
    // else{
    //   marioTransform.removeAllChildren();
    //   marioTransform.addChild(marioNode);
    // }
    viewport.draw();

  }

  async function hndLoad(_event: Event): Promise<void> {

    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("./Textures/mariowalkx16Image.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

    let animation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("Walk", coat);
    animation.generateByGrid(ƒ.Rectangle.GET(0, 0, 15, 16), 3, 16, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));

    marioSpriteNode = new ƒAid.NodeSprite("Sprite");
    marioSpriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    marioSpriteNode.setAnimation(animation);
    marioSpriteNode.setFrameDirection(1);
    marioSpriteNode.mtxLocal.translateY(-0.5);
    marioSpriteNode.framerate = 12;
    marioTransform.removeAllChildren();
    marioTransform.addChild(marioSpriteNode);
    //marioNode = marioSpriteNode;


    viewport.draw();

    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 100);

  }

}