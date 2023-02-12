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
    let viewport: fc.Viewport;
    let vui: VUI;
    let currentTime: number;
    let isAirborne: boolean;
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
        private enteredDeathPlane;
        private onSlope;
    }
}
declare namespace Script {
    import fc = FudgeCore;
    class VUI extends fc.Mutable {
        protected reduceMutator(_mutator: fc.Mutator): void;
        velocity: string;
        time: string;
        private controller;
        constructor();
    }
}
