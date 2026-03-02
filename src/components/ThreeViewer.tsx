import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeViewerProps {
  productType: 'tshirt' | 'hoodie';
  colorHex: string;
  sizeScale: number;
  designUrl?: string;
}

export default function ThreeViewer({
  productType,
  colorHex,
  sizeScale,
  designUrl,
}: ThreeViewerProps) {
  const clothingGroupRef = useRef<THREE.Group>(null!);

  const { scene: headScene } = useGLTF('/models/retro-head.glb');
  const { scene: baseScene } = useGLTF(
    productType === 'tshirt' ? '/models/tshirt-base.glb' : '/models/hoodie-base.glb'
  );

  const clothingModel = baseScene.clone();

  useEffect(() => {
    clothingModel.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.color.set(colorHex);
        mat.needsUpdate = true;
      }
    });
  }, [colorHex, clothingModel]);

  useEffect(() => {
    if (!designUrl) return;
    const loader = new THREE.TextureLoader();
    loader.load(designUrl, (texture) => {
      texture.flipY = false;
      clothingModel.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          if (['front', 'back', 'leftsleeve', 'rightsleeve'].some(name => child.name.toLowerCase().includes(name))) {
            mat.map = texture;
            mat.needsUpdate = true;
          }
        }
      });
    });
  }, [designUrl, clothingModel]);

  useEffect(() => {
    if (clothingGroupRef.current) {
      clothingGroupRef.current.scale.set(sizeScale, sizeScale, sizeScale);
    }
  }, [sizeScale]);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <Environment preset="studio" />

      <group position={[0, -0.8, 0]}>
        <primitive object={headScene} scale={1} position={[0, 1.6, 0]} />
        <group ref={clothingGroupRef}>
          <primitive object={clothingModel} />
        </group>
      </group>

      <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={8} blur={2} />
      <OrbitControls enablePan={false} minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI - Math.PI / 6} rotateSpeed={0.8} />
    </>
  );
}
