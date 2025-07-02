import { useState } from 'react';
import './App.css';
import SwitchButton from './components/buttons/switch/Switch.tsx';
import Canvas_2D from "./components/canva-2d/Canva_2D";
import Canvas_3D from "./components/canva-3d/Canva_3D";
import { Popup } from './components/popup/Popup.tsx';
import Fields from './components/fields/Fields.tsx';

function App() {

    const [switchT, setSwitchT] = useState<"2D" | "3D">("2D");

    const toggleSwitchText = () => {
        setSwitchT(prev => prev === '2D' ? "3D" : "2D");
    }

    const Component = switchT === '2D' ? Canvas_2D : Canvas_3D;

    return (
        <>

            {/* Title and logo */}
            <div className="title-sector">
                <img src="/logo.png" className='logo' alt="Logo" />
                <div className="title">Math Charts</div>
            </div>

            {/* Sectors */}
            <div className="sectors">
                <div className="sector">
                    {/* Left Sector Canvas */}
                    <Component/>
                </div>
                <div className="sector">
                    {/* Right Sector Fields, Inputs, Buttons, etc. */}
                    <SwitchButton text_switch={switchT} onClick={toggleSwitchText}/>
                    <Fields title='' placeholder='test' width={300}/>
                </div>
            </div>

        </>
    );
};

export default App;
