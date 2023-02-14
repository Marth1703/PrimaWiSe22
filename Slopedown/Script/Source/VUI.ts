namespace Script {
    import fc = FudgeCore;
    import fui = FudgeUserInterface;

    export class VUI extends fc.Mutable {
        protected reduceMutator(_mutator: fc.Mutator): void { /**/ }

        public velocity: string; 
        public time: string;
        public coins: string;
        private controller: fui.Controller;
        
        constructor (){ 
            super();    
            this.controller = new fui.Controller(this, document.querySelector("#vui"));
            console.log(this.controller);
        }
    }
}