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
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    timeSinceStart = fc.Time.game.get();
    viewport = _event.detail;
    cmpCamera = viewport.camera;
    fetchCameraPosition();
    let branch: fc.Node = viewport.getBranch();
    vui = new VUI();
    currentTime = 0;
    isAirborne = false;
    avatar = branch.getChildrenByName("Avatar")[0];
    currentCoins = 0;
    fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, update);
    branch.addEventListener("fall", stopGame);
    branch.addEventListener("fin", endGame);
    setUpMusic();
    createRing();
    createTree();
    createCoin();
    createFence();
    fc.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function stopGame(): void {
    avatar.activate(false);
    componentAudio.play(false);
  }

  function endGame(): void {
    componentAudio.play(false);
    componentAudio.setAudio(new fc.Audio(".\\Sounds\\victory.mp3"));
    componentAudio.volume = 0.3;
    componentAudio.play(true);
    avatar.activate(false);
    let calculatedScore: number = currentCoins*200 + (60000-currentTime);
    vui.score = "Final Score: " + calculatedScore.toFixed(0);
    vui.final = "Final Time: " + (currentTime/1000).toFixed(3) + "s";
  }

  function setUpMusic(): void {
    componentAudio = new fc.ComponentAudio();
    avatar.addComponent(componentAudio);
    let music: fc.Audio = new fc.Audio(".\\Sounds\\backgroundMusic.mp3");
    componentAudio.setAudio(music);
    componentAudio.volume = 0.1;
    componentAudio.play(true);
  }

  async function fetchCameraPosition(): Promise<void> {
    let response: Response = await fetch("config.json");
    let camAngle: any = await response.json();
    cmpCamera.mtxPivot.translate(new fc.Vector3(camAngle.CameraX, camAngle.CameraY, camAngle.CameraZ));
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
    //initAnim(coin);
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
    vui.time = "Time: " + (currentTime / 1000).toFixed(3) + "s";
    vui.coins = "Coins: " + currentCoins;
  }
}