namespace Script {
  import fc = FudgeCore;

  fc.Debug.info("Main Program Template running!");

  export let viewport: fc.Viewport;
  export let vui: VUI;
  export let currentTime: number;
  export let isAirborne: boolean;
  export let avatar: fc.Node;

  let background: fc.Node;
  let timeSinceStart: number;
  let cmpCamera: fc.ComponentCamera;
  let Avatar: fc.Node;
  let avatarStartingPoint: fc.Vector3;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    timeSinceStart = fc.Time.game.get();
    viewport = _event.detail;
    cmpCamera = viewport.camera;
    vui = new VUI(); 
    currentTime = 0;
    isAirborne = false;
    avatar = viewport.getBranch().getChildrenByName("Avatar")[0];
    avatarStartingPoint = avatar.mtxLocal.translation;
    background = viewport.getBranch().getChildrenByName("Background")[0];
    let branch: fc.Node = viewport.getBranch();
    Avatar = branch.getChildrenByName("Avatar")[0];
    fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, update);
    cmpCamera.mtxPivot.translate(new fc.Vector3(0, 2, -20));
    InitPhysics();
    createRing();
    createTree();
    fc.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function createRing(): void {
    let ring: RingNode = new RingNode();
    viewport.getBranch().addChild(ring);
  }

  function createTree(): void {
    let tree: TreeNode = new TreeNode();
    viewport.getBranch().addChild(tree);
  }

  function update(_event: Event): void {
    fc.Physics.simulate();  // if physics is included and used
    viewport.draw();
    fc.AudioManager.default.update();
    currentTime = fc.Time.game.get() - timeSinceStart;
    vui.time = "Time: " + (currentTime/1000).toFixed(3) + "s";
  }

  function InitPhysics(): void {
    let rigidbody: fc.ComponentRigidbody = Avatar.getComponent(fc.ComponentRigidbody);
    rigidbody.friction = 0.00;
  }

}