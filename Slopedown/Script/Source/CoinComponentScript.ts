namespace Script {
    import fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization
  
    export class CoinComponentScript extends fc.ComponentScript {
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = fc.Component.registerSubclass(CoinComponentScript);
      // Properties may be mutated by users in the editor via the automatically created user interface
      public message: string = "CoinComponentScript added to ";

      private coinSound: fc.Audio;
      private coinBody: fc.ComponentRigidbody;
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
            this.coinBody = this.node.getComponent(fc.ComponentRigidbody);
            this.coinBody.addEventListener(fc.EVENT_PHYSICS.TRIGGER_ENTER, this.collectCoin);
            this.coinSound = new fc.Audio(".\\Sounds\\coinCollect.mp3");
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

      private collectCoin = (_event: Event): void => {
        if (currentTime/1000 > 2){
          console.log("collected");
          let componentAudio = this.node.getComponent(fc.ComponentAudio);
          componentAudio.setAudio(this.coinSound);
          componentAudio.volume = 0.3;
          componentAudio.play(true);
          currentCoins++;
          this.node.getComponent(fc.ComponentMaterial).activate(false);
        }
      }


  
      // protected reduceMutator(_mutator: ƒ.Mutator): void {
      //   // delete properties that should not be mutated
      //   // undefined properties and private fields (#) will not be included by default
      // }
    }
}