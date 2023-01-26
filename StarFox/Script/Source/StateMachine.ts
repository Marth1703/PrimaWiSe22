namespace Script {
    import fc = FudgeCore;
    import fAid = FudgeAid;
    fc.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization
  
    enum JOB {
      IDLE, TARGET
    }
  
    export class TurretStateMachine extends fAid.ComponentStateMachine<JOB> {
      public static readonly iSubclass: number = fc.Component.registerSubclass(TurretStateMachine);
      private static instructions: fAid.StateMachineInstructions<JOB> = TurretStateMachine.get();


      public torqueIdle: number = 5;
      private cmpBody: fc.ComponentRigidbody;
      private cmpTurret: fc.ComponentTransform;
      private cmpTurretSphere: fc.ComponentTransform;
      private cmpMaterial: fc.ComponentMaterial;
  
  
      constructor() {
        super();
        this.instructions = TurretStateMachine.instructions; // setup instructions with the static set
  
        // Don't start when running in editor
        if (fc.Project.mode == fc.MODE.EDITOR)
          return;
  
        // Listen to this component being added to or removed from a node
        this.addEventListener(fc.EVENT.COMPONENT_ADD, this.hndEvent);
        this.addEventListener(fc.EVENT.COMPONENT_REMOVE, this.hndEvent);
        this.addEventListener(fc.EVENT.NODE_DESERIALIZED, this.hndEvent);
      }
  
      public static get(): fAid.StateMachineInstructions<JOB> {
        let setup: fAid.StateMachineInstructions<JOB> = new fAid.StateMachineInstructions();
        setup.transitDefault = TurretStateMachine.transitDefault;
        setup.actDefault = TurretStateMachine.actDefault;
        setup.setAction(JOB.IDLE, <fc.General>this.actIdle);
        setup.setAction(JOB.TARGET, <fc.General>this.actTarget);
        setup.setTransition(JOB.IDLE, JOB.TARGET, <fc.General>this.transitOutOfRange);
        return setup;
      }
  
      private static transitDefault(_machine: TurretStateMachine): void {
        console.log("Transit to", _machine.stateNext);
      }
  
      private static async actDefault(_machine: TurretStateMachine): Promise<void> {
        console.log(JOB[_machine.stateCurrent]);
      }
  
      private static async actIdle(_machine: TurretStateMachine): Promise<void> {
        _machine.cmpTurretSphere.mtxLocal.rotateY(2);
        TurretStateMachine.actDefault(_machine);
      }
  
      private static async actTarget(_machine: TurretStateMachine): Promise<void> {
        console.log(JOB[_machine.stateCurrent]);
      }

      private static transitOutOfRange(_machine: TurretStateMachine): void {
        _machine.transit(JOB.IDLE);
      }
  
  
      // Activate the functions of this component as response to events
      private hndEvent = (_event: Event): void => {
        switch (_event.type) {
          case fc.EVENT.COMPONENT_ADD:
            fc.Loop.addEventListener(fc.EVENT.LOOP_FRAME, this.update);
            this.transit(JOB.IDLE);
            break;
          case fc.EVENT.COMPONENT_REMOVE:
            this.removeEventListener(fc.EVENT.COMPONENT_ADD, this.hndEvent);
            this.removeEventListener(fc.EVENT.COMPONENT_REMOVE, this.hndEvent);
            fc.Loop.removeEventListener(fc.EVENT.LOOP_FRAME, this.update);
            break;
          case fc.EVENT.NODE_DESERIALIZED:
            this.cmpBody = this.node.getComponent(fc.ComponentRigidbody);
            this.cmpTurret = this.node.getComponent(fc.ComponentTransform);
            this.cmpTurretSphere = this.node.getChildrenByName("Circle")[0].getComponent(fc.ComponentTransform);
            this.cmpMaterial = this.node.getComponent(fc.ComponentMaterial);

            let distance: fc.ComponentRigidbody = this.node.getChildren()[0].getComponent(fc.ComponentRigidbody);

            // trigger.addEventListener(fc.EVENT_PHYSICS.TRIGGER_EXIT, (_event: fc.EventPhysics) => {
            //   if (this.stateCurrent == JOB.ESCAPE)
            //     this.transit(JOB.IDLE);
            // });
            break;
        }
      }
  
      private update = (_event: Event): void => {
        this.act();
      }
  
  
  
      // protected reduceMutator(_mutator: ƒ.Mutator): void {
      //   // delete properties that should not be mutated
      //   // undefined properties and private fields (#) will not be included by default
      // }
    }
  }