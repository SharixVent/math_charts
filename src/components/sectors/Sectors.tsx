import React, { useState } from 'react';
import Canvas_2D from '../canva-2d/Canva_2D';
import Canvas_3D from '../canva-3d/Canva_3D'; 
import SwitchButton from '../buttons/switch/Switch';
import Field from '../field/Field';
import Popup from '../popup/Popup';

export const Sectors: React.FC = () => {

    const [switchT, setSwitchT] = useState<"2D" | "3D">("2D");
    const [showPopup, setShowPopup] = useState(false);
    const [data, setData] = useState(
            Array.from({ length: 100 }, (_,index) => {
            const x: number = index * 0.1;
            const y: number = Math.sin(x);
            return {x, y}
            })
        )

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
        <div className="sectors">
            <div className="sector">
                {/* Left Sector Canvas */}
                <Component data={data}/>
            </div>
            <div className="sector">
                {/* Right Sector Fields, Inputs, Buttons, etc. */}
                <SwitchButton text_switch={switchT} onClick={handleShowPopup}/>
                <Field 
                    title='Title' 
                    placeholder='placeholder' 
                    width={300} 
                    data={data} 
                    setData={setData}
                />
            </div>
            {showPopup && (
                <Popup
                    title={`Are your sure you want to change to '${change}' mode?`}
                    content="Your data will be lost"
                    onClose={handleClosePopup}
                    onConfirm={handleConfirmSwitch}
                />
            )}
        </div>
    );
};

export default Sectors;