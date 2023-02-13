"use strict";
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class AvatarComponentScript extends fc.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = fc.Component.registerSubclass(AvatarComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "AvatarComponentScript added to ";
        rigidbody;
        currentVelocity;
        jumpHeight;
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
                    fc.Loop.addEventListener("loopFrame" /* fc.EVENT.LOOP_FRAME */, this.handleInputs);
                    fc.Loop.addEventListener("loopFrame" /* fc.EVENT.LOOP_FRAME */, this.update);
                    break;
                case "componentRemove" /* fc.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* fc.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* fc.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* fc.EVENT.NODE_DESERIALIZED */:
                    this.rigidbody = this.node.getComponent(fc.ComponentRigidbody);
                    this.currentVelocity = new fc.Vector3(0, 0, 0);
                    this.jumpHeight = 0;
                    break;
            }
        };
        update = (_event) => {
            Script.vui.velocity = "Speed: " + Math.floor(this.currentVelocity.x) + " mph";
        };
        // protected reduceMutator(_mutator: ƒ.Mutator): void {
        //   // delete properties that should not be mutated
        //   // undefined properties and private fields (#) will not be included by default
        // }
        handleInputs = (_event) => {
            this.currentVelocity = this.rigidbody.getVelocity();
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.W, fc.KEYBOARD_CODE.ARROW_UP])) {
                this.moveForward();
            }
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.S, fc.KEYBOARD_CODE.ARROW_DOWN])) {
                this.moveBrake();
            }
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.A, fc.KEYBOARD_CODE.ARROW_LEFT])) {
                this.moveLeft();
            }
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.D, fc.KEYBOARD_CODE.ARROW_RIGHT])) {
                this.moveRight();
            }
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SPACE])) {
                this.addJumpVelocity();
            }
            else {
                if (this.jumpHeight > 1.5) {
                    this.applyJumpVelocity(this.jumpHeight);
                }
                this.jumpHeight = 0;
            }
        };
        addJumpVelocity() {
            if (this.currentVelocity.y < 0) {
                this.jumpHeight += 0.15;
                console.log(this.jumpHeight);
            }
        }
        applyJumpVelocity(velo) {
            if (!Script.isAirborne) {
                if (velo < 10) {
                    this.rigidbody.applyForce(new fc.Vector3(0, velo * 500, 0));
                }
                else {
                    this.rigidbody.applyForce(new fc.Vector3(0, 5000, 0));
                }
                Script.isAirborne = true;
            }
        }
        moveRight() {
            if (this.currentVelocity.z < 5) {
                this.rigidbody.applyForce(new fc.Vector3(0, 0, 100));
            }
        }
        moveLeft() {
            if (this.currentVelocity.z > -5) {
                this.rigidbody.applyForce(new fc.Vector3(0, 0, -100));
            }
        }
        moveForward() {
            if (this.currentVelocity.x < 2000) {
                this.rigidbody.applyForce(new fc.Vector3(200, -3, 0));
            }
        }
        moveBrake() {
            if (this.currentVelocity.x > 2) {
                this.rigidbody.applyForce(new fc.Vector3(-20, 0, 0));
            }
        }
    }
    Script.AvatarComponentScript = AvatarComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Debug.info("Main Program Template running!");
    let background;
    let timeSinceStart;
    let cmpCamera;
    let Avatar;
    let avatarStartingPoint;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        timeSinceStart = fc.Time.game.get();
        Script.viewport = _event.detail;
        cmpCamera = Script.viewport.camera;
        Script.vui = new Script.VUI();
        Script.currentTime = 0;
        Script.isAirborne = false;
        Script.avatar = Script.viewport.getBranch().getChildrenByName("Avatar")[0];
        avatarStartingPoint = Script.avatar.mtxLocal.translation;
        background = Script.viewport.getBranch().getChildrenByName("Background")[0];
        let branch = Script.viewport.getBranch();
        Avatar = branch.getChildrenByName("Avatar")[0];
        fc.Loop.addEventListener("loopFrame" /* fc.EVENT.LOOP_FRAME */, update);
        cmpCamera.mtxPivot.translate(new fc.Vector3(0, 2, -20));
        InitPhysics();
        createRing();
        createTree();
        fc.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function createRing() {
        let ring = new Script.RingNode();
        Script.viewport.getBranch().addChild(ring);
    }
    function createTree() {
        let tree = new Script.TreeNode();
        Script.viewport.getBranch().addChild(tree);
    }
    function update(_event) {
        fc.Physics.simulate(); // if physics is included and used
        Script.viewport.draw();
        fc.AudioManager.default.update();
        Script.currentTime = fc.Time.game.get() - timeSinceStart;
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
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = fc.Component.registerSubclass(RingComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "RingComponentScript added to ";
        boostCylinder;
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
                    this.boostCylinder = this.node.getComponent(fc.ComponentRigidbody);
                    this.boostCylinder.addEventListener("TriggerEnteredCollision" /* fc.EVENT_PHYSICS.TRIGGER_ENTER */, this.receiveBoost);
                    break;
                case "componentRemove" /* fc.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* fc.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* fc.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* fc.EVENT.NODE_DESERIALIZED */:
                    break;
                case "nodeActivate" /* fc.EVENT.NODE_ACTIVATE */:
                    break;
            }
        };
        receiveBoost = (_event) => {
            if (Script.currentTime / 1000 > 2 /* TODO: Execute boost effect*/) {
                console.log("boosted");
                Script.avatar.getComponent(fc.ComponentRigidbody).applyForce(new fc.Vector3(10000, -2000, 0));
            }
        };
    }
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
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = fc.Component.registerSubclass(SlopeComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "SlopeComponentScript added to ";
        deathPlane;
        colliderPlane;
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
                    break;
                case "componentRemove" /* fc.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* fc.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* fc.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* fc.EVENT.NODE_DESERIALIZED */:
                    this.deathPlane = this.node.getChildrenByName("Deathplane")[0].getComponent(fc.ComponentRigidbody);
                    this.colliderPlane = this.node.getChildrenByName("Colliderplane")[0].getComponent(fc.ComponentRigidbody);
                    this.deathPlane.addEventListener("TriggerEnteredCollision" /* fc.EVENT_PHYSICS.TRIGGER_ENTER */, this.enteredDeathPlane);
                    this.colliderPlane.addEventListener("TriggerEnteredCollision" /* fc.EVENT_PHYSICS.TRIGGER_ENTER */, this.onSlope);
                    break;
            }
        };
        enteredDeathPlane = (_event) => {
            if (Script.currentTime / 1000 > 2 /* TODO: Add variable for earliest death time */) {
                console.log("playerDied");
            }
        };
        onSlope = (_event) => {
            if (Script.currentTime / 1000 > 1 /* TODO: Add variable aswell */) {
                Script.isAirborne = false;
            }
        };
    }
    Script.SlopeComponentScript = SlopeComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    class TreeNode extends fc.Node {
        constructor() {
            super("Tree");
            let leaves = new fc.Node("leaves");
            let trunkRot = new fc.MeshRotation("trunk", [new fc.Vector2(0.3, 0.5), new fc.Vector2(0.4, -1)], 12);
            let leavesPyramid = new fc.MeshPyramid("leaves");
            let trunkMesh = new fc.ComponentMesh(trunkRot);
            let leavesMesh = new fc.ComponentMesh(leavesPyramid);
            trunkMesh.mtxPivot.rotation = new fc.Vector3(180, 0, 90);
            leavesMesh.mtxPivot.scaling = new fc.Vector3(2, 4, 2);
            leavesMesh.mtxPivot.rotation = new fc.Vector3(180, fc.random.getRange(0, 90), 90);
            let trunkMat = new fc.Material("trunkMat", fc.ShaderLit);
            let leavesMat = new fc.Material("leavesMat", fc.ShaderLit);
            let trunkMatComp = new fc.ComponentMaterial(trunkMat);
            let leavesMatComp = new fc.ComponentMaterial(leavesMat);
            trunkMatComp.clrPrimary = new fc.Color(0.58, 0.30, 0);
            leavesMatComp.clrPrimary = new fc.Color(0, 0.4, 0);
            let trunkTransform = new fc.ComponentTransform();
            let leavesTransform = new fc.ComponentTransform();
            trunkTransform.mtxLocal.translation = new fc.Vector3(-350, 51.5, -6);
            trunkTransform.mtxLocal.rotateZ(85);
            leavesTransform.mtxLocal.translateX(0.5);
            let trunkRigidBody = new fc.ComponentRigidbody();
            let leavesRigidBody = new fc.ComponentRigidbody();
            trunkRigidBody.typeBody = fc.BODY_TYPE.STATIC;
            trunkRigidBody.effectGravity = 0;
            trunkRigidBody.mtxPivot.scaling = new fc.Vector3(0.9, 1, 1);
            leavesRigidBody.typeBody = fc.BODY_TYPE.STATIC;
            leavesRigidBody.effectGravity = 0;
            leavesRigidBody.mtxPivot.translateX(1);
            leavesRigidBody.mtxPivot.scaling = new fc.Vector3(2.5, 4, 1);
            this.addComponent(trunkMesh);
            this.addComponent(trunkMatComp);
            this.addComponent(trunkTransform);
            this.addComponent(trunkRigidBody);
            leaves.addComponent(leavesMesh);
            leaves.addComponent(leavesMatComp);
            leaves.addComponent(leavesTransform);
            leaves.addComponent(leavesRigidBody);
            this.addChild(leaves);
        }
    }
    Script.TreeNode = TreeNode;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    var fui = FudgeUserInterface;
    class VUI extends fc.Mutable {
        reduceMutator(_mutator) { }
        velocity;
        time;
        controller;
        constructor() {
            super();
            this.controller = new fui.Controller(this, document.querySelector("#vui"));
            console.log(this.controller);
        }
    }
    Script.VUI = VUI;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map