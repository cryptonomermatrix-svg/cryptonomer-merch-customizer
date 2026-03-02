import React, { useState } from 'react';
import ThreeViewer from './components/ThreeViewer';
import './App.css';

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
