namespace Script {

    import fc = FudgeCore;

    export class RingNode extends fc.Node {

        constructor() {
            super("Ring");
            let innerRing: fc.Node = new fc.Node("boostCylinder");

            let outerRingTorus: fc.MeshTorus = new fc.MeshTorus("outerRingM", 0.08, 15, 10);
            let innerRingTorus: fc.MeshTorus = new fc.MeshTorus("innerRingM", 0.05, 15, 10);

            let outerRingMesh: fc.ComponentMesh = new fc.ComponentMesh(outerRingTorus);
            let innerRingMesh: fc.ComponentMesh = new fc.ComponentMesh(innerRingTorus);

            outerRingMesh.mtxPivot.scaling = new fc.Vector3(10, 10, 7);
            innerRingMesh.mtxPivot.scaling = new fc.Vector3(9, 9, 6);

            let outerMat: fc.Material = new fc.Material("ringMaterialOut", fc.ShaderGouraud);
            let innerMat: fc.Material = new fc.Material("ringMaterialIn", fc.ShaderLit);
            
            let outerMatComp: fc.ComponentMaterial = new fc.ComponentMaterial(outerMat);
            let innerMatComp: fc.ComponentMaterial = new fc.ComponentMaterial(innerMat);

            outerMatComp.clrPrimary= new fc.Color(0.31, 0.41, 0.6);
            innerMatComp.clrPrimary = new fc.Color(0.97, 0.86, 0.21);

            let outerRingTransform: fc.ComponentTransform = new fc.ComponentTransform();
            
            outerRingTransform.mtxLocal.translation = new fc.Vector3(-90, 28, -6);
            outerRingTransform.mtxLocal.rotateZ(85);

            let outerRingRigidBody: fc.ComponentRigidbody = new fc.ComponentRigidbody();
            outerRingRigidBody.isTrigger = true;
            outerRingRigidBody.effectGravity = 0;
            outerRingRigidBody.mtxPivot.translateX(1);
            outerRingRigidBody.mtxPivot.scaling = new fc.Vector3(4, 1, 1.5);

            let ringScript: RingComponentScript = new RingComponentScript();

            this.addComponent(outerRingMesh);
            this.addComponent(outerMatComp);
            this.addComponent(outerRingTransform);
            this.addComponent(outerRingRigidBody);
            this.addComponent(ringScript);

            innerRing.addComponent(innerRingMesh);
            innerRing.addComponent(innerMatComp);
            
            this.addChild(innerRing);
        }
    }
}