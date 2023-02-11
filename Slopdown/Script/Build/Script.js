"use strict";
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class AvatarComponentScript extends fc.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = fc.Component.registerSubclass(AvatarComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        rigidbody;
        currentVelocity;
        isJumping;
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
                    this.isJumping = false;
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
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
                if (!this.isJumping) {
                    this.jump();
                }
            }
        };
        moveRight() {
            if (this.rigidbody.getVelocity().z < 0) {
                this.rigidbody.setVelocity(new fc.Vector3(this.currentVelocity.x, this.currentVelocity.y, 1.5));
            }
            this.rigidbody.applyForce(new fc.Vector3(0, 0, 100));
        }
        moveLeft() {
            if (this.rigidbody.getVelocity().z > 0) {
                this.rigidbody.setVelocity(new fc.Vector3(this.currentVelocity.x, this.currentVelocity.y, -1.5));
            }
            this.rigidbody.applyForce(new fc.Vector3(0, 0, -100));
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
        jump() {
            console.log("hi");
            this.isJumping = true;
            if (this.currentVelocity.y < 0) {
                let jumpheight = 0;
                while (true) {
                    jumpheight += 0.1;
                    console.log(jumpheight);
                    if (!fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SPACE])) {
                        console.log("raus da");
                        break;
                    }
                }
                this.rigidbody.setVelocity(new fc.Vector3(this.currentVelocity.x, jumpheight, this.currentVelocity.z));
            }
            this.isJumping = false;
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
    let cmpCamera;
    let Avatar;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        Script.viewport = _event.detail;
        cmpCamera = Script.viewport.camera;
        Script.vui = new Script.VUI();
        let branch = Script.viewport.getBranch();
        Avatar = branch.getChildrenByName("Avatar")[0];
        fc.Loop.addEventListener("loopFrame" /* fc.EVENT.LOOP_FRAME */, update);
        cmpCamera.mtxPivot.translate(new fc.Vector3(0, 2, -20));
        InitPhysics();
        fc.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        fc.Physics.simulate(); // if physics is included and used
        Script.viewport.draw();
        fc.AudioManager.default.update();
    }
    function InitPhysics() {
        let rigidbody = Avatar.getComponent(fc.ComponentRigidbody);
        rigidbody.friction = 0.00;
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    var fui = FudgeUserInterface;
    class VUI extends fc.Mutable {
        reduceMutator(_mutator) { }
        velocity;
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