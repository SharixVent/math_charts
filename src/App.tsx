import { useState } from 'react';
import SwitchButton from './components/buttons/switch/Switch.tsx';
import Canvas_2D from "./components/canva-2d/Canva_2D";
import Canvas_3D from "./components/canva-3d/Canva_3D";
import Popup  from './components/popup/Popup.tsx';
import Field from './components/field/Field.tsx';
import FieldsData from './components/fieldsData/Fields.tsx';
import './App.css';

function App() {

    const [switchT, setSwitchT] = useState<"2D" | "3D">("2D");
    const [showPopup, setShowPopup] = useState(false);

    const handleConfirmSwitch = () => {
        setSwitchT(prev => prev === '2D' ? "3D" : "2D");
        setShowPopup(false);
    };

    const handleShowPopup = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const Component = switchT === '2D' ? Canvas_2D : Canvas_3D;

    const change = switchT === '2D' ? "3D" : "2D";

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
                    <SwitchButton text_switch={switchT} onClick={handleShowPopup}/>
                    {/* <Field title='Title' placeholder='placeholder' width={300}/> */}
                </div>
            </div>  

            {showPopup && (
                <Popup
                    title={`Are your sure you want to change to '${change}' mode?`}
                    content="Your data will be lost"
                    onClose={handleClosePopup}
                    onConfirm={handleConfirmSwitch}
                />
            )}
        </>
    );
};

export default App;