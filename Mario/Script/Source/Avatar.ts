namespace Script {
    import fc = FudgeCore;
    import ƒAid = FudgeAid;

    export enum ACTION {
        IDLE, WALK, SPRINT
    }

    export class Avatar extends ƒAid.NodeSprite {
        readonly speedWalk: number = .9;
        readonly speedSprint: number = 2;
        public ySpeed: number = 0;
        private xSpeed: number = 0;
        private animationCurrent: ƒAid.SpriteSheetAnimation;


        private animWalk: ƒAid.SpriteSheetAnimation;
        private animJump: ƒAid.SpriteSheetAnimation;


        public constructor() {
            super("AvatarInstance");
            this.addComponent(new fc.ComponentTransform());
        }

        public update(_deltaTime: number): void {
            this.ySpeed -= gravity * _deltaTime;
            let yOffset: number = this.ySpeed * _deltaTime;
            this.mtxLocal.translateY(yOffset);
            this.mtxLocal.translateX(this.xSpeed * _deltaTime, true);
        }

        public act(_action: ACTION): void {
            let animation: ƒAid.SpriteSheetAnimation;
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

        public async initializeAnimations(_imgSpriteSheet: fc.TextureImage): Promise<void> {
            let coat: fc.CoatTextured = new fc.CoatTextured(undefined, _imgSpriteSheet);

            this.animWalk = new ƒAid.SpriteSheetAnimation("Walk", coat);
            this.animWalk.generateByGrid(fc.Rectangle.GET(0, 0, 15, 16), 3, 16, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(16));

            this.animJump = new ƒAid.SpriteSheetAnimation("Jump", coat);
            this.animJump.generateByGrid(fc.Rectangle.GET(0, 0, 16, 16), 1, 16, fc.ORIGIN2D.BOTTOMCENTER, fc.Vector2.X(16));

            this.framerate = 20;
        }
    }
}