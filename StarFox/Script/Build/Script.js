"use strict";
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends fc.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = fc.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        speed = 1;
        constructor() {
            super();
            // Don't start when running in editor
            if (fc.Project.mode == fc.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* fc.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* fc.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* fc.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* fc.EVENT.COMPONENT_ADD */:
                    fc.Debug.log(this.message, this.node);
                    fc.Loop.addEventListener("loopFrame" /* fc.EVENT.LOOP_FRAME */, this.rotateShip);
                    break;
                case "componentRemove" /* fc.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* fc.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* fc.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* fc.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        rotateShip = (_event) => {
            this.node.mtxLocal.rotateY(this.speed);
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Debug.info("Main Program Template running!");
    let viewport;
    let cmpCamera;
    let StarshipTransformComponent;
    let StarShipRigidComponent;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        cmpCamera = viewport.camera;
        let branch = viewport.getBranch();
        StarshipTransformComponent = branch.getChildrenByName("Spaceship")[0].getComponent(fc.ComponentTransform);
        StarShipRigidComponent = branch.getChildrenByName("Spaceship")[0].getComponent(fc.ComponentRigidbody);
        fc.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        fc.Loop.addEventListener("loopFrame" /* fc.EVENT.LOOP_FRAME */, update);
        cmpCamera.mtxPivot.translate(new fc.Vector3(0, 15, 30));
        cmpCamera.mtxPivot.rotate(new fc.Vector3(10, 180, 0));
    }
    function update(_event) {
        fc.Physics.simulate(); // if physics is included and used
        fc.AudioManager.default.update();
        updateCamera();
        viewport.draw();
    }
    function updateCamera() {
        let pos = StarshipTransformComponent.mtxLocal.translation;
        //let origin: fc.Vector3 = cmpCamera.mtxPivot.translation;
        cmpCamera.mtxPivot.translation = new fc.Vector3(-pos.x, pos.y + 7, -pos.z + 35);
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    let StarshipTransformComponent;
    let StarShipRigidComponent;
    let StarshipSpeed = 0.1;
    let shipVector = new fc.Vector3(0, 0, 0);
    class StarShipScript extends fc.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = fc.Component.registerSubclass(StarShipScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        speed = 1;
        constructor() {
            super();
            // Don't start when running in editor
            if (fc.Project.mode == fc.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* fc.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* fc.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* fc.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* fc.EVENT.COMPONENT_ADD */:
                    fc.Debug.log(this.message, this.node);
                    fc.Loop.addEventListener("loopFrame" /* fc.EVENT.LOOP_FRAME */, this.controlShip);
                    break;
                case "componentRemove" /* fc.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* fc.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* fc.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* fc.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        controlShip = (_event) => {
            StarShipRigidComponent = this.node.getComponent(fc.ComponentRigidbody);
            StarshipTransformComponent = this.node.getComponent(fc.ComponentTransform);
            StarshipTransformComponent.mtxLocal.translateZ(StarshipSpeed);
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.W, fc.KEYBOARD_CODE.ARROW_UP])) {
                let forceVector = new fc.Vector3(0, 0, 10);
                StarShipRigidComponent.applyForce(forceVector);
            }
            else if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.S, fc.KEYBOARD_CODE.ARROW_DOWN])) {
                let forceVector = new fc.Vector3(0, 0, -10);
                StarShipRigidComponent.applyForce(forceVector);
            }
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.D, fc.KEYBOARD_CODE.ARROW_RIGHT])) {
                let forceVector = new fc.Vector3(-30, 0, 0);
                let angularVector = new fc.Vector3(0, 0, 0.01);
                StarShipRigidComponent.applyForce(forceVector);
                if (StarShipRigidComponent.getAngularVelocity().z < 0.1) {
                    StarShipRigidComponent.addAngularVelocity(angularVector);
                }
            }
            else if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.A, fc.KEYBOARD_CODE.ARROW_LEFT])) {
                let forceVector = new fc.Vector3(30, 0, 0);
                let angularVector = new fc.Vector3(0, 0, -0.01);
                StarShipRigidComponent.applyForce(forceVector);
                if (StarShipRigidComponent.getAngularVelocity().z > -0.1) {
                    StarShipRigidComponent.addAngularVelocity(angularVector);
                }
            }
        };
    }
    Script.StarShipScript = StarShipScript;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map