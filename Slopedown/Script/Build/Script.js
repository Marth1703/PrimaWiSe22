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
            if (this.currentVelocity.x < 30) {
                this.rigidbody.applyForce(new fc.Vector3(200, -3, 0));
            }
        }
        moveBrake() {
            if (this.currentVelocity.x > 2) {
                this.rigidbody.applyForce(new fc.Vector3(-20, 0, 0));
            }
        }
    }
    // Register the script as component for use in the editor via drag&drop
    AvatarComponentScript.iSubclass = fc.Component.registerSubclass(AvatarComponentScript);
    Script.AvatarComponentScript = AvatarComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CoinComponentScript extends fc.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "CoinComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        fc.Debug.log(this.message, this.node);
                        this.coinBody = this.node.getComponent(fc.ComponentRigidbody);
                        this.coinBody.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.collectCoin);
                        this.coinSound = new fc.Audio(".\\Sounds\\coinCollect.mp3");
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
            this.collectCoin = (_event) => {
                if (Script.currentTime / 1000 > 2) {
                    console.log("collected");
                    let componentAudio = this.node.getComponent(fc.ComponentAudio);
                    componentAudio.setAudio(this.coinSound);
                    componentAudio.volume = 0.3;
                    componentAudio.play(true);
                    Script.currentCoins++;
                    this.node.getComponent(fc.ComponentMaterial).activate(false);
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
    CoinComponentScript.iSubclass = fc.Component.registerSubclass(CoinComponentScript);
    Script.CoinComponentScript = CoinComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    class CoinNode extends fc.Node {
        constructor(_cords) {
            super("Coin");
            let coinTorus = new fc.MeshTorus("Cointorus", -0.250, 7, 6);
            let coinMesh = new fc.ComponentMesh(coinTorus);
            coinMesh.mtxPivot.scaling = new fc.Vector3(2, 1, 2);
            let coinTexture = new fc.TextureImage();
            let coinCoat = new fc.CoatTextured(undefined, coinTexture);
            let coinMat = new fc.Material("coinMat", fc.ShaderLitTextured);
            coinTexture.load(".\\Textures\\goldcoin.png");
            coinMat.coat = coinCoat;
            let coinMatComp = new fc.ComponentMaterial(coinMat);
            coinMatComp.mtxPivot.scaling = new fc.Vector2(1, 6);
            let coinTransform = new fc.ComponentTransform();
            coinTransform.mtxLocal.translation = new fc.Vector3(-307, 48, _cords);
            coinTransform.mtxLocal.rotateZ(85);
            let coinRigidBody = new fc.ComponentRigidbody();
            coinRigidBody.isTrigger = true;
            coinRigidBody.effectGravity = 0;
            coinRigidBody.mtxPivot.scaling = new fc.Vector3(0.9, 0.3, 0.9);
            coinRigidBody.typeBody = fc.BODY_TYPE.STATIC;
            let coinAudio = new fc.ComponentAudio();
            let coinScript = new Script.CoinComponentScript();
            this.addComponent(coinMesh);
            this.addComponent(coinMatComp);
            this.addComponent(coinTransform);
            this.addComponent(coinRigidBody);
            this.addComponent(coinAudio);
            this.addComponent(coinScript);
        }
    }
    Script.CoinNode = CoinNode;
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
    class FenceNode extends fc.Node {
        constructor() {
            super("Fence");
            let Leg1 = new fc.Node("leg1");
            let Leg2 = new fc.Node("leg2");
            let FenceCube = new fc.MeshCube("fence");
            let Leg1Cube = new fc.MeshCube("Leg1C");
            let Leg2Cube = new fc.MeshCube("Leg2C");
            let FenceMesh = new fc.ComponentMesh(FenceCube);
            let Leg1Mesh = new fc.ComponentMesh(Leg1Cube);
            let Leg2Mesh = new fc.ComponentMesh(Leg2Cube);
            FenceMesh.mtxPivot.scaling = new fc.Vector3(0.3, 1, 4);
            Leg1Mesh.mtxPivot.scaling = new fc.Vector3(0.4, 2, 0.4);
            Leg2Mesh.mtxPivot.scaling = new fc.Vector3(0.4, 2, 0.4);
            let woodTexture = new fc.TextureImage();
            let fenceCoat = new fc.CoatTextured(undefined, woodTexture);
            let woodMat = new fc.Material("coinMat", fc.ShaderLitTextured);
            woodTexture.load(".\\Textures\\woodtexture.png");
            woodMat.coat = fenceCoat;
            let woodMatComp = new fc.ComponentMaterial(woodMat);
            let woodMatComp2 = new fc.ComponentMaterial(woodMat);
            let woodMatComp3 = new fc.ComponentMaterial(woodMat);
            let FenceTransform = new fc.ComponentTransform();
            let Leg1Transform = new fc.ComponentTransform();
            let Leg2Transform = new fc.ComponentTransform();
            FenceTransform.mtxLocal.translation = new fc.Vector3(-370, 53.5, -6);
            Leg1Transform.mtxLocal.translation = new fc.Vector3(0.2, -0.2, 1.2);
            Leg2Transform.mtxLocal.translation = new fc.Vector3(0.2, -0.2, -1.2);
            let FenceRigidBody = new fc.ComponentRigidbody();
            FenceRigidBody.typeBody = fc.BODY_TYPE.STATIC;
            FenceRigidBody.effectGravity = 0;
            FenceRigidBody.mtxPivot.translation = new fc.Vector3(0.1, -0.1, 0);
            FenceRigidBody.mtxPivot.scaling = new fc.Vector3(0.7, 2, 4.1);
            FenceRigidBody.mtxPivot.rotateZ(-4);
            this.addComponent(FenceMesh);
            this.addComponent(woodMatComp);
            this.addComponent(FenceTransform);
            this.addComponent(FenceRigidBody);
            Leg1.addComponent(Leg1Mesh);
            Leg1.addComponent(woodMatComp2);
            Leg1.addComponent(Leg1Transform);
            Leg2.addComponent(Leg2Mesh);
            Leg2.addComponent(woodMatComp3);
            Leg2.addComponent(Leg2Transform);
            this.addChild(Leg1);
            this.addChild(Leg2);
        }
    }
    Script.FenceNode = FenceNode;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Debug.info("Main Program Template running!");
    let timeSinceStart;
    let cmpCamera;
    let AvatarStartingPosition;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        timeSinceStart = fc.Time.game.get();
        Script.viewport = _event.detail;
        cmpCamera = Script.viewport.camera;
        let branch = Script.viewport.getBranch();
        Script.vui = new Script.VUI();
        Script.currentTime = 0;
        Script.isAirborne = false;
        Script.avatar = branch.getChildrenByName("Avatar")[0];
        AvatarStartingPosition = Script.avatar.getComponent(fc.ComponentTransform).mtxLocal.translation;
        Script.currentCoins = 0;
        fc.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        branch.addEventListener("fall", respawn);
        cmpCamera.mtxPivot.translate(new fc.Vector3(0, 2, -20));
        setUpMusic();
        //InitPhysics();
        createRing();
        createTree();
        createCoin();
        createFence();
        setAvatar();
        let cmpListener = new fc.ComponentAudioListener();
        cmpCamera.node.addComponent(cmpListener);
        fc.AudioManager.default.listenWith(cmpListener);
        fc.AudioManager.default.listenTo(branch);
        fc.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function setAvatar() {
        let aavatar = new fc.Node("Avatar");
        let AvatarCube = new fc.MeshCube("avaCube");
        let AvatarMesh = new fc.ComponentMesh(AvatarCube);
        let AvatarMat = new fc.Material("AvatarMat", fc.ShaderLit);
        let AvatarMatComp = new fc.ComponentMaterial(AvatarMat);
        AvatarMatComp.clrPrimary = new fc.Color(0.99, 0.1, 0.1);
        let AvatarTransform = new fc.ComponentTransform();
        AvatarTransform.mtxLocal.translation = new fc.Vector3(-430, 58.4, 0);
        AvatarTransform.mtxLocal.rotateY(90);
        let AvatarRigidBody = new fc.ComponentRigidbody();
        AvatarRigidBody.initialization = fc.BODY_INIT.TO_MESH;
        AvatarRigidBody.friction;
        Script.avatar.addComponent(cmpCamera);
    }
    function setUpMusic() {
        Script.componentAudio = new fc.ComponentAudio();
        Script.avatar.addComponent(Script.componentAudio);
        let music = new fc.Audio(".\\Sounds\\backgroundMusic.mp3");
        Script.componentAudio.setAudio(music);
        Script.componentAudio.volume = 0.1;
        Script.componentAudio.play(true);
    }
    function createRing() {
        let ring = new Script.RingNode();
        Script.viewport.getBranch().addChild(ring);
    }
    function createTree() {
        let tree = new Script.TreeNode();
        Script.viewport.getBranch().addChild(tree);
    }
    function createCoin() {
        let coin = new Script.CoinNode(3);
        let coin1 = new Script.CoinNode(-3);
        let coin2 = new Script.CoinNode(0);
        Script.viewport.getBranch().addChild(coin);
        Script.viewport.getBranch().addChild(coin1);
        Script.viewport.getBranch().addChild(coin2);
    }
    function createFence() {
        let fence = new Script.FenceNode();
        Script.viewport.getBranch().addChild(fence);
    }
    function update(_event) {
        fc.Physics.simulate(); // if physics is included and used
        Script.viewport.draw();
        fc.AudioManager.default.update();
        Script.currentTime = fc.Time.game.get() - timeSinceStart;
        Script.vui.time = "Time: " + (Script.currentTime / 1000).toFixed(3) + "s";
        Script.vui.coins = "Coins: " + Script.currentCoins;
    }
    function InitPhysics() {
        let rigidbody = Script.avatar.getComponent(fc.ComponentRigidbody);
        rigidbody.friction = 0;
    }
    function respawn() {
        console.log("WWWWWWWWWWWWWWWWWWWWW");
        Script.avatar.activate(false);
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
                        this.boostSound = new fc.Audio(".\\Sounds\\boost.mp3");
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
                if (Script.currentTime / 1000 > 2) {
                    console.log("boosted");
                    let componentAudio = this.node.getComponent(fc.ComponentAudio);
                    componentAudio.setAudio(this.boostSound);
                    componentAudio.volume = 1.5;
                    componentAudio.play(true);
                    Script.avatar.getComponent(fc.ComponentRigidbody).applyForce(new fc.Vector3(10000, -2000, 0));
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
            let ringAudio = new fc.ComponentAudio();
            let ringScript = new Script.RingComponentScript();
            this.addComponent(outerRingMesh);
            this.addComponent(outerMatComp);
            this.addComponent(outerRingTransform);
            this.addComponent(outerRingRigidBody);
            this.addComponent(ringAudio);
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
                        this.deathPlane.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.playerRespawn);
                        this.colliderPlane.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.onSlope);
                        break;
                }
            };
            this.onSlope = (_event) => {
                if (Script.currentTime / 1000 > 1) {
                    Script.isAirborne = false;
                }
            };
            this.playerRespawn = () => {
                if (Script.currentTime / 1000 > 2) {
                    console.log("WWWWADADADA");
                    this.node.dispatchEvent(new CustomEvent("fall", { bubbles: true }));
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