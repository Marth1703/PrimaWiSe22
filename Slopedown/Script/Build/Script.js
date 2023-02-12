"use strict";
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class AvatarComponentScript extends fc.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "AvatarComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        fc.Debug.log(this.message, this.node);
                        fc.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.handleInputs);
                        fc.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* NODE_DESERIALIZED */:
                        this.rigidbody = this.node.getComponent(fc.ComponentRigidbody);
                        this.currentVelocity = new fc.Vector3(0, 0, 0);
                        this.jumpHeight = 0;
                        break;
                }
            };
            this.update = (_event) => {
                Script.vui.velocity = "Speed: " + Math.floor(this.currentVelocity.x) + " mph";
            };
            // protected reduceMutator(_mutator: ƒ.Mutator): void {
            //   // delete properties that should not be mutated
            //   // undefined properties and private fields (#) will not be included by default
            // }
            this.handleInputs = (_event) => {
                this.currentVelocity = this.rigidbody.getVelocity();
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
                if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SPACE])) {
                    this.addJumpVelocity();
                }
                else {
                    if (this.jumpHeight > 1) {
                        this.applyJumpVelocity(this.jumpHeight);
                    }
                    this.jumpHeight = 0;
                }
            };
            // Don't start when running in editor
            if (fc.Project.mode == fc.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        addJumpVelocity() {
            if (this.currentVelocity.y < 0) {
                this.jumpHeight += 0.15;
                console.log(this.jumpHeight);
            }
        }
        applyJumpVelocity(velo) {
            if (!Script.isAirborne) {
                if (velo < 10) {
                    this.rigidbody.setVelocity(new fc.Vector3(this.currentVelocity.x, velo, this.currentVelocity.z));
                }
                else {
                    this.rigidbody.setVelocity(new fc.Vector3(this.currentVelocity.x, 10, this.currentVelocity.z));
                }
                Script.isAirborne = true;
            }
        }
        moveRight() {
            if (this.rigidbody.getVelocity().z < -3) {
                this.rigidbody.setVelocity(new fc.Vector3(this.currentVelocity.x, this.currentVelocity.y, 2.5));
            }
            this.rigidbody.applyForce(new fc.Vector3(0, 0, 25));
        }
        moveLeft() {
            if (this.rigidbody.getVelocity().z > 3) {
                this.rigidbody.setVelocity(new fc.Vector3(this.currentVelocity.x, this.currentVelocity.y, -2.5));
            }
            this.rigidbody.applyForce(new fc.Vector3(0, 0, -25));
        }
        moveForward() {
            this.rigidbody.setVelocity(new fc.Vector3(this.currentVelocity.x + 1, this.currentVelocity.y, this.currentVelocity.z));
            if (this.currentVelocity.x > 20) {
                this.rigidbody.setVelocity(new fc.Vector3(20, this.currentVelocity.y, this.currentVelocity.z));
            }
        }
        moveBrake() {
            this.rigidbody.setVelocity(new fc.Vector3(this.currentVelocity.x - 1, this.currentVelocity.y, this.currentVelocity.z));
            if (this.currentVelocity.x < 2) {
                this.rigidbody.setVelocity(new fc.Vector3(2, this.currentVelocity.y, this.currentVelocity.z));
            }
        }
    }
    // Register the script as component for use in the editor via drag&drop
    AvatarComponentScript.iSubclass = fc.Component.registerSubclass(AvatarComponentScript);
    Script.AvatarComponentScript = AvatarComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "CustomComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        ƒ.Debug.log(this.message, this.node);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* NODE_DESERIALIZED */:
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    // Register the script as component for use in the editor via drag&drop
    CustomComponentScript.iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Debug.info("Main Program Template running!");
    let cmpCamera;
    let Avatar;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        Script.viewport = _event.detail;
        cmpCamera = Script.viewport.camera;
        Script.vui = new Script.VUI();
        Script.currentTime = 0;
        Script.isAirborne = true;
        let branch = Script.viewport.getBranch();
        Avatar = branch.getChildrenByName("Avatar")[0];
        fc.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        cmpCamera.mtxPivot.translate(new fc.Vector3(0, 2, -20));
        InitPhysics();
        createRing();
        fc.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function createRing() {
        let ring = new Script.RingNode();
        Script.viewport.getBranch().addChild(ring);
        console.log("WWWWWWWWWWWWWWWWWW");
        console.log(ring);
    }
    function update(_event) {
        fc.Physics.simulate(); // if physics is included and used
        Script.viewport.draw();
        fc.AudioManager.default.update();
        Script.currentTime = fc.Time.game.get();
        Script.vui.time = "Time: " + (Script.currentTime / 1000).toFixed(3) + "s";
    }
    function InitPhysics() {
        let rigidbody = Avatar.getComponent(fc.ComponentRigidbody);
        rigidbody.friction = 0.00;
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class RingComponentScript extends fc.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "RingComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        fc.Debug.log(this.message, this.node);
                        this.boostCylinder = this.node.getComponent(fc.ComponentRigidbody);
                        this.boostCylinder.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.receiveBoost);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* NODE_DESERIALIZED */:
                        break;
                    case "nodeActivate" /* NODE_ACTIVATE */:
                        break;
                }
            };
            this.receiveBoost = (_event) => {
                if (Script.currentTime / 1000 > 2 /* TODO: Execute boost effect*/) {
                    console.log("boosted");
                }
            };
            // Don't start when running in editor
            if (fc.Project.mode == fc.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    // Register the script as component for use in the editor via drag&drop
    RingComponentScript.iSubclass = fc.Component.registerSubclass(RingComponentScript);
    Script.RingComponentScript = RingComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    class RingNode extends fc.Node {
        constructor() {
            super("Ring");
            let innerRing = new fc.Node("boostCylinder");
            let outerRingTorus = new fc.MeshTorus("outerRingM", 0.08, 15, 10);
            let innerRingTorus = new fc.MeshTorus("innerRingM", 0.05, 15, 10);
            let outerRingMesh = new fc.ComponentMesh(outerRingTorus);
            let innerRingMesh = new fc.ComponentMesh(innerRingTorus);
            outerRingMesh.mtxPivot.scaling = new fc.Vector3(10, 10, 7);
            innerRingMesh.mtxPivot.scaling = new fc.Vector3(9, 9, 6);
            let outerMat = new fc.Material("ringMaterialOut", fc.ShaderGouraud);
            let innerMat = new fc.Material("ringMaterialIn", fc.ShaderLit);
            let outerMatComp = new fc.ComponentMaterial(outerMat);
            let innerMatComp = new fc.ComponentMaterial(innerMat);
            outerMatComp.clrPrimary = new fc.Color(0.31, 0.41, 0.6);
            innerMatComp.clrPrimary = new fc.Color(0.97, 0.86, 0.21);
            let outerRingTransform = new fc.ComponentTransform();
            outerRingTransform.mtxLocal.translation = new fc.Vector3(-90, 28, -6);
            outerRingTransform.mtxLocal.rotateZ(85);
            let outerRingRigidBody = new fc.ComponentRigidbody();
            outerRingRigidBody.isTrigger = true;
            outerRingRigidBody.effectGravity = 0;
            outerRingRigidBody.mtxPivot.translateX(1);
            outerRingRigidBody.mtxPivot.scaling = new fc.Vector3(4, 1, 1.5);
            let ringScript = new Script.RingComponentScript();
            this.addComponent(outerRingMesh);
            this.addComponent(outerMatComp);
            this.addComponent(outerRingTransform);
            this.addComponent(outerRingRigidBody);
            this.addComponent(ringScript);
            innerRing.addComponent(innerRingMesh);
            innerRing.addComponent(innerMatComp);
            this.addChild(innerRing);
        }
    }
    Script.RingNode = RingNode;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class SlopeComponentScript extends fc.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "SlopeComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        fc.Debug.log(this.message, this.node);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* NODE_DESERIALIZED */:
                        this.deathPlane = this.node.getChildrenByName("Deathplane")[0].getComponent(fc.ComponentRigidbody);
                        this.colliderPlane = this.node.getChildrenByName("Colliderplane")[0].getComponent(fc.ComponentRigidbody);
                        this.deathPlane.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.enteredDeathPlane);
                        this.colliderPlane.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.onSlope);
                        break;
                }
            };
            this.enteredDeathPlane = (_event) => {
                if (Script.currentTime / 1000 > 2 /* TODO: Add variable for earliest death time */) {
                    console.log("playerDied");
                }
            };
            this.onSlope = (_event) => {
                if (Script.currentTime / 1000 > 2 /* TODO: Add variable aswell */) {
                    Script.isAirborne = false;
                }
            };
            // Don't start when running in editor
            if (fc.Project.mode == fc.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    // Register the script as component for use in the editor via drag&drop
    SlopeComponentScript.iSubclass = fc.Component.registerSubclass(SlopeComponentScript);
    Script.SlopeComponentScript = SlopeComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    var fui = FudgeUserInterface;
    class VUI extends fc.Mutable {
        constructor() {
            super();
            this.controller = new fui.Controller(this, document.querySelector("#vui"));
            console.log(this.controller);
        }
        reduceMutator(_mutator) { }
    }
    Script.VUI = VUI;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map