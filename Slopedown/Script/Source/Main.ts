namespace Script {
  import fc = FudgeCore;

  fc.Debug.info("Main Program Template running!");

  export let viewport: fc.Viewport;
  export let vui: VUI;
  export let currentTime: number;
  export let isAirborne: boolean;
  export let avatar: fc.Node;
  export let currentCoins: number;
  export let componentAudio: fc.ComponentAudio;
  let timeSinceStart: number;
  let cmpCamera: fc.ComponentCamera;
  let AvatarStartingPosition: fc.Vector3;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    timeSinceStart = fc.Time.game.get();
    viewport = _event.detail;
    cmpCamera = viewport.camera;
    let branch: fc.Node = viewport.getBranch();
    vui = new VUI(); 
    currentTime = 0;
    isAirborne = false;
    avatar = branch.getChildrenByName("Avatar")[0];
    AvatarStartingPosition = avatar.getComponent(fc.ComponentTransform).mtxLocal.translation;
    currentCoins = 0;
    fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, update);
    branch.addEventListener("fall", respawn);
    cmpCamera.mtxPivot.translate(new fc.Vector3(0, 2, -20));
    setUpMusic();
    //InitPhysics();
    createRing();
    createTree();
    createCoin();
    createFence();

    setAvatar();

    let cmpListener : fc.ComponentAudioListener  = new fc.ComponentAudioListener();
    cmpCamera.node.addComponent(cmpListener);
    fc.AudioManager.default.listenWith(cmpListener);
    fc.AudioManager.default.listenTo(branch);

    fc.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function setAvatar(): void {

    let aavatar: fc.Node = new fc.Node("Avatar");
    let AvatarCube: fc.MeshCube = new fc.MeshCube("avaCube");
    let AvatarMesh: fc.ComponentMesh = new fc.ComponentMesh(AvatarCube);
    let AvatarMat: fc.Material = new fc.Material("AvatarMat", fc.ShaderLit);
    let AvatarMatComp: fc.ComponentMaterial = new fc.ComponentMaterial(AvatarMat);
    AvatarMatComp.clrPrimary= new fc.Color(0.99, 0.1, 0.1);
    let AvatarTransform: fc.ComponentTransform = new fc.ComponentTransform();
    AvatarTransform.mtxLocal.translation = new fc.Vector3(-430, 58.4, 0);
    AvatarTransform.mtxLocal.rotateY(90);
    let AvatarRigidBody: fc.ComponentRigidbody = new fc.ComponentRigidbody();
    AvatarRigidBody.initialization = fc.BODY_INIT.TO_MESH;
    AvatarRigidBody.friction
    avatar.addComponent(cmpCamera);
  }

  function setUpMusic(): void {
    componentAudio = new fc.ComponentAudio();
    avatar.addComponent(componentAudio);
    let music: fc.Audio = new fc.Audio(".\\Sounds\\backgroundMusic.mp3");
    componentAudio.setAudio(music);
    componentAudio.volume = 0.1;
    componentAudio.play(true);
  }

  function createRing(): void {
    let ring: RingNode = new RingNode();
    viewport.getBranch().addChild(ring);
  }

  function createTree(): void {
    let tree: TreeNode = new TreeNode();
    viewport.getBranch().addChild(tree);
  }

  function createCoin(): void {
    let coin: CoinNode = new CoinNode(3);
    let coin1: CoinNode = new CoinNode(-3);
    let coin2: CoinNode = new CoinNode(0);
    viewport.getBranch().addChild(coin);
    viewport.getBranch().addChild(coin1);
    viewport.getBranch().addChild(coin2);
  }

  function createFence(): void {
    let fence: FenceNode = new FenceNode();
    viewport.getBranch().addChild(fence);
  }

  function update(_event: Event): void {
    fc.Physics.simulate();  // if physics is included and used
    viewport.draw();
    fc.AudioManager.default.update();
    currentTime = fc.Time.game.get() - timeSinceStart;
    vui.time = "Time: " + (currentTime/1000).toFixed(3) + "s";
    vui.coins = "Coins: " + currentCoins;
  }

  function InitPhysics(): void {
    let rigidbody: fc.ComponentRigidbody = avatar.getComponent(fc.ComponentRigidbody);
    rigidbody.friction = 0;
  }

  function respawn(): void {
    console.log("WWWWWWWWWWWWWWWWWWWWW");
    avatar.activate(false);
  }

}