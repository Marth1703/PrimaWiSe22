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
        cmpCamera.mtxPivot.translate(new fc.Vector3(0, 4, -30));
    }
    function update(_event) {
        fc.Physics.simulate(); // if physics is included and used
        fc.AudioManager.default.update();
        viewport.draw();
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
        relativeX;
        relativeY;
        relativeZ;
        strafeThrust = 2000;
        forwardthrust = 5000;
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
                    window.addEventListener("mousemove", this.handleMouse);
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
            StarShipRigidComponent.applyTorque(fc.Vector3.SCALE(this.relativeZ, this.xAxis));
        };
        width = 0;
        height = 0;
        xAxis = 0;
        yAxis = 0;
        handleMouse = (e) => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            let mousePositionY = e.clientY;
            let mousePositionX = e.clientX;
            this.xAxis = 2 * (mousePositionX / this.width) - 1;
            this.yAxis = 2 * (mousePositionY / this.height) - 1.2;
        };
        setRelativeAxes() {
            this.relativeZ = fc.Vector3.TRANSFORMATION(new fc.Vector3(0, 0, 5), fc.Matrix4x4.ROTATION(this.node.mtxWorld.rotation));
            this.relativeY = fc.Vector3.TRANSFORMATION(new fc.Vector3(0, 5, 0), fc.Matrix4x4.ROTATION(this.node.mtxWorld.rotation));
            this.relativeX = fc.Vector3.TRANSFORMATION(new fc.Vector3(5, 0, 0), fc.Matrix4x4.ROTATION(this.node.mtxWorld.rotation));
        }
        backwards() {
            StarShipRigidComponent.applyForce(fc.Vector3.SCALE(this.relativeZ, -this.forwardthrust));
        }
        thrust() {
            let scaledRotatedDirection = fc.Vector3.SCALE(this.relativeZ, this.forwardthrust);
            StarShipRigidComponent.applyForce(scaledRotatedDirection);
        }
        rollLeft() {
            StarShipRigidComponent.applyTorque(fc.Vector3.SCALE(this.relativeZ, -2));
        }
        rollRight() {
            StarShipRigidComponent.applyTorque(fc.Vector3.SCALE(this.relativeZ, 2));
        }
    }
    Script.StarShipScript = StarShipScript;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map