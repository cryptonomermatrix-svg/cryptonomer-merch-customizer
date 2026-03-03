import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';

// Embedded ThreeViewer (all in one file)
function ThreeViewer({
  productType,
  colorHex,
  sizeScale,
  designUrl,
}: {
  productType: 'tshirt' | 'hoodie';
  colorHex: string;
  sizeScale: number;
  designUrl?: string;
}) {
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
          mat.map = texture;
          mat.needsUpdate = true;
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

function App() {
  const [productType, setProductType] = useState<'tshirt' | 'hoodie'>('tshirt');
  const [colorHex, setColorHex] = useState('#ffffff');
  const [sizeScale, setSizeScale] = useState(1.0);
  const [designUrl, setDesignUrl] = useState<string | undefined>(undefined);

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem', background: '#111', color: 'white', textAlign: 'center' }}>
        <h1>Cryptonomer Merch Customizer</h1>
        <div style={{ margin: '1rem 0' }}>
          <button onClick={() => setProductType('tshirt')} style={{ margin: '0 0.5rem' }}>T-Shirt</button>
          <button onClick={() => setProductType('hoodie')} style={{ margin: '0 0.5rem' }}>Hoodie</button>
          <input
            type="color"
            value={colorHex}
            onChange={(e) => setColorHex(e.target.value)}
            style={{ margin: '0 1rem', width: '50px', height: '40px' }}
          />
          <select onChange={(e) => setSizeScale(Number(e.target.value))} style={{ padding: '0.5rem' }}>
            <option value={0.92}>S</option>
            <option value={1.0}>M</option>
            <option value={1.08}>L</option>
            <option value={1.12}>XL</option>
            <option value={1.18}>XXL</option>
          </select>
          <input
            type="text"
            placeholder="Paste design PNG URL"
            onChange={(e) => setDesignUrl(e.target.value || undefined)}
            style={{ marginLeft: '1rem', padding: '0.5rem', width: '300px' }}
          />
        </div>
      </header>

      <div style={{ flex: 1 }}>
        <ThreeViewer
          productType={productType}
          colorHex={colorHex}
          sizeScale={sizeScale}
          designUrl={designUrl}
        />
      </div>
    </div>
  );
}

export default App;
