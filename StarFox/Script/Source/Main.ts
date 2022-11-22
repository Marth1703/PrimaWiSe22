namespace Script {
  import fc = FudgeCore;
  fc.Debug.info("Main Program Template running!");

  let viewport: fc.Viewport;

  let cmpCamera: fc.ComponentCamera;

  let StarshipTransformComponent: fc.ComponentTransform;

  let StarshipSpeed: number;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
  
    viewport = _event.detail;
    cmpCamera = viewport.camera;
    cmpCamera.mtxPivot.rotateY(180);

    let branch: fc.Node = viewport.getBranch();

    StarshipTransformComponent = branch.getChildrenByName("SpaceshipPosition")[0].getComponent(fc.ComponentTransform);    
    StarshipSpeed = 0.1;
    fc.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, update);
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    fc.AudioManager.default.update();
    StarshipTransformComponent.mtxLocal.translateZ(StarshipSpeed);
    updateCamera();
    viewport.draw();
  }

  function updateCamera(): void {
    let pos: fc.Vector3 = StarshipTransformComponent.mtxLocal.translation;
    //let origin: fc.Vector3 = cmpCamera.mtxPivot.translation;
    cmpCamera.mtxPivot.translation = new fc.Vector3(pos.x, pos.y + 4, -pos.z + 25);
  }
}