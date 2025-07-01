import { useState } from 'react';
import './App.css';
import SwitchButton from './components/buttons/switch/Switch.tsx';
import Canvas_2D from "./components/canva-2d/Canva_2D";
import Canvas_3D from "./components/canva-3d/Canva_3D";

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
                <div className="title">Canva React</div>
            </div>

            {/* Sectors */}
            <div className="sectors">
                <div className="left-sector sector">
                    {/* Left Sector Canvas */}
                    <Component/>
                </div>
                <div className="right-sector sector">
                    {/* Right Sector Fields, Inputs, Buttons, etc. */}
                    <SwitchButton text_switch={switchT} onClick={toggleSwitchText}/>
                </div>
            </div>

        </>
    );
};

export default App;
