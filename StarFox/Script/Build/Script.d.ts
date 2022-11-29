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
        private relativeX;
        private relativeY;
        private relativeZ;
        strafeThrust: number;
        forwardthrust: number;
        constructor();
        hndEvent: (_event: Event) => void;
        controlShip: (_event: Event) => void;
        private width;
        private height;
        private xAxis;
        private yAxis;
        handleMouse: (e: MouseEvent) => void;
        setRelativeAxes(): void;
        backwards(): void;
        thrust(): void;
        thrustBoost(): void;
        rollLeft(): void;
        rollRight(): void;
    }
}
