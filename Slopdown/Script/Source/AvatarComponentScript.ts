namespace Script {
    import fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class AvatarComponentScript extends fc.ComponentScript {
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = fc.Component.registerSubclass(AvatarComponentScript);
      // Properties may be mutated by users in the editor via the automatically created user interface
      public message: string = "CustomComponentScript added to ";
    
      private rigidbody: fc.ComponentRigidbody;

      private currentVelocity: fc.Vector3;
  
      private isJumping: boolean;
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
            fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, this.handleInputs)
            fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, this.update)
            break;
          case fc.EVENT.COMPONENT_REMOVE:
            this.removeEventListener(fc.EVENT.COMPONENT_ADD, this.hndEvent);
            this.removeEventListener(fc.EVENT.COMPONENT_REMOVE, this.hndEvent);
            break;
          case fc.EVENT.NODE_DESERIALIZED:
            this.rigidbody = this.node.getComponent(fc.ComponentRigidbody);
            this.currentVelocity = new fc.Vector3(0, 0, 0);
            this.isJumping = false;
            // if deserialized the node is now fully reconstructed and access to all its components and children is possible
            break;
        }
      }
  
      private update = (_event: Event): void =>{
        vui.velocity = "Speed: " + Math.floor(this.currentVelocity.x) + " mph";
      }

      // protected reduceMutator(_mutator: ƒ.Mutator): void {
      //   // delete properties that should not be mutated
      //   // undefined properties and private fields (#) will not be included by default
      // }
      
      public handleInputs = (_event: Event): void => {
        this.currentVelocity = this.rigidbody.getVelocity();
        //console.log(this.rigidbody.getVelocity().y);
        if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.W, fc.KEYBOARD_CODE.ARROW_UP])) {
          this.moveForward();
        }
        if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.A, fc.KEYBOARD_CODE.ARROW_LEFT])) {
          this.moveLeft();
        }
        if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.S, fc.KEYBOARD_CODE.ARROW_DOWN])) {
          this.moveBrake();
        }
        if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.D, fc.KEYBOARD_CODE.ARROW_RIGHT])) {
          this.moveRight();
        }
        if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SPACE]) && !this.isJumping) {
          if(!this.isJumping){
            this.jump();
          }
        }
      }

      moveRight(): void {
        if(this.rigidbody.getVelocity().z < 0){
          this.rigidbody.setVelocity(new fc.Vector3(this.currentVelocity.x, this.currentVelocity.y, 1.5));
        }
        this.rigidbody.applyForce(new fc.Vector3(0,0,100));
      }

      moveLeft(): void {
        if(this.rigidbody.getVelocity().z > 0){
          this.rigidbody.setVelocity(new fc.Vector3(this.currentVelocity.x, this.currentVelocity.y, -1.5));
        }
        this.rigidbody.applyForce(new fc.Vector3(0,0,-100));
      }

      moveForward(): void {
        this.rigidbody.setVelocity(new fc.Vector3(this.currentVelocity.x + 1, this.currentVelocity.y, this.currentVelocity.z));
        if(this.currentVelocity.x > 20) {
          this.rigidbody.setVelocity(new fc.Vector3(20, this.currentVelocity.y, this.currentVelocity.z));
        }
      }

      moveBrake(): void {
        this.rigidbody.setVelocity(new fc.Vector3(this.currentVelocity.x -1, this.currentVelocity.y, this.currentVelocity.z))
        if(this.currentVelocity.x < 2) {
          this.rigidbody.setVelocity(new fc.Vector3(2, this.currentVelocity.y, this.currentVelocity.z));
        }
      }

      jump(): void {
        console.log("hi");
        this.isJumping = true;
        if(this.currentVelocity.y < 0){
          let jumpheight = 0;
          while(true) {
            jumpheight += 0.1;
            console.log(jumpheight);
            if(!fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SPACE])){
              console.log("raus da");
              break;
            }
          }
          this.rigidbody.setVelocity(new fc.Vector3(this.currentVelocity.x, jumpheight, this.currentVelocity.z));
        }
        this.isJumping = false;
      }
    }
  }