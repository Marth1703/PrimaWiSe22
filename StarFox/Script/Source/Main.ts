namespace Script {
  import fc = FudgeCore;
  fc.Debug.info("Main Program Template running!");

  let viewport: fc.Viewport;

  let cmpCamera: fc.ComponentCamera;

  let StarshipTransformComponent: fc.ComponentTransform;

  let StarShipRigidComponent: fc.ComponentRigidbody;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
  
    viewport = _event.detail;
    cmpCamera = viewport.camera;
    
    let branch: fc.Node = viewport.getBranch();
    StarshipTransformComponent = branch.getChildrenByName("Spaceship")[0].getComponent(fc.ComponentTransform);    
    StarShipRigidComponent = branch.getChildrenByName("Spaceship")[0].getComponent(fc.ComponentRigidbody);
    fc.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, update);
    cmpCamera.mtxPivot.translate(new fc.Vector3(0, 4, -30));

  }

  function update(_event: Event): void {
    fc.Physics.simulate();  // if physics is included and used
    fc.AudioManager.default.update();
    viewport.draw();
  }
}