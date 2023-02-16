namespace Script {

    import fc = FudgeCore;

    export class FenceNode extends fc.Node {

        constructor(_cords: fc.Vector3) {
            super("Fence");
            let Leg1: fc.Node = new fc.Node("leg1");
            let Leg2: fc.Node = new fc.Node("leg2");

            let FenceCube: fc.MeshCube = new fc.MeshCube("fence");
            let Leg1Cube: fc.MeshCube = new fc.MeshCube("Leg1C");
            let Leg2Cube: fc.MeshCube = new fc.MeshCube("Leg2C");

            let FenceMesh: fc.ComponentMesh = new fc.ComponentMesh(FenceCube);
            let Leg1Mesh: fc.ComponentMesh = new fc.ComponentMesh(Leg1Cube);
            let Leg2Mesh: fc.ComponentMesh = new fc.ComponentMesh(Leg2Cube);

            FenceMesh.mtxPivot.scaling = new fc.Vector3(0.3, 1, 4);
            Leg1Mesh.mtxPivot.scaling = new fc.Vector3(0.4, 2, 0.4);
            Leg2Mesh.mtxPivot.scaling = new fc.Vector3(0.4, 2, 0.4);

            let woodTexture: fc.TextureImage = new fc.TextureImage();
            let fenceCoat: fc.CoatTextured = new fc.CoatTextured(undefined, woodTexture);
            
            let woodMat: fc.Material = new fc.Material("coinMat", fc.ShaderLitTextured);

            woodTexture.load(".\\Textures\\woodtexture.png");
            woodMat.coat = fenceCoat
            
            let woodMatComp: fc.ComponentMaterial = new fc.ComponentMaterial(woodMat);
            let woodMatComp2: fc.ComponentMaterial = new fc.ComponentMaterial(woodMat);
            let woodMatComp3: fc.ComponentMaterial = new fc.ComponentMaterial(woodMat);

            let FenceTransform: fc.ComponentTransform = new fc.ComponentTransform();
            let Leg1Transform: fc.ComponentTransform = new fc.ComponentTransform();
            let Leg2Transform: fc.ComponentTransform = new fc.ComponentTransform();
            
            FenceTransform.mtxLocal.translation = _cords;
            Leg1Transform.mtxLocal.translation = new fc.Vector3(0.2, -0.2, 1.2);
            Leg2Transform.mtxLocal.translation = new fc.Vector3(0.2, -0.2, -1.2);

            let FenceRigidBody: fc.ComponentRigidbody = new fc.ComponentRigidbody();

            FenceRigidBody.typeBody = fc.BODY_TYPE.STATIC;
            FenceRigidBody.effectGravity = 0;
            FenceRigidBody.mtxPivot.translation = new fc.Vector3(0.1, -0.1, 0);
            FenceRigidBody.mtxPivot.scaling = new fc.Vector3(0.7, 2, 4.1);
            FenceRigidBody.mtxPivot.rotateZ(-4);


            this.addComponent(FenceMesh);
            this.addComponent(woodMatComp);
            this.addComponent(FenceTransform);
            this.addComponent(FenceRigidBody);

            Leg1.addComponent(Leg1Mesh);
            Leg1.addComponent(woodMatComp2);
            Leg1.addComponent(Leg1Transform);

            Leg2.addComponent(Leg2Mesh);
            Leg2.addComponent(woodMatComp3);
            Leg2.addComponent(Leg2Transform);
            
            this.addChild(Leg1);
            this.addChild(Leg2);
        }
    }
}