import React, { useState, useEffect } from 'react';
import Canvas_2D from '../canva-2d/Canva_2D';
import Canvas_3D from '../canva-3d/Canva_3D'; 
import SwitchButton from '../buttons/switch/Switch';
import FieldsData from '../fieldsData/Fields';
import Popup from '../popup/Popup';
import './Sectors.css'

export const Sectors: React.FC = () => {

    const [formJson, setFormJson] = useState<{ [key: string]: any }>({});
    const [switchT, setSwitchT] = useState<"2D" | "3D">("2D");
    const [showPopup, setShowPopup] = useState(false);
    const [data, setData] = useState<{x: number; y: number}[]>();
    useEffect(() => {
        const length = Number(formJson.range) || 100;
        const newData = Array.from({ length }, (_, index) => {
            const x = index * 0.1;
            const y = Math.sin(x);
            return { x, y };
        });
        setData(newData);
    }, [formJson]);

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

    function handleSumbit(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const formJson = Object.fromEntries(formData.entries());
        setFormJson(formJson)
    }

    const Component = switchT === '2D' ? Canvas_2D : Canvas_3D;
    const change = switchT === '2D' ? "3D" : "2D";

    return (
        <div className="sectors">
            <div className="sector">
                {/* Left Sector Canvas */}
                <Component data={data ?? []}/>
            </div>
            <div className="sector">
                {/* Right Sector Fields, Inputs, Buttons, etc. */}
                <SwitchButton text_switch={switchT} onClick={handleShowPopup}/>
                <FieldsData handleSumbit={handleSumbit}/>
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