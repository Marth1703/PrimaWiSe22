declare namespace Script {
    import fc = FudgeCore;
    import ƒAid = FudgeAid;
    enum ACTION {
        IDLE = 0,
        WALK = 1,
        SPRINT = 2
    }
    class Avatar extends ƒAid.NodeSprite {
        readonly speedWalk: number;
        readonly speedSprint: number;
        ySpeed: number;
        private xSpeed;
        private animationCurrent;
        private animWalk;
        private animJump;
        constructor();
        update(_deltaTime: number): void;
        act(_action: ACTION): void;
        initializeAnimations(_imgSpriteSheet: fc.TextureImage): Promise<void>;
    }
}
declare namespace Script {
    import fc = FudgeCore;
    class CubeRotatorScript extends fc.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        speed: number;
        constructor();
        hndEvent: (_event: Event) => void;
        rotateCube: (_event: Event) => void;
    }
}
declare namespace Script {
    let gravity: number;
}
