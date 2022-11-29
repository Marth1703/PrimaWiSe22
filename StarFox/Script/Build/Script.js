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
    function generateCubes(n) {
        let cubeMesh = new fc.MeshCube("cubeMesh");
        let material = new fc.Material("cubeShader", fc.ShaderLit);
        let randZ;
        let randY;
        let randX;
        let colorR;
        let colorG;
        let colorB;
        for (let i = 0; i < n; i++) {
            let nodeCube = new fc.Node("cube" + i);
            randX = fc.random.getRange(-1000, 1000);
            randY = fc.random.getRange(15, 30);
            randZ = fc.random.getRange(-1000, 1000);
            let componentMesh = new fc.ComponentMesh(cubeMesh);
            let componentMaterial = new fc.ComponentMaterial(material);
            let componentTransform = new fc.ComponentTransform();
            let componentRigidbody = new fc.ComponentRigidbody();
            colorR = fc.random.getRange(0, 1);
            colorG = fc.random.getRange(0, 1);
            colorB = fc.random.getRange(0, 1);
            componentMaterial.clrPrimary = new fc.Color(colorR, colorG, colorB, 1);
            componentTransform.mtxLocal.translation = new fc.Vector3(randX, randY, randZ);
            componentTransform.mtxLocal.scale(new fc.Vector3(5, 5, 5));
            componentRigidbody.effectGravity = 0;
            componentRigidbody.mass = 0.001;
            componentRigidbody.setScaling(new fc.Vector3(5, 5, 5));
            nodeCube.addComponent(componentMesh);
            nodeCube.addComponent(componentMaterial);
            nodeCube.addComponent(componentTransform);
            nodeCube.addComponent(componentRigidbody);
            viewport.getBranch().addChild(nodeCube);
        }
    }
    function start(_event) {
        viewport = _event.detail;
        cmpCamera = viewport.camera;
        let branch = viewport.getBranch();
        StarshipTransformComponent = branch.getChildrenByName("Spaceship")[0].getComponent(fc.ComponentTransform);
        StarShipRigidComponent = branch.getChildrenByName("Spaceship")[0].getComponent(fc.ComponentRigidbody);
        fc.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        fc.Loop.addEventListener("loopFrame" /* fc.EVENT.LOOP_FRAME */, update);
        cmpCamera.mtxPivot.translate(new fc.Vector3(0, 4, -30));
        generateCubes(300);
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
            this.thrust();
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.W])) {
                //this.thrust();
                StarShipRigidComponent.applyTorque(fc.Vector3.SCALE(this.relativeX, 3));
            }
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.S])) {
                //this.backwards();
                StarShipRigidComponent.applyTorque(fc.Vector3.SCALE(this.relativeX, -3));
            }
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.A])) {
                this.rollLeft();
            }
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.D])) {
                this.rollRight();
            }
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.ARROW_LEFT])) {
                StarShipRigidComponent.applyTorque(fc.Vector3.SCALE(this.relativeY, 3));
            }
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.ARROW_RIGHT])) {
                StarShipRigidComponent.applyTorque(fc.Vector3.SCALE(this.relativeY, -3));
            }
            if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SHIFT_LEFT])) {
                this.thrustBoost();
                //StarShipRigidComponent.applyTorque(fc.Vector3.SCALE(this.relativeX, 1));
            }
            // StarShipRigidComponent.applyTorque(new fc.Vector3(0, this.xAxis * -6, 0));
            // StarShipRigidComponent.applyTorque(fc.Vector3.SCALE(this.relativeX, this.yAxis * 1.5));
            // StarShipRigidComponent.applyTorque(fc.Vector3.SCALE(this.relativeZ, this.xAxis))
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
        thrustBoost() {
            let scaledRotatedDirection = fc.Vector3.SCALE(this.relativeZ, this.forwardthrust * 10);
            StarShipRigidComponent.applyForce(scaledRotatedDirection);
        }
        rollLeft() {
            StarShipRigidComponent.applyTorque(fc.Vector3.SCALE(this.relativeZ, -10));
        }
        rollRight() {
            StarShipRigidComponent.applyTorque(fc.Vector3.SCALE(this.relativeZ, 10));
        }
    }
    Script.StarShipScript = StarShipScript;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map