declare namespace Script {
    import fc = FudgeCore;
    class AvatarComponentScript extends fc.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private rigidbody;
        constructor();
        hndEvent: (_event: Event) => void;
        handleInputs: (_event: Event) => void;
        moveRight(): void;
        moveLeft(): void;
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
}
