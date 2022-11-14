"use strict";
var Script;
(function (Script) {
    var fc = FudgeCore;
    var ƒAid = FudgeAid;
    let ACTION;
    (function (ACTION) {
        ACTION[ACTION["IDLE"] = 0] = "IDLE";
        ACTION[ACTION["WALK"] = 1] = "WALK";
        ACTION[ACTION["SPRINT"] = 2] = "SPRINT";
    })(ACTION = Script.ACTION || (Script.ACTION = {}));
    class Avatar extends ƒAid.NodeSprite {
        speedWalk = .9;
        speedSprint = 2;
        ySpeed = 0;
        xSpeed = 0;
        animationCurrent;
        animWalk;
        animJump;
        constructor() {
            super("AvatarInstance");
            this.addComponent(new fc.ComponentTransform());
        }
        update(_deltaTime) {
            this.ySpeed -= Script.gravity * _deltaTime;
            let yOffset = this.ySpeed * _deltaTime;
            this.mtxLocal.translateY(yOffset);
            this.mtxLocal.translateX(this.xSpeed * _deltaTime, true);
        }
        act(_action) {
            let animation;
            this.xSpeed = 0;
            switch (_action) {
                case ACTION.WALK:
                    this.xSpeed = this.speedWalk;
                    animation = this.animWalk;
                    break;
                case ACTION.SPRINT:
                    this.xSpeed = this.speedSprint;
                    break;
                case ACTION.IDLE:
                    this.showFrame(0);
                    animation = this.animWalk;
                    break;
            }
            if (animation != this.animationCurrent) {
                this.setAnimation(animation);
                this.animationCurrent = animation;
            }
        }
        async initializeAnimations(_imgSpriteSheet) {
            let coat = new fc.CoatTextured(undefined, _imgSpriteSheet);
            this.animWalk = new ƒAid.SpriteSheetAnimation("Walk", coat);
            this.animWalk.generateByGrid(fc.Rectangle.GET(0, 0, 15, 16), 3, 16, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(16));
            this.animJump = new ƒAid.SpriteSheetAnimation("Jump", coat);
            this.animJump.generateByGrid(fc.Rectangle.GET(0, 0, 16, 16), 1, 16, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(16));
            this.framerate = 20;
        }
    }
    Script.Avatar = Avatar;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    fc.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CubeRotatorScript extends fc.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = fc.Component.registerSubclass(CubeRotatorScript);
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
                    fc.Loop.addEventListener("loopFrame" /* fc.EVENT.LOOP_FRAME */, this.rotateCube);
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
        rotateCube = (_event) => {
            this.node.mtxLocal.rotateY(this.speed);
        };
    }
    Script.CubeRotatorScript = CubeRotatorScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fc = FudgeCore;
    var ƒAid = FudgeAid;
    let viewport;
    let pos;
    let marioSpriteNode;
    let goombaSpriteNode;
    document.addEventListener("interactiveViewportStarted", start);
    let marioTransform;
    let marioNode;
    let marioTransformComponent;
    let enemiesNodes;
    let goombaNodes;
    Script.gravity = -90;
    let marioWalkSpeed = 5;
    let marioVelocityY = 0;
    let marioJumpHeight = 18.5;
    let animationWalk;
    let animationStand;
    let animationGoomba;
    let animationJump;
    let currentAnimation;
    let cmpCamera;
    let cmpAudioMario;
    let jumpAudio;
    function start(_event) {
        viewport = _event.detail;
        fc.Loop.addEventListener("loopFrame" /* fc.EVENT.LOOP_FRAME */, update);
        fc.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        let branch = viewport.getBranch();
        marioTransform = branch.getChildrenByName("MarioTransform")[0];
        marioNode = marioTransform.getChildrenByName("Mario")[0];
        enemiesNodes = branch.getChildrenByName("Enemies")[0];
        goombaNodes = enemiesNodes.getChildren();
        marioTransformComponent = marioTransform.getComponent(fc.ComponentTransform);
        createAnimations(_event);
        // let cmpCamera: fc.ComponentCamera = branch.getComponent(fc.ComponentCamera);
        // cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 1.2, -7);
        cmpCamera = viewport.camera;
        let cmpAudio = branch.getComponent(fc.ComponentAudio);
        cmpAudio.volume = 1;
        loadJumpAudio();
    }
    let isFacingRight = true;
    let isWalking = false;
    let isJumping = false;
    let alreadyJumped = false;
    let currentFloorHeight = 0;
    function update(_event) {
        let deltaTime = fc.Loop.timeFrameGame / 1000;
        marioVelocityY += Script.gravity * deltaTime;
        pos = marioTransformComponent.mtxLocal.translation;
        if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SPACE]) && !isJumping) {
            if (!alreadyJumped) {
                marioVelocityY = marioJumpHeight;
                isJumping = true;
                alreadyJumped = true;
                cmpAudioMario.play(true);
                currentFloorHeight = -10;
            }
        }
        else if (!fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SPACE])) {
            alreadyJumped = false;
        }
        if (pos.y + marioVelocityY > currentFloorHeight) {
            marioSpriteNode.setAnimation(animationJump);
            currentAnimation = animationJump;
        }
        else if (pos.y <= currentFloorHeight) {
            marioVelocityY = 0;
            pos.y = currentFloorHeight;
            marioTransformComponent.mtxLocal.translation = pos;
            isJumping = false;
            if (currentAnimation != animationWalk) {
                marioSpriteNode.setAnimation(animationWalk);
                currentAnimation = animationWalk;
            }
        }
        marioTransformComponent.mtxLocal.translateY(marioVelocityY * deltaTime);
        if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SHIFT_LEFT])) {
            marioWalkSpeed = 8;
            marioSpriteNode.framerate = 30;
        }
        if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.D, fc.KEYBOARD_CODE.ARROW_RIGHT])) {
            if (!isWalking && !isJumping) {
                marioSpriteNode.setAnimation(animationWalk);
                currentAnimation = animationWalk;
                isWalking = true;
            }
            marioTransformComponent.mtxLocal.translateX(deltaTime * marioWalkSpeed);
            if (!isFacingRight) {
                marioSpriteNode.getComponent(fc.ComponentTransform).mtxLocal.rotateY(180);
                isFacingRight = true;
            }
        }
        else if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.A, fc.KEYBOARD_CODE.ARROW_LEFT])) {
            if (!isWalking && !isJumping) {
                marioSpriteNode.setAnimation(animationWalk);
                currentAnimation = animationWalk;
                isWalking = true;
            }
            marioTransformComponent.mtxLocal.translateX(-deltaTime * marioWalkSpeed);
            if (isFacingRight) {
                marioSpriteNode.getComponent(fc.ComponentTransform).mtxLocal.rotateY(180);
                isFacingRight = false;
            }
        }
        else if (!isJumping && !isWalking) {
            marioSpriteNode.setAnimation(animationStand);
            currentAnimation = animationStand;
        }
        else {
            isWalking = false;
        }
        marioWalkSpeed = 4;
        marioSpriteNode.framerate = 15;
        checkCollision();
        //cmpCamera.mtxPivot.translation = new ƒ.Vector3(-pos.x, 1.0, -10);
        updateCamera();
        viewport.draw();
    }
    function updateCamera() {
        let pos = marioTransformComponent.mtxLocal.translation;
        let origin = cmpCamera.mtxPivot.translation;
        cmpCamera.mtxPivot.translation = new fc.Vector3(-pos.x, origin.y, origin.z);
    }
    function loadJumpAudio() {
        jumpAudio = new ƒ.Audio("./Audio/jumpAudio.wav");
        cmpAudioMario = new ƒ.ComponentAudio(jumpAudio, false, false);
        cmpAudioMario.connect(true);
        cmpAudioMario.volume = 1;
    }
    function checkCollision() {
        let floors = viewport.getBranch().getChildrenByName("BaseFloor")[0].getChildrenByName("10x2");
        for (let eightByTwo = 0; eightByTwo < floors.length; eightByTwo++) {
            let currentFloorChunks = floors[eightByTwo].getChildrenByName("GroundFloor");
            for (let singleChunk = 0; singleChunk < currentFloorChunks.length; singleChunk++) {
                let singleBlocks = currentFloorChunks[singleChunk].getChildrenByName("FloorPosition");
                for (let block = 0; block < singleBlocks.length; block++) {
                    let currentBlock = singleBlocks[block];
                    if (Math.abs(pos.x - currentBlock.mtxWorld.translation.x) < 0.5) {
                        let blockPos = currentBlock.mtxWorld.translation;
                        let blockMargin = blockPos.y + 1;
                        if (pos.y < blockMargin) {
                            pos.y = blockMargin;
                            marioTransform.mtxLocal.translation = blockPos;
                            currentFloorHeight = blockMargin;
                            marioVelocityY = 0;
                        }
                    }
                }
            }
        }
    }
    async function createAnimations(_event) {
        let imgSpriteSheetWalk = new fc.TextureImage();
        await imgSpriteSheetWalk.load("./Textures/mariowalkx16Image.png");
        let coatWalk = new fc.CoatTextured(undefined, imgSpriteSheetWalk);
        let imgSpriteSheetStand = new fc.TextureImage();
        await imgSpriteSheetStand.load("./Textures/mariowalkx16Stand.png");
        let coatStand = new fc.CoatTextured(undefined, imgSpriteSheetStand);
        let imgSpriteSheetJump = new fc.TextureImage();
        await imgSpriteSheetJump.load("./Textures/marioJump.png");
        let coatJump = new fc.CoatTextured(undefined, imgSpriteSheetJump);
        let goombaSpriteSheetWalk = new fc.TextureImage();
        await goombaSpriteSheetWalk.load("./Textures/goombaWalk.png");
        let coatGoomba = new fc.CoatTextured(undefined, goombaSpriteSheetWalk);
        animationWalk = new ƒAid.SpriteSheetAnimation("Walk", coatWalk);
        animationWalk.generateByGrid(fc.Rectangle.GET(0, 0, 15, 16), 3, 16, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(16));
        animationStand = new ƒAid.SpriteSheetAnimation("Stand", coatStand);
        animationStand.generateByGrid(fc.Rectangle.GET(0, 0, 14, 16), 1, 16, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(16));
        animationJump = new ƒAid.SpriteSheetAnimation("Jump", coatJump);
        animationJump.generateByGrid(fc.Rectangle.GET(0, 0, 16, 16), 1, 16, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(16));
        animationGoomba = new ƒAid.SpriteSheetAnimation("GoombaWalk", coatGoomba);
        animationGoomba.generateByGrid(fc.Rectangle.GET(0, 0, 18, 16), 2, 16, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(16));
        marioSpriteNode = new ƒAid.NodeSprite("Mario");
        marioSpriteNode.addComponent(new fc.ComponentTransform(new fc.Matrix4x4()));
        marioSpriteNode.setAnimation(animationStand);
        marioSpriteNode.setFrameDirection(1);
        marioSpriteNode.mtxLocal.translateY(-0.5);
        marioSpriteNode.framerate = 15;
        marioTransform.removeAllChildren();
        marioTransform.addChild(marioSpriteNode);
        goombaSpriteNode = new ƒAid.NodeSprite("Goomba");
        goombaSpriteNode.addComponent(new fc.ComponentTransform(new fc.Matrix4x4()));
        goombaSpriteNode.setAnimation(animationGoomba);
        goombaSpriteNode.setFrameDirection(1);
        goombaSpriteNode.mtxLocal.translateY(-0.5);
        goombaSpriteNode.mtxLocal.translateX(4);
        goombaSpriteNode.framerate = 2;
        for (let i = 0; i < 2; i++) {
            goombaNodes[i].removeAllChildren();
            goombaNodes[i].addChild(goombaSpriteNode);
            goombaNodes[i].mtxLocal.translateX(i + 1);
        }
        goombaSpriteNode.removeAllChildren();
        goombaSpriteNode.addChild(marioSpriteNode);
        //marioNode = marioSpriteNode;
        //ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 100);
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map