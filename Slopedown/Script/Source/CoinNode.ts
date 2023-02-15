namespace Script {

    import fc = FudgeCore;

    export class CoinNode extends fc.Node {

        constructor(_cords: number) {
            super("Coin");

            let coinTorus: fc.MeshTorus = new fc.MeshTorus("Cointorus", -0.250, 7, 6);

            let coinMesh: fc.ComponentMesh = new fc.ComponentMesh(coinTorus);

            coinMesh.mtxPivot.scaling = new fc.Vector3(2, 1, 2);

            let coinTexture: fc.TextureImage = new fc.TextureImage();
            let coinCoat: fc.CoatTextured = new fc.CoatTextured(undefined, coinTexture);
            
            let coinMat: fc.Material = new fc.Material("coinMat", fc.ShaderLitTextured);

            coinTexture.load(".\\Textures\\goldcoin.png");
            coinMat.coat = coinCoat
            
            let coinMatComp: fc.ComponentMaterial = new fc.ComponentMaterial(coinMat);

            coinMatComp.mtxPivot.scaling = new fc.Vector2(1, 6);

            let coinTransform: fc.ComponentTransform = new fc.ComponentTransform();
            
            coinTransform.mtxLocal.translation = new fc.Vector3(-307, 48, _cords);
            coinTransform.mtxLocal.rotateZ(85);

            let coinRigidBody: fc.ComponentRigidbody = new fc.ComponentRigidbody();
            coinRigidBody.isTrigger = true;
            coinRigidBody.effectGravity = 0;
            coinRigidBody.mtxPivot.scaling = new fc.Vector3(0.9, 0.3, 0.9);
            coinRigidBody.typeBody = fc.BODY_TYPE.STATIC;

            let coinAudio: fc.ComponentAudio = new fc.ComponentAudio();
            let coinScript: CoinComponentScript = new CoinComponentScript();

            this.addComponent(coinMesh);
            this.addComponent(coinMatComp);
            this.addComponent(coinTransform);
            this.addComponent(coinRigidBody);
            this.addComponent(coinAudio);
            this.addComponent(coinScript);


            let animseqRot: fc.AnimationSequence = new fc.AnimationSequence();
            animseqRot.addKey(new fc.AnimationKey(0, 1));
            animseqRot.addKey(new fc.AnimationKey(750, 1.3));
            animseqRot.addKey(new fc.AnimationKey(1500, 1));
        
            let animStructure: fc.AnimationStructure = {
              components: {
                ComponentTransform: [
                  {
                    "ƒ.ComponentTransform": {
                      mtxLocal: {
                        scaling: {
                          x: animseqRot,
                          z: animseqRot
        
                        }
                      }
                    }
                  }
                ]
              }
            };
        
            let fps: number = 30;
        
            let animation: fc.Animation = new fc.Animation("testAnimation", animStructure, fps);
        
            let cmpAnimator: fc.ComponentAnimator = new fc.ComponentAnimator(animation);
            cmpAnimator.scale = 1;
        
            this.addComponent(cmpAnimator);
            cmpAnimator.activate(true);
        }

    }
}