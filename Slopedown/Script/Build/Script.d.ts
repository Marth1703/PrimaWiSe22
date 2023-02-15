declare namespace Script {
    import fc = FudgeCore;
    class AvatarComponentScript extends fc.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private rigidbody;
        private currentVelocity;
        private jumpHeight;
        constructor();
        hndEvent: (_event: Event) => void;
        private update;
        handleInputs: (_event: Event) => void;
        addJumpVelocity(): void;
        applyJumpVelocity(velo: number): void;
        moveRight(): void;
        moveLeft(): void;
        moveForward(): void;
        moveBrake(): void;
    }
}
declare namespace Script {
    import fc = FudgeCore;
    class CoinComponentScript extends fc.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private coinSound;
        private coinBody;
        constructor();
        hndEvent: (_event: Event) => void;
        private collectCoin;
    }
}
declare namespace Script {
    import fc = FudgeCore;
    class CoinNode extends fc.Node {
        constructor(_cords: number);
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import fc = FudgeCore;
    class FenceNode extends fc.Node {
        constructor();
    }
}
declare namespace Script {
    import fc = FudgeCore;
    class FinishComponentScript extends fc.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private finishBody;
        constructor();
        hndEvent: (_event: Event) => void;
        crossedLine: () => void;
    }
}
declare namespace Script {
    import fc = FudgeCore;
    let viewport: fc.Viewport;
    let vui: VUI;
    let currentTime: number;
    let isAirborne: boolean;
    let avatar: fc.Node;
    let currentCoins: number;
    let componentAudio: fc.ComponentAudio;
}
declare namespace Script {
    import fc = FudgeCore;
    class RingComponentScript extends fc.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private boostSound;
        private boostCylinder;
        constructor();
        hndEvent: (_event: Event) => void;
        private receiveBoost;
    }
}
declare namespace Script {
    import fc = FudgeCore;
    class RingNode extends fc.Node {
        constructor();
    }
}
declare namespace Script {
    import fc = FudgeCore;
    class SlopeComponentScript extends fc.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private deathPlane;
        private colliderPlane;
        constructor();
        hndEvent: (_event: Event) => void;
        private onSlope;
        playerRespawn: () => void;
    }
}
declare namespace Script {
    import fc = FudgeCore;
    class TreeNode extends fc.Node {
        constructor();
    }
}
declare namespace Script {
    import fc = FudgeCore;
    class VUI extends fc.Mutable {
        protected reduceMutator(_mutator: fc.Mutator): void;
        velocity: string;
        time: string;
        coins: string;
        score: string;
        final: string;
        private controller;
        constructor();
    }
}
