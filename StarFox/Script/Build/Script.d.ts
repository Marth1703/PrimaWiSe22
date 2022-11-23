declare namespace Script {
    import fc = FudgeCore;
    class CustomComponentScript extends fc.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        speed: number;
        constructor();
        hndEvent: (_event: Event) => void;
        rotateShip: (_event: Event) => void;
    }
}
declare namespace Script {
}
declare namespace Script {
    import fc = FudgeCore;
    class StarShipScript extends fc.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        speed: number;
        constructor();
        hndEvent: (_event: Event) => void;
        controlShip: (_event: Event) => void;
    }
}
