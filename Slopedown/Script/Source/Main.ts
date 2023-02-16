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
  let slopeStart: fc.Vector2 = new fc.Vector2(-420, 58);
  let slopeEnd: fc.Vector2 = new fc.Vector2(480, -21.4);
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
    createRings();
    createTrees();
    createCoins();
    createFences();
    fc.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function stopGame(): void {
    avatar.activate(false);
    componentAudio.play(false);
    vui.final = "Refresh (f5) to restart.";
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

  function createRings(): void {
    let amountRings: number = 11;
    let stepSize: number = 880/(amountRings -1);
    for(let i: number = 0; i < amountRings; i++) {
      let slopeSlope: number = (slopeEnd.y - slopeStart.y) / (slopeEnd.x - slopeStart.x); 
      let slopeIntercept: number = slopeStart.y - slopeSlope * slopeStart.x; 
      let ringX: number = slopeStart.x + i * stepSize + 0.7;
      let ringY: number = slopeSlope * ringX + slopeIntercept -0.7;
      let ringZ: number = fc.random.getRange(-8, 8);
      let ring: RingNode = new RingNode(new fc.Vector3(ringX, ringY, ringZ));
      viewport.getBranch().addChild(ring);
    }
  }

  function createTrees(): void {
    let amountTrees: number = 22;
    let stepSize: number = 880/(amountTrees -1);
    for(let i: number = 0; i < amountTrees; i++) {
      let slopeSlope: number = (slopeEnd.y - slopeStart.y) / (slopeEnd.x - slopeStart.x); 
      let slopeIntercept: number = slopeStart.y - slopeSlope * slopeStart.x; 
      let treeX: number = slopeStart.x + i * stepSize;
      let treeY: number = slopeSlope * treeX + slopeIntercept -0.3;
      let treeZ: number = fc.random.getRange(-8, 8);
      let tree: TreeNode = new TreeNode(new fc.Vector3(treeX, treeY, treeZ));
      viewport.getBranch().addChild(tree);
    }
  }

  function createCoins(): void {
    let amountCoins: number = 10;
    let stepSize: number = 880/(amountCoins -1);
    for(let i: number = 0; i < amountCoins; i++) {
      let slopeSlope: number = (slopeEnd.y - slopeStart.y) / (slopeEnd.x - slopeStart.x); 
      let slopeIntercept: number = slopeStart.y - slopeSlope * slopeStart.x; 
      let coinX: number = slopeStart.x + i * stepSize-0.3;
      let coinY: number = slopeSlope * coinX + slopeIntercept + 0.1;
      let coinZ: number = fc.random.getRange(-8, 8);
      let coin1: CoinNode = new CoinNode(new fc.Vector3(coinX, coinY, coinZ));
      let coin2: CoinNode = new CoinNode(new fc.Vector3(coinX+3, coinY-0.2, coinZ));
      let coin3: CoinNode = new CoinNode(new fc.Vector3(coinX+6, coinY-0.4, coinZ));
      viewport.getBranch().addChild(coin1);
      viewport.getBranch().addChild(coin2);
      viewport.getBranch().addChild(coin3);
    }
  }

  function createFences(): void {
    let amountFences: number = 13;
    let stepSize: number = 880/(amountFences -1);
    for(let i: number = 0; i < amountFences; i++) {
      let slopeSlope: number = (slopeEnd.y - slopeStart.y) / (slopeEnd.x - slopeStart.x); 
      let slopeIntercept: number = slopeStart.y - slopeSlope * slopeStart.x; 
      let fenceX: number = slopeStart.x + i * stepSize;
      let fenceY: number = slopeSlope * fenceX + slopeIntercept + 0.1;
      let fenceZ: number = fc.random.getRange(-8, 8);
      let fence: FenceNode = new FenceNode(new fc.Vector3(fenceX, fenceY, fenceZ));
      viewport.getBranch().addChild(fence);
    }
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