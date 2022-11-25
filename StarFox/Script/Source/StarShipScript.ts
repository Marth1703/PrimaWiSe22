namespace Script {
    import fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization
  
    let StarshipTransformComponent: fc.ComponentTransform;

    let StarShipRigidComponent: fc.ComponentRigidbody;

    let StarshipSpeed: number = 0.1;

    let shipVector: fc.Vector3 = new fc.Vector3(0, 0, 0);

    export class StarShipScript extends fc.ComponentScript {
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = fc.Component.registerSubclass(StarShipScript);
      // Properties may be mutated by users in the editor via the automatically created user interface
      public message: string = "CustomComponentScript added to ";
  
      public speed: number = 1;
  

      private relativeX: fc.Vector3;
      private relativeY: fc.Vector3;
      private relativeZ: fc.Vector3;

      public strafeThrust: number = 2000;
      public forwardthrust: number = 5000;

      constructor() {
        super();
  
        // Don't start when running in editor
        if (fc.Project.mode == fc.MODE.EDITOR)
          return;
  
        // Listen to this component being added to or removed from a node
        this.addEventListener(fc.EVENT.COMPONENT_ADD, this.hndEvent);
        this.addEventListener(fc.EVENT.COMPONENT_REMOVE, this.hndEvent);
        this.addEventListener(fc.EVENT.NODE_DESERIALIZED, this.hndEvent);
      }
  
      // Activate the functions of this component as response to events
      public hndEvent = (_event: Event): void => {
        switch (_event.type) {
          case fc.EVENT.COMPONENT_ADD:
            fc.Debug.log(this.message, this.node);
            fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, this.controlShip)
            window.addEventListener("mousemove", this.handleMouse);
            break;
          case fc.EVENT.COMPONENT_REMOVE:
            this.removeEventListener(fc.EVENT.COMPONENT_ADD, this.hndEvent);
            this.removeEventListener(fc.EVENT.COMPONENT_REMOVE, this.hndEvent);
            break;
          case fc.EVENT.NODE_DESERIALIZED:
            // if deserialized the node is now fully reconstructed and access to all its components and children is possible
            break;
        }
      }
  
      public controlShip = (_event: Event): void => {
        StarShipRigidComponent = this.node.getComponent(fc.ComponentRigidbody);
        StarshipTransformComponent = this.node.getComponent(fc.ComponentTransform);
        this.setRelativeAxes();

        if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.W])) {
            this.thrust();
            //StarShipRigidComponent.applyTorque(fc.Vector3.SCALE(this.relativeX, 1));
        }
  
        if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.S])) {
            this.backwards();
            //StarShipRigidComponent.applyTorque(fc.Vector3.SCALE(this.relativeX, -1));
        }
  
        if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.A])) {
          this.rollLeft();
        }
  
        if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.D])) {
          this.rollRight();
        }
  
        StarShipRigidComponent.applyTorque(new fc.Vector3(0, this.xAxis * -5, 0));
        StarShipRigidComponent.applyTorque(fc.Vector3.SCALE(this.relativeX, this.yAxis * 1.5));
        StarShipRigidComponent.applyTorque(fc.Vector3.SCALE(this.relativeZ, this.xAxis))
        
      }

    private width: number = 0;
    private height: number = 0;
    private xAxis: number = 0;
    private yAxis: number = 0;

    handleMouse = (e: MouseEvent): void => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      let mousePositionY: number = e.clientY;
      let mousePositionX: number = e.clientX;

      this.xAxis = 2 * (mousePositionX / this.width) - 1;
      this.yAxis = 2 * (mousePositionY / this.height) - 1.2;
        
    }

      setRelativeAxes(): void {
        this.relativeZ = fc.Vector3.TRANSFORMATION(new fc.Vector3(0, 0, 5), fc.Matrix4x4.ROTATION(this.node.mtxWorld.rotation));
        this.relativeY = fc.Vector3.TRANSFORMATION(new fc.Vector3(0, 5, 0), fc.Matrix4x4.ROTATION(this.node.mtxWorld.rotation));
        this.relativeX = fc.Vector3.TRANSFORMATION(new fc.Vector3(5, 0, 0), fc.Matrix4x4.ROTATION(this.node.mtxWorld.rotation));
      }
  
      backwards(): void {
        StarShipRigidComponent.applyForce(fc.Vector3.SCALE(this.relativeZ, -this.forwardthrust));
      }
  
      thrust(): void {
        let scaledRotatedDirection: fc.Vector3 = fc.Vector3.SCALE(this.relativeZ, this.forwardthrust);
        StarShipRigidComponent.applyForce(scaledRotatedDirection);
      }
  
  
      rollLeft(): void {
        StarShipRigidComponent.applyTorque(fc.Vector3.SCALE(this.relativeZ, -2));
      }
  
  
      rollRight(): void {
        StarShipRigidComponent.applyTorque(fc.Vector3.SCALE(this.relativeZ, 2))
      }
  
      // protected reduceMutator(_mutator: ƒ.Mutator): void {
      //   // delete properties that should not be mutated
      //   // undefined properties and private fields (#) will not be included by default
      // }
    }
  }