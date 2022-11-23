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
        StarshipTransformComponent.mtxLocal.translateZ(StarshipSpeed);

        if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.W, fc.KEYBOARD_CODE.ARROW_UP])) {
            let forceVector: fc.Vector3 = new fc.Vector3(0, 0, 10);
            StarShipRigidComponent.applyForce(forceVector);
        }

        else if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.S, fc.KEYBOARD_CODE.ARROW_DOWN])) {
            let forceVector: fc.Vector3 = new fc.Vector3(0, 0, -10);
            StarShipRigidComponent.applyForce(forceVector);
        }

        if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.D, fc.KEYBOARD_CODE.ARROW_RIGHT])) {
            let forceVector: fc.Vector3 = new fc.Vector3(-30, 0, 0);
            let angularVector: fc.Vector3 = new fc.Vector3(0, 0, 0.01);
            StarShipRigidComponent.applyForce(forceVector);
            
            if (StarShipRigidComponent.getAngularVelocity().z < 0.1){
                StarShipRigidComponent.addAngularVelocity(angularVector);
            }
        }

        else if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.A, fc.KEYBOARD_CODE.ARROW_LEFT])) {
            let forceVector: fc.Vector3 = new fc.Vector3(30, 0, 0);
            let angularVector: fc.Vector3 = new fc.Vector3(0, 0, -0.01);
            StarShipRigidComponent.applyForce(forceVector);
            if (StarShipRigidComponent.getAngularVelocity().z > -0.1 ){
                StarShipRigidComponent.addAngularVelocity(angularVector);
            }
        }
      }
  
      // protected reduceMutator(_mutator: ƒ.Mutator): void {
      //   // delete properties that should not be mutated
      //   // undefined properties and private fields (#) will not be included by default
      // }
    }
  }