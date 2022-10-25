"use strict";
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
    var ƒAid = FudgeAid;
    fc.Debug.info("Main Program Template running!");
    let viewport;
    let deltaTime;
    let pos;
    let marioSpriteNode;
    let goombaSpriteNode;
    document.addEventListener("interactiveViewportStarted", start);
    let marioTransform;
    let marioNode;
    let marioTransformComponent;
    let enemiesNodes;
    let goombaNodes;
    let gravity = -2.5;
    let marioWalkSpeed = 5;
    let marioVelocityY = 0;
    let marioJumpHeight = 0.5;
    let animationWalk;
    let animationStand;
    let animationGoomba;
    let animationJump;
    function start(_event) {
        viewport = _event.detail;
        fc.Loop.addEventListener("loopFrame" /* fc.EVENT.LOOP_FRAME */, update);
        fc.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        console.log(viewport);
        let branch = viewport.getBranch();
        console.log(branch);
        marioTransform = branch.getChildrenByName("MarioTransform")[0];
        marioNode = marioTransform.getChildrenByName("Mario")[0];
        enemiesNodes = branch.getChildrenByName("Enemies")[0];
        goombaNodes = enemiesNodes.getChildren();
        marioTransformComponent = marioTransform.getComponent(fc.ComponentTransform);
        console.log("Mario:");
        hndLoad(_event);
    }
    let isFacingRight = true;
    let isWalking = false;
    let isJumping = false;
    let alreadyJumped = false;
    function update(_event) {
        deltaTime = fc.Loop.timeFrameGame / 1000;
        marioVelocityY += gravity * deltaTime;
        marioTransformComponent.mtxLocal.translateY(marioVelocityY);
        pos = marioTransformComponent.mtxLocal.translation;
        if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SPACE]) && !isJumping) {
            if (!alreadyJumped) {
                marioVelocityY = marioJumpHeight;
                isJumping = true;
                alreadyJumped = true;
            }
        }
        else if (!fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SPACE])) {
            alreadyJumped = false;
        }
        if (pos.y + marioVelocityY > 0) {
            marioSpriteNode.setAnimation(animationJump);
            marioTransformComponent.mtxLocal.translateY(marioVelocityY * deltaTime);
        }
        else {
            marioVelocityY = 0;
            pos.y = 0;
            marioTransformComponent.mtxLocal.translation = pos;
            isJumping = false;
        }
        if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.SHIFT_LEFT])) {
            marioWalkSpeed = 10;
            marioSpriteNode.framerate = 30;
        }
        if (fc.Keyboard.isPressedOne([fc.KEYBOARD_CODE.D, fc.KEYBOARD_CODE.ARROW_RIGHT])) {
            if (!isWalking && !isJumping) {
                marioSpriteNode.setAnimation(animationWalk);
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
                isWalking = true;
            }
            marioTransformComponent.mtxLocal.translateX(-deltaTime * marioWalkSpeed);
            if (isFacingRight) {
                marioSpriteNode.getComponent(fc.ComponentTransform).mtxLocal.rotateY(180);
                isFacingRight = false;
            }
        }
        else if (!isJumping) {
            marioSpriteNode.setAnimation(animationStand);
            isWalking = false;
        }
        marioWalkSpeed = 5;
        marioSpriteNode.framerate = 15;
        viewport.draw();
    }
    async function hndLoad(_event) {
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