namespace Script {
  import fc = FudgeCore;
  fc.Debug.info("Main Program Template running!");

  let viewport: fc.Viewport;

  let cmpCamera: fc.ComponentCamera;

  export let cmpTerrain: fc.ComponentMesh;

  let StarShip: fc.Node;

  let StarshipTransformComponent: fc.ComponentTransform;

  let StarShipRigidComponent: fc.ComponentRigidbody;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function generateCubes(n: number): void {

    let cubeMesh: fc.MeshCube = new fc.MeshCube("cubeMesh");

    let material: fc.Material = new fc.Material("cubeShader", fc.ShaderLit);
    let randZ: number;
    let randY: number;
    let randX: number;
    let colorR: number;
    let colorG: number;
    let colorB: number;
    for (let i: number = 0; i < n; i++) {
      let nodeCube: fc.Node = new fc.Node("cube" + i);
      randX = fc.random.getRange(-1000, 1000);
      randY = fc.random.getRange(15, 30);
      randZ = fc.random.getRange(-1000, 1000);

      let componentMesh: fc.ComponentMesh = new fc.ComponentMesh(cubeMesh);
      let componentMaterial: fc.ComponentMaterial = new fc.ComponentMaterial(material);
      let componentTransform: fc.ComponentTransform = new fc.ComponentTransform();
      let componentRigidbody: fc.ComponentRigidbody = new fc.ComponentRigidbody();

      colorR = fc.random.getRange(0, 1);
      colorG = fc.random.getRange(0, 1);
      colorB = fc.random.getRange(0, 1);
      componentMaterial.clrPrimary = new fc.Color(colorR, colorG, colorB, 1)

      componentTransform.mtxLocal.translation = new fc.Vector3(randX, randY, randZ);
      componentTransform.mtxLocal.scale(new fc.Vector3(5, 5, 5));
      componentRigidbody.effectGravity = 0;
      componentRigidbody.mass = 0.001;
      componentRigidbody.setScaling(new fc.Vector3(5, 5, 5));
      nodeCube.addComponent(componentMesh);
      nodeCube.addComponent(componentMaterial);
      nodeCube.addComponent(componentTransform);
      nodeCube.addComponent(componentRigidbody);
      viewport.getBranch().addChild(nodeCube);
    }

  }

  function start(_event: CustomEvent): void {
  
    viewport = _event.detail;
    cmpCamera = viewport.camera;
    let branch: fc.Node = viewport.getBranch();
    cmpTerrain = branch.getChildrenByName("Floor")[0].getComponent(fc.ComponentMesh);
    StarshipTransformComponent = branch.getChildrenByName("Spaceship")[0].getComponent(fc.ComponentTransform);    
    StarShipRigidComponent = branch.getChildrenByName("Spaceship")[0].getComponent(fc.ComponentRigidbody);
    fc.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, update);
    cmpCamera.mtxPivot.translate(new fc.Vector3(0, 4, -30));

    StarShip = branch.getChildrenByName("Spaceship")[0];

    generateCubes(50);
  }

  function update(_event: Event): void {
    fc.Physics.simulate();  // if physics is included and used
    fc.AudioManager.default.update();
    viewport.draw();
  }
}