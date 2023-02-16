namespace Script {
    import fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization
  
    export class RingComponentScript extends fc.ComponentScript {
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = fc.Component.registerSubclass(RingComponentScript);
      // Properties may be mutated by users in the editor via the automatically created user interface
      public message: string = "RingComponentScript added to ";

      private boostSound: fc.Audio;
      private boostCylinder: fc.ComponentRigidbody;
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
            //fc.Debug.log(this.message, this.node);
            this.boostCylinder = this.node.getComponent(fc.ComponentRigidbody);
            this.boostCylinder.addEventListener(fc.EVENT_PHYSICS.TRIGGER_ENTER, this.receiveBoost);
            this.boostSound = new fc.Audio(".\\Sounds\\boost.mp3");
            break;
          case fc.EVENT.COMPONENT_REMOVE:
            this.removeEventListener(fc.EVENT.COMPONENT_ADD, this.hndEvent);
            this.removeEventListener(fc.EVENT.COMPONENT_REMOVE, this.hndEvent);
            break;
          case fc.EVENT.NODE_DESERIALIZED:
            break;
          case fc.EVENT.NODE_ACTIVATE:
            break;
        }
      }

      private receiveBoost = (_event: Event): void => {
        if (currentTime/1000 > 2){
          let componentAudio = this.node.getComponent(fc.ComponentAudio);
          componentAudio.setAudio(this.boostSound);
          componentAudio.volume = 2;
          componentAudio.play(true);
          avatar.getComponent(fc.ComponentRigidbody).applyForce(new fc.Vector3(10000, -2000, 0));
        }
      }

  
      // protected reduceMutator(_mutator: ƒ.Mutator): void {
      //   // delete properties that should not be mutated
      //   // undefined properties and private fields (#) will not be included by default
      // }
    }
}