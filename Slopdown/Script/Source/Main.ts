namespace Script {
  import fc = FudgeCore;
  fc.Debug.info("Main Program Template running!");

  let viewport: fc.Viewport;
  let cmpCamera: fc.ComponentCamera;
  let Avatar: fc.Node;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    cmpCamera = viewport.camera;
    let branch: fc.Node = viewport.getBranch();
    Avatar = branch.getChildrenByName("Avatar")[0];
    fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, update);
    cmpCamera.mtxPivot.translate(new fc.Vector3(0, 2, -20));
    InitPhysics();
    fc.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    fc.Physics.simulate();  // if physics is included and used
    viewport.draw();
    fc.AudioManager.default.update();
  }

  function InitPhysics(): void {
    let rigidbody: fc.ComponentRigidbody = Avatar.getComponent(fc.ComponentRigidbody);
    rigidbody.friction = 0.00;
  }

}